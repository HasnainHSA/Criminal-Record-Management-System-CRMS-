'use client'
import { useState } from 'react'

export default function RegisterFIR() {
  const [formData, setFormData] = useState({
    criminal_name: '',
    crime: '',
    location: '',
    date: '',
    description: '',
    witness: '',
    evidence: ''
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
      
      if (data.success) {
        setMessage({ type: 'success', text: 'FIR registered successfully!' })
        setFormData({
          criminal_name: '',
          crime: '',
          location: '',
          date: '',
          description: '',
          witness: '',
          evidence: ''
        })
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to register FIR' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .page-header {
          margin-bottom: 30px;
        }
        
        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: #2d3561;
          margin-bottom: 8px;
        }
        
        .page-subtitle {
          font-size: 15px;
          color: #a0a4b8;
        }
        
        .fir-form-container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          max-width: 900px;
        }
        
        .form-section {
          margin-bottom: 35px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f5f6fa;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group.full {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2d3561;
          font-size: 14px;
        }
        
        .form-group label .required {
          color: #dc2626;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid #e8eaf0;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: #f5f6fa;
          font-family: inherit;
        }
        
        .form-group textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1e3a8a;
          background: white;
          box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
        }
        
        .submit-btn {
          width: 100%;
          padding: 18px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 58, 138, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .alert {
          padding: 18px 24px;
          border-radius: 12px;
          margin-bottom: 25px;
          font-weight: 600;
          font-size: 15px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .alert-success {
          background: #d1fae5;
          color: #065f46;
        }
        
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .info-box {
          background: linear-gradient(135deg, #1e3a8a15 0%, #dc262615 100%);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #1e3a8a;
          margin-bottom: 30px;
        }
        
        .info-box p {
          font-size: 14px;
          color: #2d3561;
          line-height: 1.6;
          margin: 0;
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Register FIR</h1>
        <p className="page-subtitle">File a new First Information Report</p>
      </div>

      <div className="fir-form-container">
        {message && (
          <div className={`alert alert-${message.type}`}>
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        )}

        <div className="info-box">
          <p>
            📋 Please fill in all required fields marked with <span style={{color: '#dc2626'}}>*</span>. 
            This information will be validated by the MIPS backend system before being stored.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">
              <span>👤</span>
              <span>Criminal Information</span>
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Criminal Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.criminal_name}
                  onChange={(e) => setFormData({...formData, criminal_name: e.target.value})}
                  required
                  placeholder="Enter criminal's full name"
                />
              </div>

              <div className="form-group">
                <label>Crime Type <span className="required">*</span></label>
                <select
                  value={formData.crime}
                  onChange={(e) => setFormData({...formData, crime: e.target.value})}
                  required
                >
                  <option value="">Select crime type</option>
                  <option value="Theft">Theft</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Burglary">Burglary</option>
                  <option value="Assault">Assault</option>
                  <option value="Murder">Murder</option>
                  <option value="Kidnapping">Kidnapping</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Cybercrime">Cybercrime</option>
                  <option value="Drug Trafficking">Drug Trafficking</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <span>📍</span>
              <span>Incident Details</span>
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Location <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  placeholder="e.g., Karachi, Saddar"
                />
              </div>

              <div className="form-group">
                <label>Date of Incident <span className="required">*</span></label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group full">
                <label>Description <span className="required">*</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  placeholder="Provide detailed description of the incident..."
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">
              <span>📝</span>
              <span>Additional Information</span>
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Witness Name</label>
                <input
                  type="text"
                  value={formData.witness}
                  onChange={(e) => setFormData({...formData, witness: e.target.value})}
                  placeholder="Enter witness name (if any)"
                />
              </div>

              <div className="form-group">
                <label>Evidence</label>
                <input
                  type="text"
                  value={formData.evidence}
                  onChange={(e) => setFormData({...formData, evidence: e.target.value})}
                  placeholder="Brief description of evidence"
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <span>📋</span>
            <span>{loading ? 'Registering FIR...' : 'Register FIR'}</span>
          </button>
        </form>
      </div>
    </>
  )
}
