'use client'
import { useState } from 'react'

export default function AddFIR() {
  const [formData, setFormData] = useState({
    criminal_name: '',
    crime: '',
    location: '',
    date: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('http://localhost:5000/api/add_fir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      setMessage({ type: 'success', text: data.message })
      
      if (data.success) {
        setFormData({ criminal_name: '', crime: '', location: '', date: '' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to backend' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{fontSize: '24px', marginBottom: '20px'}}>Add New FIR</h2>
      
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Criminal Name</label>
          <input
            type="text"
            value={formData.criminal_name}
            onChange={(e) => setFormData({...formData, criminal_name: e.target.value})}
            required
            placeholder="e.g., Ali Khan"
          />
        </div>

        <div className="form-group">
          <label>Crime Type</label>
          <input
            type="text"
            value={formData.crime}
            onChange={(e) => setFormData({...formData, crime: e.target.value})}
            required
            placeholder="e.g., Theft, Robbery, Fraud"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
            placeholder="e.g., Karachi"
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : 'Add FIR Record'}
        </button>
      </form>
    </div>
  )
}
