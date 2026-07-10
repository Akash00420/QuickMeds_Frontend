import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Reducer/AuthSlice";
import { Plus, Eye, EyeOff } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 48 48" width="18" height="18">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.5-4.6 2.5-7.5 2.5-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C40.4 36.5 44 30.9 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      if (result?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/search");
      }
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-panel">
          <div className="login-logo">
            <span className="login-logo-icon"><Plus size={16} /></span>
            <span className="login-logo-text">HiHealth</span>
          </div>

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Order from different drugstores all around the country</p>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <label className="login-field">
              <span className="login-label">Email address</span>
              <input
                type="email"
                placeholder="Enter your email address"
                className="login-input"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <span className="text-red">{errors.email.message}</span>}
            </label>

            <label className="login-field">
              <span className="login-label">Password</span>
              <div className="login-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="login-input"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className="login-input-icon-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="text-red">{errors.password.message}</span>}
            </label>

            {error && <div className="text-red error-msg">{error}</div>}

            <Link to="/forgot-password" className="login-forgot">Forgot password?</Link>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Login account"}
            </button>

            <p className="login-signup">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button type="button" className="login-google">
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </div>

        <div className="login-media" aria-hidden="true" />
      </div>
    </div>
  )
}