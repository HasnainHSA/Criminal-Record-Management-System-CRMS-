'use client'
import { useState } from 'react'

export default function RegisterOfficer() {
  const [formData, setFormData] = useState({
    officer_id: '',
    name: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('http://localhost:5000/api/register_officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setMessage({ type: 'success', text: data.message })
      
      if (data.success) {
        setFormData({ officer_id: '', name: '', password: '' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to backend' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{fontSize: '24px', marginBottom: '20px'}}>Register New Officer</h2>
      
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Officer ID</label>
          <input
            type="text"
            value={formData.officer_id}
            onChange={(e) => setFormData({...formData, officer_id: e.target.value})}
            required
            placeholder="e.g., OFF001"
          />
        </div>

        <div className="form-group">
          <label>Officer Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            placeholder="e.g., John Doe"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            placeholder="Enter password"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register Officer'}
        </button>
      </form>
    </div>
  )
}
