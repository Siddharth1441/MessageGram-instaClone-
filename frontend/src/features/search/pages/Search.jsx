import { useState } from "react"
import { Link } from "react-router"
import Nav from "../../shared/components/Nav"
import { searchPosts } from "../../post/services/post.api"
import { searchUsers } from "../../user/services/user.api"

function Search() {
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    const [userResults, postResults] = await Promise.all([
      searchUsers(query),
      searchPosts(query)
    ])
    setUsers(userResults.users || [])
    setPosts(postResults.posts || [])
    setLoading(false)
  }

  return (
    <main className="app-shell">
      <Nav />
      <section className="search-panel">
        <form onSubmit={handleSubmit}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users, captions, hashtags" />
          <button className="button primary-button">Search</button>
        </form>
        {loading && <p className="state-text">Searching...</p>}
        <div className="result-section">
          <h2>People</h2>
          {users.map((user) => (
            <Link className="user-row" to={`/profile/${user.username}`} key={user.id}>
              <img src={user.profileImage} alt={user.username} />
              <span>{user.username}</span>
            </Link>
          ))}
        </div>
        <div className="explore-grid">
          {posts.map((post) => (
            <img key={post._id} src={post.imageUrl || post.media?.[0]?.url} alt={post.caption} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Search
