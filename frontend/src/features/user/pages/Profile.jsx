import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import Nav from "../../shared/components/Nav"
import { followUser, getProfile, unfollowUser } from "../services/user.api"
import { getApiError } from "../../shared/services/api"

function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        setLoading(true)
        setError("")
        const data = await getProfile(username)
        if (mounted) setProfile(data)
      } catch (err) {
        if (mounted) setError(getApiError(err, "Failed to load profile"))
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      mounted = false
    }
  }, [username])

  async function handleFollowToggle() {
    if (!profile) return
    const nextFollowing = !profile.isFollowing
    setProfile({ ...profile, isFollowing: nextFollowing })
    try {
      if (nextFollowing) await followUser(username)
      else await unfollowUser(username)
    } catch (err) {
      setProfile({ ...profile, isFollowing: !nextFollowing })
      setError(getApiError(err, "Could not update follow state"))
    }
  }

  return (
    <main className="app-shell">
      <Nav />
      {loading && <p className="state-text">Loading profile...</p>}
      {error && <p className="form-error">{error}</p>}
      {profile && (
        <section className="profile-panel">
          <img src={profile.user.profileImage} alt={profile.user.username} />
          <div className="profile-copy">
            <div className="profile-title">
              <h1>{profile.user.username}</h1>
              {profile.isOwnProfile ? (
                <Link className="button secondary-button" to="/edit-profile">Edit profile</Link>
              ) : (
                <button className="button primary-button" onClick={handleFollowToggle}>
                  {profile.isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
            <div className="profile-stats">
              <span><strong>{profile.stats.postsCount}</strong> posts</span>
              <span><strong>{profile.stats.followersCount}</strong> followers</span>
              <span><strong>{profile.stats.followingCount}</strong> following</span>
            </div>
            <h2>{profile.user.name}</h2>
            <p>{profile.user.bio}</p>
            {profile.user.website && <a href={profile.user.website}>{profile.user.website}</a>}
          </div>
        </section>
      )}
    </main>
  )
}

export default Profile
