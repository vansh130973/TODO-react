import { useState } from 'react'
import { registerUser, validatePassword } from '../../utils/auth'

function Register({ onLoginClick, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const pwValidation = validatePassword(formData.password)
    if (!pwValidation.valid) {
      setError(pwValidation.message)
      return
    }

    setLoading(true)
    const result = await registerUser(formData.username, formData.password)
    setLoading(false)
    
    if (result.success) {
      onRegisterSuccess(formData.username)
      setFormData({ username: '', password: '', confirmPassword: '' })
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="text-center mb-4">Register</h3>
          
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
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
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
  )
}

export default Register