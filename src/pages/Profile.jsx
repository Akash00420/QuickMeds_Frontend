import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Camera, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'
import api from '../store/Api'
import '../assets/custom.css'

// TODO: replace with a real thunk (e.g. updateProfile) in AuthSlice once
// a "PATCH /users/:id" (or similar) endpoint exists on the backend.
async function updateProfileRequest(payload) {
  const res = await api.put('/users/update-profile', payload)
  return res.data
}

// TODO: replace with a real thunk once a stats endpoint exists
// (e.g. GET /orders/summary, GET /reservations/summary).
async function fetchProfileStats() {
  const res = await api.get('/users/profile-stats')
  return res.data
}

function formatMemberSince(dateString) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function formatAddress(address) {
  if (!address) return ''
  if (typeof address === 'string') return address // fallback, just in case
  return [address.street, address.city, address.state, address.pincode]
    .filter(Boolean)
    .join(', ')
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Profile() {
  const authUser = useSelector(state => state.auth.user)

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: 'Customer',
    memberSince: '',
  })

  const [stats, setStats] = useState([
    { label: 'Total Orders', value: '—' },
    { label: 'Active Since', value: '—' },
    { label: 'Reservations', value: '—' },
  ])

  const [savedSection, setSavedSection] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Hydrate the form from the logged-in user in Redux whenever it changes
  useEffect(() => {
    if (!authUser) return
    setProfile({
      fullName: authUser.name || authUser.fullName || '',
      email: authUser.email || '',
      phone: authUser.phone || '',
      address: formatAddress(authUser.address),
      role: authUser.role
        ? authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1)
        : 'Customer',
      memberSince: formatMemberSince(authUser.createdAt),
    })
  }, [authUser])

  // Pull real stats from the backend instead of hardcoding them
  useEffect(() => {
    let cancelled = false
    if (!authUser) return

    fetchProfileStats()
      .then(data => {
        if (cancelled) return
        setStats([
          { label: 'Total Orders', value: data?.totalOrders ?? 0 },
          { label: 'Active Since', value: data?.activeSince ?? formatMemberSince(authUser.createdAt) },
          { label: 'Reservations', value: data?.reservations ?? 0 },
        ])
      })
      .catch(() => {
        // Endpoint not wired up yet — fall back to what we know locally
        if (cancelled) return
        setStats([
          { label: 'Total Orders', value: 0 },
          { label: 'Active Since', value: formatMemberSince(authUser.createdAt) },
          { label: 'Reservations', value: 0 },
        ])
      })

    return () => { cancelled = true }
  }, [authUser])

  const updateProfile = (field, value) => setProfile(prev => ({ ...prev, [field]: value }))

  const flashSaved = section => {
    setSavedSection(section)
    setTimeout(() => setSavedSection(null), 2000)
  }

  const handleProfileSubmit = async e => {
    e.preventDefault()
    setSaveError(null)
    setSaving(true)
    try {
      await updateProfileRequest({
        name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      })
      flashSaved('profile')
    } catch (err) {
      setSaveError(
        err.response?.data?.message || err.message || 'Could not save changes'
      )
    } finally {
      setSaving(false)
    }
  }

  if (!authUser) {
    return (
      <div className="profile-page">
        <div className="profile-header-card">
          <p>You need to be logged in to view your profile.</p>
        </div>
      </div>
    )
  }

  const initials = getInitials(profile.fullName)

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{initials}</div>
          <button type="button" className="profile-avatar-edit" aria-label="Change photo">
            <Camera size={14} />
          </button>
        </div>

        <div className="profile-header-info">
          <h1>{profile.fullName || 'Unnamed user'}</h1>
          <span className="profile-role-badge">
            <ShieldCheck size={13} /> {profile.role}
          </span>
          <p className="profile-member-since">Member since {profile.memberSince}</p>
        </div>

        <div className="profile-stats">
          {stats.map(stat => (
            <div key={stat.label} className="profile-stat">
              <p className="profile-stat-value">{stat.value}</p>
              <p className="profile-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-grid profile-grid-single">
        <form className="profile-card profile-card-wide" onSubmit={handleProfileSubmit}>
          <div className="profile-card-header">
            <h2>Personal Information</h2>
            {savedSection === 'profile' && <span className="profile-saved">Saved</span>}
          </div>

          <div className="profile-field-grid">
            <label className="profile-field">
              <span className="profile-label">Full name</span>
              <input
                className="profile-input"
                value={profile.fullName}
                onChange={e => updateProfile('fullName', e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label"><Mail size={13} /> Email address</span>
              <input
                type="email"
                className="profile-input"
                value={profile.email}
                onChange={e => updateProfile('email', e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label"><Phone size={13} /> Phone number</span>
              <input
                type="tel"
                className="profile-input"
                placeholder="Not provided yet"
                value={profile.phone}
                onChange={e => updateProfile('phone', e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label"><MapPin size={13} /> Address</span>
              <input
                className="profile-input"
                placeholder="Not provided yet"
                value={profile.address}
                onChange={e => updateProfile('address', e.target.value)}
              />
            </label>
          </div>

          {saveError && <p className="profile-error">{saveError}</p>}

          <button type="submit" className="profile-save-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  )
}