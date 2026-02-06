import { useState } from 'react'
import { registerUser, validatePassword } from '../../utils/auth'
import { useToast } from '../../context/useToast'
import { registerImageEncrypted } from '../../utils/encryptedImage'

function Register({ onLoginClick, onRegisterSuccess }) {
  const decryptImage = (base64) => {
    return `data:image/png;base64,${base64}`
  }
  const imageSrc = decryptImage(registerImageEncrypted)
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

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'danger')
      return
    }

    const pwValidation = validatePassword(formData.password)
    if (!pwValidation.valid) {
      showToast(pwValidation.message, 'danger')
      return
    }

    setLoading(true)
    const result = await registerUser(formData.username, formData.password)
    setLoading(false)

    if (result.success) {
      showToast(result.message || 'Registration successful', 'success')
      onRegisterSuccess(formData.username)
      setFormData({ username: '', password: '', confirmPassword: '' })
    } else {
      showToast(result.message || 'Registration failed', 'danger')
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
                  required
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
                  required
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
                  required
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