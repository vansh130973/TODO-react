import { useState } from 'react'
import { loginUser } from '../../utils/auth'

function Login({ onRegisterClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const result = loginUser(formData.username, formData.password)
    
    if (result.success) {
      onLoginSuccess(formData.username)
      setFormData({ username: '', password: '' })
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h3 className="text-center mb-4">Login</h3>
          
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
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            
            <div className="text-center mt-3">
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  onRegisterClick()
                }}
                className="text-decoration-none"
              >
                Create new account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login