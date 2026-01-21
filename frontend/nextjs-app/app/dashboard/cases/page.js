'use client'
import { useState, useEffect } from 'react'

export default function CaseStatus() {
  const [cases, setCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/view_all')
      const data = await response.json()
      
      if (data.success && data.records) {
        setCases(data.records.map(r => ({
          id: r.id,
          criminal: r.criminal_name,
          crime: r.crime,
          location: r.location,
          date: r.date,
          status: r.status || 'Pending',
          officer: r.assigned_officer || 'Unassigned',
          timeline: r.timeline || [
            { status: 'Pending', date: r.date, officer: 'System', note: 'FIR registered' }
          ]
        })))
      }
    } catch (error) {
      console.error('Failed to fetch cases:', error)
    }
  }

  const handleStatusChange = (caseItem) => {
    setSelectedCase(caseItem)
    setNewStatus(caseItem.status)
    setShowModal(true)
  }

  const handleSubmitStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/update_fir_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fir_id: selectedCase.id,
          status: newStatus,
          note: note || 'Status updated'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local state
        const updatedCases = cases.map(c => {
          if (c.id === selectedCase.id) {
            return {
              ...c,
              status: newStatus,
              timeline: [
                ...c.timeline,
                {
                  status: newStatus,
                  date: new Date().toLocaleString(),
                  officer: 'Current User',
                  note: note || 'Status updated'
                }
              ]
            }
          }
          return c
        })
        setCases(updatedCases)
        setShowModal(false)
        setNote('')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#fef3c7',
      'Under Investigation': '#dbeafe',
      'Solved': '#d1fae5',
      'Closed': '#f3f4f6'
    }
    return colors[status] || '#f3f4f6'
  }

  const getStatusTextColor = (status) => {
    const colors = {
      'Pending': '#92400e',
      'Under Investigation': '#1e40af',
      'Solved': '#065f46',
      'Closed': '#6b7280'
    }
    return colors[status] || '#6b7280'
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
        
        .status-badge {
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
          margin-bottom: 25px;
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
        
        .timeline-section {
          margin-top: 25px;
          padding-top: 25px;
          border-top: 2px solid #f5f6fa;
        }
        
        .timeline-title {
          font-size: 16px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: 8px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #1e3a8a 0%, #dc2626 100%);
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 20px;
          padding-bottom: 20px;
        }
        
        .timeline-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .timeline-dot {
          position: absolute;
          left: -26px;
          top: 5px;
          width: 16px;
          height: 16px;
          background: white;
          border: 3px solid #1e3a8a;
          border-radius: 50%;
          z-index: 1;
        }
        
        .timeline-content {
          background: #f5f6fa;
          padding: 15px;
          border-radius: 12px;
        }
        
        .timeline-status {
          font-size: 14px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 5px;
        }
        
        .timeline-meta {
          font-size: 12px;
          color: #a0a4b8;
          margin-bottom: 8px;
        }
        
        .timeline-note {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
        }
        
        .case-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
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
          min-height: 100px;
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
        
        @media (max-width: 768px) {
          .case-info-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Case Status Management</h1>
        <p className="page-subtitle">Track and update case status with timeline</p>
      </div>

      <div className="cases-grid">
        {cases.map((caseItem, index) => (
          <div key={index} className="case-card">
            <div className="case-header">
              <span className="case-id">{caseItem.id}</span>
              <span 
                className="status-badge"
                style={{
                  background: getStatusColor(caseItem.status),
                  color: getStatusTextColor(caseItem.status)
                }}
              >
                {caseItem.status}
              </span>
            </div>

            <div className="case-body">
              <div className="case-info-grid">
                <div className="info-item">
                  <span className="info-label">Criminal</span>
                  <span className="info-value">{caseItem.criminal}</span>
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
                  <span className="info-label">Assigned Officer</span>
                  <span className="info-value">{caseItem.officer}</span>
                </div>
              </div>

              <div className="timeline-section">
                <h4 className="timeline-title">
                  <span>📅</span>
                  <span>Status Timeline</span>
                </h4>
                <div className="timeline">
                  {caseItem.timeline.map((item, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-status">{item.status}</div>
                        <div className="timeline-meta">
                          {item.date} • By {item.officer}
                        </div>
                        <div className="timeline-note">{item.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="case-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => handleStatusChange(caseItem)}
                >
                  <span>🔄</span>
                  <span>Update Status</span>
                </button>
                <button className="action-btn secondary">
                  <span>👁️</span>
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Case Status</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Case ID</label>
              <input 
                type="text" 
                value={selectedCase?.id} 
                disabled 
                style={{background: '#f5f6fa', color: '#a0a4b8'}}
              />
            </div>

            <div className="form-group">
              <label>New Status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Solved">Solved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Note (Optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this status change..."
              />
            </div>

            <button className="submit-btn" onClick={handleSubmitStatus}>
              Update Status
            </button>
          </div>
        </div>
      )}
    </>
  )
}
