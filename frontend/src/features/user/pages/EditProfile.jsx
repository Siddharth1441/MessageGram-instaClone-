import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import Nav from "../../shared/components/Nav"
import { getApiError } from "../../shared/services/api"
import { updateProfile } from "../services/user.api"

function EditProfile() {
  const { user, setUser, setError } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name:user?.name || "",
    bio:user?.bio || "",
    website:user?.website || "",
    profileImage:user?.profileImage || "",
    isPrivate:Boolean(user?.isPrivate)
  })
  const [saving, setSaving] = useState(false)
  const [error, setLocalError] = useState("")

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]:value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setSaving(true)
      setLocalError("")
      const response = await updateProfile(form)
      setUser(response.user)
      setError("")
      navigate(`/profile/${response.user.username}`)
    } catch (err) {
      setLocalError(getApiError(err, "Failed to update profile"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="app-shell">
      <Nav />
      <section className="form-container">
        <h1>Edit profile</h1>
        {error && <p className="form-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Name" />
          <input value={form.profileImage} onChange={(e) => updateField("profileImage", e.target.value)} placeholder="Profile image URL" />
          <input value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="Website" />
          <textarea value={form.bio} onChange={(e) => updateField("bio", e.target.value)} placeholder="Bio" maxLength={150} />
          <label className="inline-check">
            <input checked={form.isPrivate} onChange={(e) => updateField("isPrivate", e.target.checked)} type="checkbox" />
            Private account
          </label>
          <button className="button primary-button" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </form>
      </section>
    </main>
  )
}

export default EditProfile
