import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Reducer/AuthSlice";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Eye, EyeOff } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg className="register-google-icon" viewBox="0 0 48 48" width="18" height="18">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.5-4.6 2.5-7.5 2.5-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C40.4 36.5 44 30.9 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  )
}

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
}

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState({})

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required'
    if (!form.email.trim()) next.email = 'Email address is required'
    if (form.password.length < 8) next.password = 'Password must be at least 8 characters'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match'
    if (!form.agreeToTerms) next.agreeToTerms = 'You must accept the terms to continue'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return
    if (!validate()) return

    const result = await dispatch(registerUser({
      name: form.fullName,
      email: form.email,
      password: form.password,
      confirm_password: form.confirmPassword,
    }));

    if (registerUser.fulfilled.match(result)) {
      navigate("/login");
    }
  }

  const errorMessage = error?.msg || error?.message || (typeof error === "string" ? error : null);

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-panel">
          <div className="register-logo">
            <span className="register-logo-icon"><Plus size={16} /></span>
            <span className="register-logo-text">HiHealth</span>
          </div>

          <h1 className="register-title">Create your account</h1>
          <p className="register-subtitle">Join thousands ordering medicines from trusted pharmacies nationwide</p>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
            <label className="register-field">
              <span className="register-label">Full name</span>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={e => updateField('fullName', e.target.value)}
                className={`register-input${errors.fullName ? ' has-error' : ''}`}
              />
              {errors.fullName && <span className="register-error">{errors.fullName}</span>}
            </label>

            <label className="register-field">
              <span className="register-label">Email address</span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={e => updateField('email', e.target.value)}
                className={`register-input${errors.email ? ' has-error' : ''}`}
              />
              {errors.email && <span className="register-error">{errors.email}</span>}
            </label>



            <div className="register-field-row">
              <label className="register-field">
                <span className="register-label">Password</span>
                <div className="register-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => updateField('password', e.target.value)}
                    className={`register-input${errors.password ? ' has-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="register-input-icon-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="register-error">{errors.password}</span>}
              </label>

              <label className="register-field">
                <span className="register-label">Confirm password</span>
                <div className="register-input-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={e => updateField('confirmPassword', e.target.value)}
                    className={`register-input${errors.confirmPassword ? ' has-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="register-input-icon-btn"
                    onClick={() => setShowConfirm(v => !v)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
              </label>
            </div>

            <label className="register-checkbox-row">
              <input
                type="checkbox"
                checked={form.agreeToTerms}
                onChange={e => updateField('agreeToTerms', e.target.checked)}
              />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
            {errors.agreeToTerms && <span className="register-error">{errors.agreeToTerms}</span>}

            {errorMessage && <span className="register-error">{errorMessage}</span>}

            <button type="submit" className="register-submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create account"}
            </button>

            <p className="register-signin">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>

            <div className="register-divider">
              <span>OR</span>
            </div>

            <button type="button" className="register-google">
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </div>

        <div className="register-media" aria-hidden="true" />
      </div>
    </div>
  )
}