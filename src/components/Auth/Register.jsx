import { useState } from 'react'
import { registerUser, validatePassword } from '../../utils/auth'
import { useToast } from '../../context/useToast'
import { registerImageEncrypted } from '../../utils/encryptedImage'

function Register({ onLoginClick, onRegisterSuccess }) {
  const imageSrc = `data:image/png;base64,${registerImageEncrypted}`
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { username, password, confirmPassword } = formData

    if (!username || !password || !confirmPassword) {
      showToast('All fields are required', 'danger')
      return
    }

    if (username.trim().length < 3) {
      showToast('Username must be at least 3 characters', 'danger')
      return
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'danger')
      return
    }

    const pwValidation = validatePassword(password)
    if (!pwValidation.valid) {
      showToast(pwValidation.message, 'danger')
      return
    }

    setLoading(true)
    const result = await registerUser(username.trim(), password)
    setLoading(false)

    if (result.success) {
      showToast(result.message, 'success')
      onRegisterSuccess(username.trim())
      setFormData({ username: '', password: '', confirmPassword: '' })
    } else {
      showToast(result.message, 'danger')
    }
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        <div className="col-5 p-0 d-flex align-items-center justify-content-center bg-light">
          <img
            src={imageSrc}
            alt="Register"
            className="img-fluid h-100"
            style={{ objectFit: 'contain' }}
          />
        </div>

        <div className="col-6 p-0 d-flex align-items-center">
          <div className="w-75 mx-auto">
            <h3 className="mb-4">Register</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>

              <div className="text-center mt-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onLoginClick()
                  }}
                  className="text-decoration-none"
                >
                  Already have an account? Login
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register