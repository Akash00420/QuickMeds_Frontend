import { useState } from 'react'
import { Camera, Mail, Phone, MapPin, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import '../assets/custom.css'

const initialProfile = {
  fullName: 'Ananya Sharma',
  email: 'ananya@citycarepharmacy.com',
  phone: '+91 98765 43210',
  address: '14 MG Road, Kolkata, West Bengal',
  role: 'Pharmacy Owner',
  memberSince: 'March 2024',
}

const initialPharmacy = {
  storeName: 'City Care Pharmacy',
  licenseNumber: 'WB-PH-2024-00931',
  gstNumber: '19ABCDE1234F1Z5',
  storeAddress: '14 MG Road, Kolkata, West Bengal, 700001',
}

const stats = [
  { label: 'Total Orders', value: 482 },
  { label: 'Active Since', value: '1.4 yrs' },
  { label: 'Reservations', value: 37 },
]

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile)
  const [pharmacy, setPharmacy] = useState(initialPharmacy)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [savedSection, setSavedSection] = useState(null)

  const updateProfile = (field, value) => setProfile(prev => ({ ...prev, [field]: value }))
  const updatePharmacy = (field, value) => setPharmacy(prev => ({ ...prev, [field]: value }))
  const updatePassword = (field, value) => setPasswords(prev => ({ ...prev, [field]: value }))

  const flashSaved = section => {
    setSavedSection(section)
    setTimeout(() => setSavedSection(null), 2000)
  }

  const handleProfileSubmit = e => {
    e.preventDefault()
    flashSaved('profile')
  }

  const handlePharmacySubmit = e => {
    e.preventDefault()
    flashSaved('pharmacy')
  }

  const handlePasswordSubmit = e => {
    e.preventDefault()
    if (!passwords.current || !passwords.next || passwords.next !== passwords.confirm) return
    setPasswords({ current: '', next: '', confirm: '' })
    flashSaved('password')
  }

  const initials = profile.fullName
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

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
          <h1>{profile.fullName}</h1>
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

      <div className="profile-grid">
        <form className="profile-card" onSubmit={handleProfileSubmit}>
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
                value={profile.phone}
                onChange={e => updateProfile('phone', e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label"><MapPin size={13} /> Address</span>
              <input
                className="profile-input"
                value={profile.address}
                onChange={e => updateProfile('address', e.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="profile-save-btn">Save changes</button>
        </form>

        <form className="profile-card" onSubmit={handlePharmacySubmit}>
          <div className="profile-card-header">
            <h2>Pharmacy Details</h2>
            {savedSection === 'pharmacy' && <span className="profile-saved">Saved</span>}
          </div>

          <div className="profile-field-grid">
            <label className="profile-field">
              <span className="profile-label">Store name</span>
              <input
                className="profile-input"
                value={pharmacy.storeName}
                onChange={e => updatePharmacy('storeName', e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label">License number</span>
              <input
                className="profile-input"
                value={pharmacy.licenseNumber}
                onChange={e => updatePharmacy('licenseNumber', e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label">GST number</span>
              <input
                className="profile-input"
                value={pharmacy.gstNumber}
                onChange={e => updatePharmacy('gstNumber', e.target.value)}
              />
            </label>

            <label className="profile-field">
              <span className="profile-label">Store address</span>
              <input
                className="profile-input"
                value={pharmacy.storeAddress}
                onChange={e => updatePharmacy('storeAddress', e.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="profile-save-btn">Save changes</button>
        </form>

        <form className="profile-card profile-card-wide" onSubmit={handlePasswordSubmit}>
          <div className="profile-card-header">
            <h2>Change Password</h2>
            {savedSection === 'password' && <span className="profile-saved">Updated</span>}
          </div>

          <div className="profile-field-grid three-col">
            <label className="profile-field">
              <span className="profile-label">Current password</span>
              <div className="profile-input-wrap">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  className="profile-input"
                  value={passwords.current}
                  onChange={e => updatePassword('current', e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="profile-input-icon-btn"
                  onClick={() => setShowCurrent(v => !v)}
                  aria-label="Toggle current password visibility"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <label className="profile-field">
              <span className="profile-label">New password</span>
              <div className="profile-input-wrap">
                <input
                  type={showNext ? 'text' : 'password'}
                  className="profile-input"
                  value={passwords.next}
                  onChange={e => updatePassword('next', e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="profile-input-icon-btn"
                  onClick={() => setShowNext(v => !v)}
                  aria-label="Toggle new password visibility"
                >
                  {showNext ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            <label className="profile-field">
              <span className="profile-label">Confirm new password</span>
              <input
                type={showNext ? 'text' : 'password'}
                className="profile-input"
                value={passwords.confirm}
                onChange={e => updatePassword('confirm', e.target.value)}
                placeholder="••••••••"
              />
            </label>
          </div>

          {passwords.next && passwords.confirm && passwords.next !== passwords.confirm && (
            <p className="profile-error">New passwords do not match.</p>
          )}

          <button type="submit" className="profile-save-btn">Update password</button>
        </form>
      </div>
    </div>
  )
}