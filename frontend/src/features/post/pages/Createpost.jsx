import React, { useState, useRef } from 'react'
import "../nav.scss"
import "../style/createPost.scss"
import { usePost } from '../hook/usePost'
import { useNavigate } from 'react-router'
import Nav from '../../shared/components/Nav'

const Createpost = () => {
    const [caption, setCaption] = useState("")
    const [previewUrls, setPreviewUrls] = useState([])
    const postImageInputRef = useRef(null)
    const { loading, handleCreatePost } = usePost()
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        const files = Array.from(postImageInputRef.current.files || [])
        if (!files.length) return
        await handleCreatePost(files, caption)
        navigate('/')
    }

    function handleFileChange(event) {
        const files = Array.from(event.target.files || [])
        setPreviewUrls(files.map((file) => URL.createObjectURL(file)))
    }

    if (loading) {
        return (
            <main className="create-post-page">
                <Nav />
                <p className="state-text">Creating post...</p>
            </main>
        )
    }

    return (
        <main className="create-post-page">
            <Nav />
            <div className="composer-card">
                <h1>Create a MessageGram post</h1>
                <form onSubmit={handleSubmit}>
                    <label className="post-image-label" htmlFor="postImg">Select media</label>
                    <input ref={postImageInputRef} onChange={handleFileChange} type="file" accept="image/*,video/*" multiple name="postImg" id="postImg" hidden />
                    {!!previewUrls.length && (
                        <div className="preview-grid">
                            {previewUrls.map((url) => <img key={url} src={url} alt="Selected preview" />)}
                        </div>
                    )}
                    <textarea
                        value={caption}
                        onChange={(event) => { setCaption(event.target.value) }}
                        name="caption"
                        id="caption"
                        placeholder="Write a caption..."
                        rows="4"
                    />
                    <button className="button primary-button">Share</button>
                </form>
            </div>
        </main>
    )
}

export default Createpost
