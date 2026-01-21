'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('officer')
  const [formData, setFormData] = useState({
    officer_id: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Determine role based on active tab
      const role = activeTab === 'admin' ? 'admin' : 'officer'
      
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success || (activeTab === 'admin' && formData.officer_id === 'admin' && formData.password === 'admin123')) {
        // Store user data in localStorage
        const userData = {
          id: formData.officer_id,
          name: data.name || (activeTab === 'admin' ? 'Administrator' : formData.officer_id),
          role: role
        }
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Invalid credentials. Please try again.'
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to server' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
      `}</style>
      
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
        }
        
        /* Background */
        .login-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 58, 138, 0.9) 100%),
                      url('/images/slIders.jpg') center/cover no-repeat;
          z-index: 0;
        }
        
        .login-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 50%, rgba(220, 38, 38, 0.2) 0%, transparent 60%);
          z-index: 1;
        }
        
        .animated-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .shape {
          position: absolute;
          background: rgba(220, 38, 38, 0.15);
          border-radius: 50%;
          animation: float 20s infinite ease-in-out;
        }
        
        .shape-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }
        
        .shape-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          right: -150px;
          animation-delay: 5s;
        }
        
        .shape-3 {
          width: 250px;
          height: 250px;
          top: 50%;
          right: 10%;
          animation-delay: 10s;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        /* Left Side - Branding */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px;
          position: relative;
          z-index: 1;
        }
        
        .logo-section {
          text-align: center;
          animation: fadeInUp 1s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .logo-icon {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #dc2626 0%, #1e3a8a 100%);
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          margin: 0 auto 30px;
          box-shadow: 0 20px 60px rgba(220, 38, 38, 0.6);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .logo-title {
          font-size: 48px;
          font-weight: 900;
          color: white;
          margin-bottom: 15px;
          letter-spacing: 2px;
        }
        
        .logo-subtitle {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 600;
          margin-bottom: 40px;
        }
        
        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 40px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
          font-size: 16px;
          font-weight: 600;
        }
        
        .feature-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        /* Right Side - Login Form */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
          position: relative;
          z-index: 1;
        }
        
        .login-card {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          padding: 50px;
          border-radius: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5),
                      inset 0 1px 1px 0 rgba(220, 38, 38, 0.2);
          border: 1px solid rgba(220, 38, 38, 0.3);
          animation: slideIn 1s ease-out;
          position: relative;
          overflow: hidden;
        }
        
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
          transition: left 0.5s;
        }
        
        .login-card:hover::before {
          left: 100%;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .login-title {
          font-size: 32px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .login-description {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 600;
        }
        
        /* Tabs */
        .tabs-container {
          display: flex;
          gap: 10px;
          margin-bottom: 35px;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(10px);
          padding: 6px;
          border-radius: 15px;
          border: 1px solid rgba(220, 38, 38, 0.2);
        }
        
        .tab {
          flex: 1;
          padding: 14px;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .tab.active {
          background: linear-gradient(135deg, #dc2626 0%, #1e3a8a 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.5);
        }
        
        .tab:hover:not(.active) {
          background: rgba(220, 38, 38, 0.15);
          color: rgba(255, 255, 255, 0.9);
        }
        
        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .form-group label {
          font-weight: 700;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.95);
          display: flex;
          align-items: center;
          gap: 8px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .input-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          color: rgba(220, 38, 38, 0.7);
        }
        
        .form-group input {
          width: 100%;
          padding: 16px 18px 16px 50px;
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(10px);
          color: white;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #dc2626;
          background: rgba(15, 23, 42, 0.6);
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2),
                      0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
        }
        
        .submit-btn {
          padding: 18px;
          background: linear-gradient(135deg, #dc2626 0%, #1e3a8a 100%);
          color: white;
          border: 1px solid rgba(220, 38, 38, 0.5);
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .submit-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        
        .submit-btn:hover::before {
          left: 100%;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.6),
                      0 0 20px rgba(220, 38, 38, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .alert {
          padding: 15px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideDown 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .alert-error {
          background: rgba(220, 38, 38, 0.2);
          color: #fca5a5;
          border-color: rgba(220, 38, 38, 0.4);
        }
        
        .alert-success {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          border-color: rgba(16, 185, 129, 0.4);
        }
        
        .back-home {
          text-align: center;
          margin-top: 25px;
        }
        
        .back-link {
          color: #dc2626;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }
        
        .back-link:hover {
          color: #ef4444;
          gap: 12px;
          text-shadow: 0 0 10px rgba(220, 38, 38, 0.6);
        }
        
        /* Responsive */
        @media (max-width: 1024px) {
          .login-left {
            display: none;
          }
          
          .login-right {
            flex: 1;
          }
        }
        
        @media (max-width: 768px) {
          .login-right {
            padding: 30px 20px;
          }
          
          .login-card {
            padding: 35px 25px;
          }
          
          .logo-title {
            font-size: 36px;
          }
        }
      `}</style>

      <div className="login-container">
        {/* Animated Background */}
        <div className="login-background">
          <div className="animated-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        {/* Left Side - Branding */}
        <div className="login-left">
          <div className="logo-section">
            <div className="logo-icon">🚔</div>
            <h1 className="logo-title">POLICE CRMS</h1>
            <p className="logo-subtitle">Crime Record Management System</p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>Secure Authentication</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Real-Time Analytics</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Fast Case Management</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛡️</div>
                <span>MIPS Powered Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Welcome Back</h2>
              <p className="login-description">Sign in to access your dashboard</p>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              <button 
                className={`tab ${activeTab === 'officer' ? 'active' : ''}`}
                onClick={() => setActiveTab('officer')}
              >
                <span>👮</span>
                <span>Officer Login</span>
              </button>
              <button 
                className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <span>👨‍💼</span>
                <span>Admin Login</span>
              </button>
            </div>

            {message && (
              <div className={`alert alert-${message.type}`}>
                <span>{message.type === 'error' ? '❌' : '✅'}</span>
                <span>{message.text}</span>
              </div>
            )}

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>
                  {activeTab === 'admin' ? 'Admin ID' : 'Officer ID'}
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    value={formData.officer_id}
                    onChange={(e) => setFormData({...formData, officer_id: e.target.value})}
                    required
                    placeholder={activeTab === 'admin' ? 'Enter admin ID' : 'Enter officer ID'}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span>⏳</span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    <span>Sign In to Dashboard</span>
                  </>
                )}
              </button>
            </form>

            <div className="back-home">
              <a href="/" className="back-link">
                <span>←</span>
                <span>Back to Home</span>
              </a>
            </div>

            {activeTab === 'admin' && (
              <p style={{
                marginTop: '20px',
                textAlign: 'center',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: '600',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
              }}>
                Demo: <strong style={{color: '#dc2626'}}>admin</strong> / <strong style={{color: '#dc2626'}}>admin123</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
