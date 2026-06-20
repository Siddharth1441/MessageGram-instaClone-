import React, { useEffect } from 'react'
import "../style/feed.scss"
import Post from '../components/Post'
import { usePost } from '../hook/usePost'
import Nav from '../../shared/components/Nav'

const Feed = () => {
  const { feed, loading, error, handleGetfeed } = usePost()

  useEffect(() => {
    handleGetfeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading || !feed) {
    return (
      <main className="feed-page">
        <Nav />
        <p className="state-text">Loading your MessageGram feed...</p>
      </main>
    )
  }

  const storyUsers = feed
    .map((post) => post.user)
    .filter(Boolean)
    .filter((user, index, users) => users.findIndex((item) => item.username === user.username) === index)
    .slice(0, 8)

  return (
    <main className="feed-page">
      <Nav />
      <div className="feed-layout">
        <section className="feed">
          <div className="stories-rail">
            {storyUsers.map((storyUser) => (
              <a className="story-chip" href={`/profile/${storyUser.username}`} key={storyUser.username}>
                <img src={storyUser.profileImage} alt={storyUser.username} />
                <span>{storyUser.username}</span>
              </a>
            ))}
            {!storyUsers.length && (
              <div className="story-chip muted">
                <span className="empty-story">+</span>
                <span>New story</span>
              </div>
            )}
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="posts">
            {feed.map((post) => {
              return <Post key={post._id} user={post.user} post={post} />
            })}
            {!feed.length && <p className="state-text">No posts yet. Create the first one.</p>}
          </div>
        </section>
        <aside className="right-rail">
          <div className="suggestion-card">
            <h2>MessageGram</h2>
            <p>Follow people, share posts, and keep the conversation moving.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Feed
