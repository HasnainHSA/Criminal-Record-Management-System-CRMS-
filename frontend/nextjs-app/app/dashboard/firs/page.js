'use client'
import { useState, useEffect } from 'react'

export default function ViewAllFIRs() {
  const [firs, setFirs] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedFIR, setSelectedFIR] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchFIRs()
  }, [])

  const fetchFIRs = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/view_all')
      const data = await response.json()
      
      if (data.success && data.records) {
        setFirs(data.records.map(r => ({
          id: r.id,
          criminal: r.criminal_name,
          crime: r.crime,
          location: r.location,
          date: r.date,
          status: r.status || 'Active',
          officer: r.officer || 'N/A'
        })))
      }
    } catch (error) {
      console.error('Failed to fetch FIRs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFIRs = firs.filter(fir => {
    if (filter === 'all') return true
    return fir.status.toLowerCase() === filter
  })

  const handleViewDetails = (fir) => {
    setSelectedFIR(fir)
    setShowModal(true)
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
        
        .header-actions {
          display: flex;
          gap: 15px;
        }
        
        .filter-tabs {
          display: flex;
          gap: 10px;
          background: white;
          padding: 8px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .filter-tab {
          padding: 10px 20px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #a0a4b8;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-tab.active {
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
        }
        
        .sort-select {
          padding: 10px 16px;
          border: 2px solid #e8eaf0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          color: #2d3561;
          background: white;
          cursor: pointer;
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
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .stat-icon.total { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); }
        .stat-icon.active { background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%); }
        .stat-icon.pending { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); }
        .stat-icon.solved { background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%); }
        
        .stat-info h4 {
          font-size: 24px;
          font-weight: 800;
          color: #2d3561;
          margin-bottom: 3px;
        }
        
        .stat-info p {
          font-size: 13px;
          color: #a0a4b8;
          font-weight: 600;
        }
        
        .firs-table-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        
        .firs-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .firs-table thead {
          background: #f5f6fa;
        }
        
        .firs-table th {
          text-align: left;
          padding: 18px 20px;
          font-size: 13px;
          font-weight: 700;
          color: #2d3561;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .firs-table td {
          padding: 20px;
          font-size: 14px;
          color: #2d3561;
          border-bottom: 1px solid #f5f6fa;
        }
        
        .firs-table tbody tr {
          transition: all 0.3s ease;
        }
        
        .firs-table tbody tr:hover {
          background: #f5f6fa;
        }
        
        .fir-id {
          font-weight: 700;
          color: #1e3a8a;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          display: inline-block;
        }
        
        .status-badge.active {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-badge.solved {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-badge.closed {
          background: #f3f4f6;
          color: #6b7280;
        }
        
        .action-btns {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .action-btn.view {
          background: #dbeafe;
        }
        
        .action-btn.edit {
          background: #fef3c7;
        }
        
        .action-btn.delete {
          background: #fee2e2;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
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
          max-width: 700px;
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
          padding-bottom: 20px;
          border-bottom: 2px solid #f5f6fa;
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
        
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 25px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .detail-item.full {
          grid-column: 1 / -1;
        }
        
        .detail-label {
          font-size: 12px;
          color: #a0a4b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 15px;
          color: #2d3561;
          font-weight: 600;
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">All FIR Records</h1>
        <div className="header-actions">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-tab ${filter === 'solved' ? 'active' : ''}`}
              onClick={() => setFilter('solved')}
            >
              Solved
            </button>
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-icon total">📋</div>
          <div className="stat-info">
            <h4>{firs.length}</h4>
            <p>Total FIRs</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon active">⚖️</div>
          <div className="stat-info">
            <h4>{firs.filter(f => f.status === 'Active').length}</h4>
            <p>Active Cases</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h4>{firs.filter(f => f.status === 'Pending').length}</h4>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon solved">✅</div>
          <div className="stat-info">
            <h4>{firs.filter(f => f.status === 'Solved').length}</h4>
            <p>Solved</p>
          </div>
        </div>
      </div>

      <div className="firs-table-container">
        {filteredFIRs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No FIR records found</p>
          </div>
        ) : (
          <table className="firs-table">
            <thead>
              <tr>
                <th>FIR No.</th>
                <th>Criminal Name</th>
                <th>Crime Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Officer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFIRs.map((fir, index) => (
                <tr key={index}>
                  <td className="fir-id">{fir.id}</td>
                  <td>{fir.criminal}</td>
                  <td>{fir.crime}</td>
                  <td>{fir.location}</td>
                  <td>{fir.date}</td>
                  <td>{fir.officer}</td>
                  <td>
                    <span className={`status-badge ${fir.status.toLowerCase()}`}>
                      {fir.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn view" title="View" onClick={() => handleViewDetails(fir)}>👁️</button>
                      <button className="action-btn edit" title="Edit">✏️</button>
                      <button className="action-btn delete" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Details Modal */}
      {showModal && selectedFIR && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">FIR Details - {selectedFIR.id}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">FIR Number</span>
                <span className="detail-value">{selectedFIR.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${selectedFIR.status.toLowerCase()}`}>
                  {selectedFIR.status}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Criminal Name</span>
                <span className="detail-value">{selectedFIR.criminal}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Crime Type</span>
                <span className="detail-value">{selectedFIR.crime}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{selectedFIR.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date</span>
                <span className="detail-value">{selectedFIR.date}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Assigned Officer</span>
                <span className="detail-value">{selectedFIR.officer}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Registration Date</span>
                <span className="detail-value">{selectedFIR.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
