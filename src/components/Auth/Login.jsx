import { useState } from 'react'
import { loginUser } from '../../utils/auth'
import { useToast } from '../../context/useToast'

function Login({ onRegisterClick, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const { showToast } = useToast()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = await loginUser(formData.username, formData.password)
    
    if (result.success) {
      showToast(result.message || 'Login successful', 'success')
      onLoginSuccess(formData.username)
      setFormData({ username: '', password: '' })
    } else {
      showToast(result.message || 'Login failed', 'danger')
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