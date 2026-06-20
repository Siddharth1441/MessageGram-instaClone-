import React, { useState } from 'react'
import { Link } from 'react-router'
import { usePost } from '../hook/usePost'

const Post = ({ user, post }) => {
  const { handleLike, handleUnlike, handleSaveToggle, handleGetComments, handleCreateComment } = usePost()
  const [activeMedia, setActiveMedia] = useState(0)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const media = post.media?.length ? post.media : [{ url:post.imageUrl, type:"image" }]

  async function toggleComments() {
    const nextOpen = !commentsOpen
    setCommentsOpen(nextOpen)
    if (nextOpen && !comments.length) {
      const loadedComments = await handleGetComments(post._id)
      setComments(loadedComments)
    }
  }

  async function submitComment(event) {
    event.preventDefault()
    if (!commentText.trim()) return
    const newComment = await handleCreateComment(post._id, commentText)
    setComments((current) => [newComment, ...current])
    setCommentText("")
  }

  return (
    <article className="post">
      <header className="user">
        <Link className="user-link" to={`/profile/${user.username}`}>
          <div className="img-wrapper">
            <img src={user.profileImage} alt={user.username} />
          </div>
          <span>{user.username}</span>
        </Link>
        <button className="more-button" aria-label="More post options">⋯</button>
      </header>

      <div className="media-frame">
        {media[activeMedia]?.type === "video" ? (
          <video src={media[activeMedia].url} controls playsInline />
        ) : (
          <img src={media[activeMedia]?.url} alt={post.caption || "MessageGram post"} />
        )}
        {media.length > 1 && (
          <div className="carousel-controls">
            <button aria-label="Previous media" disabled={activeMedia === 0} onClick={() => setActiveMedia((index) => index - 1)}>{"‹"}</button>
            <span>{activeMedia + 1}/{media.length}</span>
            <button aria-label="Next media" disabled={activeMedia === media.length - 1} onClick={() => setActiveMedia((index) => index + 1)}>{"›"}</button>
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="icons">
          <div className="left">
            <button className={post.isLiked ? "icon-button like" : "icon-button"} onClick={() => { post.isLiked ? handleUnlike(post._id) : handleLike(post._id) }} aria-label="Like post">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M12.001 4.529c2.349-2.109 5.98-2.039 8.242.228 2.256 2.262 2.32 5.88.195 8.218l-8.437 8.385-8.437-8.385C1.44 10.637 1.504 7.019 3.76 4.757c2.262-2.267 5.893-2.337 8.242-.228z" />
              </svg>
            </button>
            <button className="icon-button" onClick={toggleComments} aria-label="Open comments">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button className="icon-button" onClick={() => navigator.clipboard?.writeText(window.location.href)} aria-label="Share post">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
              </svg>
            </button>
          </div>

          <button className={post.isSaved ? "icon-button saved" : "icon-button"} onClick={() => handleSaveToggle(post._id, post.isSaved)} aria-label="Save post">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={post.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M6 3H18C18.5523 3 19 3.44772 19 4V21L12 17L5 21V4C5 3.44772 5.44772 3 6 3Z" />
            </svg>
          </button>
        </div>

        <p className="meta-line">{post.likesCount || 0} likes · {post.commentsCount || 0} comments</p>
        <p className="caption"><strong>{user.username}</strong> {post.caption}</p>
        {commentsOpen && (
          <div className="comments">
            <form onSubmit={submitComment}>
              <input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." />
              <button className="button secondary-button" type="submit">Post</button>
            </form>
            {comments.map((comment) => (
              <p key={comment._id}><strong>{comment.user?.username}</strong> {comment.text}</p>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default Post
