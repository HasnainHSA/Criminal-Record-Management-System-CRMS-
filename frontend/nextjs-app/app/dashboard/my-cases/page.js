'use client'
import { useState, useEffect } from 'react'

export default function MyCases() {
  const [user, setUser] = useState(null)
  const [myCases, setMyCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchMyCases(parsedUser)
    }
  }, [])

  const fetchMyCases = async (currentUser) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/view_all')
      const data = await response.json()
      
      if (data.success && data.records) {
        // Filter cases assigned to current officer
        const assignedToMe = data.records.filter(
          fir => fir.assigned_officer === currentUser.id
        )
        setMyCases(assignedToMe)
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCase = (caseItem) => {
    setSelectedCase(caseItem)
    setNewStatus(caseItem.status || 'Active')
    setFeedback('')
    setShowModal(true)
  }

  const handleSubmitUpdate = async () => {
    if (!feedback.trim()) {
      setMessage({ type: 'error', text: 'Please provide feedback' })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/update_fir_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fir_id: selectedCase.id,
          status: newStatus,
          note: feedback
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Case updated successfully!' })
        setShowModal(false)
        fetchMyCases(user)
        setFeedback('')
      } else {
        setMessage({ type: 'error', text: data.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update case' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#fef3c7',
      'Active': '#dbeafe',
      'Under Investigation': '#dbeafe',
      'Solved': '#d1fae5',
      'Closed': '#f3f4f6'
    }
    return colors[status] || '#f3f4f6'
  }

  const getStatusTextColor = (status) => {
    const colors = {
      'Pending': '#92400e',
      'Active': '#1e40af',
      'Under Investigation': '#1e40af',
      'Solved': '#065f46',
      'Closed': '#6b7280'
    }
    return colors[status] || '#6b7280'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#fee2e2',
      'Medium': '#fef3c7',
      'Low': '#dbeafe'
    }
    return colors[priority] || '#fef3c7'
  }

  const getPriorityTextColor = (priority) => {
    const colors = {
      'High': '#991b1b',
      'Medium': '#92400e',
      'Low': '#1e40af'
    }
    return colors[priority] || '#92400e'
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
        
        .alert {
          padding: 15px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .alert-success {
          background: #d1fae5;
          color: #065f46;
        }
        
        .alert-error {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-box {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: #2d3561;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 13px;
          color: #a0a4b8;
          font-weight: 600;
        }
        
        .cases-grid {
          display: grid;
          gap: 25px;
        }
        
        .case-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .case-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transform: translateY(-3px);
        }
        
        .case-header {
          padding: 25px;
          background: linear-gradient(135deg, #1e3a8a15 0%, #dc262615 100%);
          border-bottom: 2px solid #f5f6fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .case-id {
          font-size: 20px;
          font-weight: 800;
          color: #1e3a8a;
        }
        
        .case-badges {
          display: flex;
          gap: 10px;
        }
        
        .badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }
        
        .case-body {
          padding: 25px;
        }
        
        .case-info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .info-label {
          font-size: 12px;
          color: #a0a4b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .info-value {
          font-size: 15px;
          color: #2d3561;
          font-weight: 700;
        }
        
        .case-instructions {
          background: #f5f6fa;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .instructions-title {
          font-size: 13px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .instructions-text {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
        }
        
        .case-actions {
          display: flex;
          gap: 12px;
        }
        
        .action-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .action-btn.primary {
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
        }
        
        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .action-btn.secondary {
          background: #f5f6fa;
          color: #2d3561;
        }
        
        .action-btn.secondary:hover {
          background: #e8eaf0;
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 20px;
        }
        
        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.3;
        }
        
        .empty-text {
          font-size: 18px;
          color: #a0a4b8;
          font-weight: 600;
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
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2d3561;
          font-size: 14px;
        }
        
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
        
        .form-group select:focus,
        .form-group textarea:focus {
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
        }
        
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .case-info-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">My Assigned Cases</h1>
        <p className="page-subtitle">Manage and update your assigned cases</p>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.type === 'success' ? '✅' : '❌'}</span>
          <span>{message.text}</span>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-value">{myCases.length}</div>
          <div className="stat-label">Total Assigned</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {myCases.filter(c => c.status === 'Active' || c.status === 'Under Investigation').length}
          </div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {myCases.filter(c => c.status === 'Solved').length}
          </div>
          <div className="stat-label">Solved</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">
            {myCases.filter(c => c.priority === 'High').length}
          </div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>

      {myCases.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p className="empty-text">No cases assigned to you yet</p>
        </div>
      ) : (
        <div className="cases-grid">
          {myCases.map((caseItem, index) => (
            <div key={index} className="case-card">
              <div className="case-header">
                <span className="case-id">{caseItem.id}</span>
                <div className="case-badges">
                  {caseItem.priority && (
                    <span 
                      className="badge"
                      style={{
                        background: getPriorityColor(caseItem.priority),
                        color: getPriorityTextColor(caseItem.priority)
                      }}
                    >
                      {caseItem.priority} Priority
                    </span>
                  )}
                  <span 
                    className="badge"
                    style={{
                      background: getStatusColor(caseItem.status),
                      color: getStatusTextColor(caseItem.status)
                    }}
                  >
                    {caseItem.status || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="case-body">
                <div className="case-info-grid">
                  <div className="info-item">
                    <span className="info-label">Criminal</span>
                    <span className="info-value">{caseItem.criminal_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Crime Type</span>
                    <span className="info-value">{caseItem.crime}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Location</span>
                    <span className="info-value">{caseItem.location}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date</span>
                    <span className="info-value">{caseItem.date}</span>
                  </div>
                  {caseItem.deadline && (
                    <div className="info-item">
                      <span className="info-label">Deadline</span>
                      <span className="info-value">{caseItem.deadline}</span>
                    </div>
                  )}
                  {caseItem.assigned_date && (
                    <div className="info-item">
                      <span className="info-label">Assigned On</span>
                      <span className="info-value">{caseItem.assigned_date}</span>
                    </div>
                  )}
                </div>

                {caseItem.instructions && (
                  <div className="case-instructions">
                    <div className="instructions-title">📝 Special Instructions</div>
                    <div className="instructions-text">{caseItem.instructions}</div>
                  </div>
                )}

                <div className="case-actions">
                  <button 
                    className="action-btn primary"
                    onClick={() => handleUpdateCase(caseItem)}
                  >
                    <span>🔄</span>
                    <span>Update Status & Add Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedCase && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Case - {selectedCase.id}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Criminal Name</label>
              <input 
                type="text" 
                value={selectedCase.criminal_name} 
                disabled 
                style={{background: '#f5f6fa', color: '#a0a4b8', border: '2px solid #e8eaf0', padding: '14px 18px', borderRadius: '12px', width: '100%'}}
              />
            </div>

            <div className="form-group">
              <label>Update Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Solved">Solved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Your Feedback / Progress Update <span style={{color: '#dc2626'}}>*</span></label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe the progress, findings, or actions taken on this case..."
                required
              />
            </div>

            <button 
              className="submit-btn" 
              onClick={handleSubmitUpdate}
              disabled={loading || !feedback.trim()}
            >
              {loading ? 'Updating...' : 'Submit Update'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
