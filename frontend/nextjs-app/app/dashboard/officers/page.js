'use client'
import { useState, useEffect } from 'react'

export default function ManageOfficers() {
  const [officers, setOfficers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOfficer, setSelectedOfficer] = useState(null)
  const [formData, setFormData] = useState({
    officer_id: '',
    name: '',
    role: 'Constable',
    password: '',
    phone: '',
    station: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    fetchOfficers()
  }, [])

  const fetchOfficers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_officers')
      const data = await response.json()
      if (data.success) {
        setOfficers(data.officers.map(o => ({
          id: o.officer_id,
          name: o.name,
          role: o.role || 'Officer',
          station: o.station || 'Main Station',
          status: 'Active'
        })))
      }
    } catch (error) {
      console.error('Failed to fetch officers:', error)
      setOfficers([])
    }
  }

  const handleEdit = (officer) => {
    setSelectedOfficer(officer)
    setFormData({
      officer_id: officer.id,
      name: officer.name,
      role: officer.role,
      password: '',
      phone: '',
      station: officer.station
    })
    setShowEditModal(true)
  }

  const handleDelete = (officer) => {
    setSelectedOfficer(officer)
    setShowDeleteModal(true)
  }

  const handleUpdateOfficer = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('http://localhost:5000/api/update_officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: formData.officer_id,
          name: formData.name,
          role: formData.role,
          station: formData.station,
          phone: formData.phone
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Officer updated successfully!' })
        setShowEditModal(false)
        setTimeout(() => {
          fetchOfficers()
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update officer' })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('http://localhost:5000/api/delete_officer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officer_id: selectedOfficer.id
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Officer deleted successfully!' })
        setShowDeleteModal(false)
        setTimeout(() => {
          fetchOfficers()
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete officer' })
    } finally {
      setLoading(false)
    }
  }

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
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Officer registered successfully!' })
        setFormData({ officer_id: '', name: '', role: 'Constable', password: '', phone: '', station: '' })
        setShowModal(false)
        // Refresh the officers list
        setTimeout(() => {
          fetchOfficers()
          setMessage(null)
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to register officer' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .page-title {
          font-size: 32px;
          font-weight: 800;
          color: #2d3561;
        }
        
        .add-btn {
          padding: 14px 28px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(30, 58, 138, 0.4);
        }
        
        .officers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }
        
        .officer-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .officer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .officer-header {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .officer-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
          color: white;
          flex-shrink: 0;
        }
        
        .officer-info {
          flex: 1;
        }
        
        .officer-name {
          font-size: 18px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 5px;
        }
        
        .officer-id {
          font-size: 13px;
          color: #a0a4b8;
          font-weight: 600;
        }
        
        .officer-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f5f6fa;
        }
        
        .detail-label {
          font-size: 13px;
          color: #a0a4b8;
          font-weight: 600;
        }
        
        .detail-value {
          font-size: 14px;
          color: #2d3561;
          font-weight: 600;
        }
        
        .role-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        
        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-badge.inactive {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .officer-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .action-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .action-btn.edit {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .action-btn.delete {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
        }
        
        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal {
          background: white;
          padding: 40px;
          border-radius: 20px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 800;
          color: #2d3561;
        }
        
        .close-btn {
          width: 40px;
          height: 40px;
          background: #f5f6fa;
          border: none;
          border-radius: 10px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          background: #e8eaf0;
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
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e8eaf0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: #f5f6fa;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #1e3a8a;
          background: white;
        }
        
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
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
          padding: 15px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .alert-success {
          background: #d1fae5;
          color: #065f46;
        }
        
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Manage Officers</h1>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <span>➕</span>
          <span>Add New Officer</span>
        </button>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="officers-grid">
        {officers.map((officer, index) => (
          <div key={index} className="officer-card">
            <div className="officer-header">
              <div className="officer-avatar">
                {officer.name.charAt(0).toUpperCase()}
              </div>
              <div className="officer-info">
                <div className="officer-name">{officer.name}</div>
                <div className="officer-id">{officer.id}</div>
              </div>
            </div>
            
            <div className="officer-details">
              <div className="detail-row">
                <span className="detail-label">Role</span>
                <span className="role-badge">{officer.role}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Station</span>
                <span className="detail-value">{officer.station}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${officer.status.toLowerCase()}`}>
                  {officer.status}
                </span>
              </div>
            </div>
            
            <div className="officer-actions">
              <button className="action-btn edit" onClick={() => handleEdit(officer)}>✏️ Edit</button>
              <button className="action-btn delete" onClick={() => handleDelete(officer)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Officer</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
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
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="Constable">Constable</option>
                    <option value="Head Constable">Head Constable</option>
                    <option value="Sub-Inspector">Sub-Inspector</option>
                    <option value="Inspector">Inspector</option>
                    <option value="DSP">DSP</option>
                    <option value="SSP">SSP</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g., 0300-1234567"
                  />
                </div>

                <div className="form-group full">
                  <label>Station</label>
                  <input
                    type="text"
                    value={formData.station}
                    onChange={(e) => setFormData({...formData, station: e.target.value})}
                    required
                    placeholder="e.g., Station A, Karachi"
                  />
                </div>

                <div className="form-group full">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    placeholder="Create a secure password"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Registering...' : 'Register Officer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Officer Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Officer</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdateOfficer}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Officer ID</label>
                  <input
                    type="text"
                    value={formData.officer_id}
                    disabled
                    style={{background: '#f5f6fa', color: '#a0a4b8', cursor: 'not-allowed'}}
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required
                  >
                    <option value="Constable">Constable</option>
                    <option value="Head Constable">Head Constable</option>
                    <option value="Sub-Inspector">Sub-Inspector</option>
                    <option value="Inspector">Inspector</option>
                    <option value="DSP">DSP</option>
                    <option value="SSP">SSP</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g., 0300-1234567"
                  />
                </div>

                <div className="form-group full">
                  <label>Station</label>
                  <input
                    type="text"
                    value={formData.station}
                    onChange={(e) => setFormData({...formData, station: e.target.value})}
                    required
                    placeholder="e.g., Station A, Karachi"
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Update Officer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedOfficer && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Officer</h2>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>

            <div style={{marginBottom: '30px'}}>
              <p style={{fontSize: '16px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px'}}>
                Are you sure you want to delete this officer?
              </p>
              <div style={{
                background: '#fee2e2',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #fecaca'
              }}>
                <div style={{fontSize: '15px', fontWeight: '700', color: '#991b1b', marginBottom: '8px'}}>
                  {selectedOfficer.name}
                </div>
                <div style={{fontSize: '13px', color: '#991b1b'}}>
                  ID: {selectedOfficer.id}
                </div>
              </div>
              <p style={{fontSize: '14px', color: '#dc2626', marginTop: '15px', fontWeight: '600'}}>
                ⚠️ This action cannot be undone!
              </p>
            </div>

            <div style={{display: 'flex', gap: '12px'}}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f5f6fa',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: 'pointer',
                  color: '#2d3561'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#dc2626',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '15px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: 'white',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Deleting...' : 'Delete Officer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
