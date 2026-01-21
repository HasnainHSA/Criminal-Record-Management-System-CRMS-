'use client'
import { useState, useEffect } from 'react'

export default function AssignCase() {
  const [unassignedCases, setUnassignedCases] = useState([])
  const [assignedCases, setAssignedCases] = useState([])
  const [officers, setOfficers] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [selectedOfficer, setSelectedOfficer] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [priority, setPriority] = useState('Medium')
  const [deadline, setDeadline] = useState('')
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch FIRs
      const firsResponse = await fetch('http://localhost:5000/api/view_all')
      const firsData = await firsResponse.json()
      
      // Fetch Officers
      const officersResponse = await fetch('http://localhost:5000/api/get_officers')
      const officersData = await officersResponse.json()
      
      if (firsData.success && firsData.records) {
        const unassigned = firsData.records
          .filter(r => !r.assigned_officer)
          .map(r => ({
            id: r.id,
            criminal: r.criminal_name,
            crime: r.crime,
            location: r.location,
            date: r.date,
            priority: r.priority || 'Medium'
          }))
        
        const assigned = firsData.records
          .filter(r => r.assigned_officer)
          .map(r => {
            const officer = officersData.officers?.find(o => o.officer_id === r.assigned_officer)
            return {
              id: r.id,
              criminal: r.criminal_name,
              crime: r.crime,
              location: r.location,
              officer: r.assigned_officer,
              officerName: officer?.name || r.assigned_officer,
              assignedDate: r.assigned_date || r.date,
              workload: 0
            }
          })
        
        setUnassignedCases(unassigned)
        setAssignedCases(assigned)
      }
      
      if (officersData.success && officersData.officers) {
        setOfficers(officersData.officers.map(o => ({
          id: o.officer_id,
          name: o.name,
          role: 'Officer',
          workload: firsData.records?.filter(r => r.assigned_officer === o.officer_id).length || 0,
          available: true
        })))
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  const handleAssignCase = (caseItem) => {
    setSelectedCase(caseItem)
    setShowModal(true)
  }

  const handleSubmitAssignment = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assign_case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fir_id: selectedCase.id,
          officer_id: selectedOfficer,
          priority,
          deadline,
          instructions
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const officer = officers.find(o => o.id === selectedOfficer)
        
        // Move case from unassigned to assigned
        setAssignedCases([
          ...assignedCases,
          {
            ...selectedCase,
            officer: selectedOfficer,
            officerName: officer.name,
            assignedDate: new Date().toISOString().split('T')[0],
            workload: officer.workload + 1,
            priority,
            deadline,
            instructions
          }
        ])

        setUnassignedCases(unassignedCases.filter(c => c.id !== selectedCase.id))
        
        // Update officer workload
        setOfficers(officers.map(o => 
          o.id === selectedOfficer ? {...o, workload: o.workload + 1} : o
        ))

        setShowModal(false)
        setSelectedOfficer('')
        setPriority('Medium')
        setDeadline('')
        setInstructions('')
      }
    } catch (error) {
      console.error('Failed to assign case:', error)
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#fee2e2',
      'Medium': '#fef3c7',
      'Low': '#dbeafe'
    }
    return colors[priority] || '#f3f4f6'
  }

  const getPriorityTextColor = (priority) => {
    const colors = {
      'High': '#991b1b',
      'Medium': '#92400e',
      'Low': '#1e40af'
    }
    return colors[priority] || '#6b7280'
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
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 25px;
        }
        
        /* Officers Panel */
        .officers-panel {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          height: fit-content;
          position: sticky;
          top: 100px;
        }
        
        .panel-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .officer-item {
          padding: 15px;
          background: #f5f6fa;
          border-radius: 12px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
        }
        
        .officer-item:hover {
          background: #e8eaf0;
        }
        
        .officer-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
        }
        
        .officer-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 800;
          color: white;
        }
        
        .officer-info {
          flex: 1;
        }
        
        .officer-name {
          font-size: 14px;
          font-weight: 700;
          color: #2d3561;
        }
        
        .officer-role {
          font-size: 12px;
          color: #a0a4b8;
        }
        
        .workload-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .workload-label {
          font-size: 12px;
          color: #a0a4b8;
          font-weight: 600;
        }
        
        .workload-progress {
          flex: 1;
          height: 6px;
          background: #e8eaf0;
          border-radius: 3px;
          overflow: hidden;
        }
        
        .workload-fill {
          height: 100%;
          background: linear-gradient(90deg, #1e3a8a 0%, #dc2626 100%);
          transition: width 0.3s ease;
        }
        
        .workload-count {
          font-size: 12px;
          font-weight: 700;
          color: #1e3a8a;
        }
        
        /* Cases Section */
        .cases-section {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }
        
        .section-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f5f6fa;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3561;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .count-badge {
          padding: 6px 12px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        
        .cases-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .cases-table th {
          text-align: left;
          padding: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #a0a4b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #f5f6fa;
        }
        
        .cases-table td {
          padding: 15px 12px;
          font-size: 14px;
          color: #2d3561;
          border-bottom: 1px solid #f5f6fa;
        }
        
        .cases-table tbody tr {
          transition: all 0.3s ease;
        }
        
        .cases-table tbody tr:hover {
          background: #f5f6fa;
        }
        
        .case-id {
          font-weight: 700;
          color: #1e3a8a;
        }
        
        .priority-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          display: inline-block;
        }
        
        .assign-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .assign-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .reassign-btn {
          padding: 8px 16px;
          background: #f5f6fa;
          color: #2d3561;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .reassign-btn:hover {
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
          min-height: 100px;
          resize: vertical;
        }
        
        .form-group input:focus,
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
        
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .officers-panel {
            position: static;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Assign Cases to Officers</h1>
        <p className="page-subtitle">Manage case assignments and officer workload</p>
      </div>

      <div className="content-grid">
        <div className="cases-section">
          {/* Unassigned Cases */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">
                <span>📋</span>
                <span>Unassigned Cases</span>
              </h3>
              <span className="count-badge">{unassignedCases.length}</span>
            </div>

            <table className="cases-table">
              <thead>
                <tr>
                  <th>FIR No.</th>
                  <th>Criminal</th>
                  <th>Crime</th>
                  <th>Location</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {unassignedCases.map((caseItem, index) => (
                  <tr key={index}>
                    <td className="case-id">{caseItem.id}</td>
                    <td>{caseItem.criminal}</td>
                    <td>{caseItem.crime}</td>
                    <td>{caseItem.location}</td>
                    <td>
                      <span 
                        className="priority-badge"
                        style={{
                          background: getPriorityColor(caseItem.priority),
                          color: getPriorityTextColor(caseItem.priority)
                        }}
                      >
                        {caseItem.priority}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="assign-btn"
                        onClick={() => handleAssignCase(caseItem)}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Assigned Cases */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">
                <span>✅</span>
                <span>Assigned Cases</span>
              </h3>
              <span className="count-badge">{assignedCases.length}</span>
            </div>

            <table className="cases-table">
              <thead>
                <tr>
                  <th>FIR No.</th>
                  <th>Criminal</th>
                  <th>Crime</th>
                  <th>Assigned To</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedCases.map((caseItem, index) => (
                  <tr key={index}>
                    <td className="case-id">{caseItem.id}</td>
                    <td>{caseItem.criminal}</td>
                    <td>{caseItem.crime}</td>
                    <td>{caseItem.officerName}</td>
                    <td>{caseItem.assignedDate}</td>
                    <td>
                      <button className="reassign-btn">Reassign</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Officers Panel */}
        <div className="officers-panel">
          <h3 className="panel-title">
            <span>👮</span>
            <span>Available Officers</span>
          </h3>

          {officers.map((officer, index) => (
            <div key={index} className="officer-item">
              <div className="officer-header">
                <div className="officer-avatar">
                  {officer.name.charAt(0)}
                </div>
                <div className="officer-info">
                  <div className="officer-name">{officer.name}</div>
                  <div className="officer-role">{officer.role}</div>
                </div>
              </div>
              <div className="workload-bar">
                <span className="workload-label">Workload</span>
                <div className="workload-progress">
                  <div 
                    className="workload-fill" 
                    style={{ width: `${(officer.workload / 10) * 100}%` }}
                  />
                </div>
                <span className="workload-count">{officer.workload}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Assign Case to Officer</h2>
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
              <label>Select Officer</label>
              <select 
                value={selectedOfficer} 
                onChange={(e) => setSelectedOfficer(e.target.value)}
                required
              >
                <option value="">Choose an officer...</option>
                {officers.map((officer, index) => (
                  <option key={index} value={officer.id}>
                    {officer.name} ({officer.role}) - Workload: {officer.workload}/10
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Add special instructions for the officer..."
              />
            </div>

            <button 
              className="submit-btn" 
              onClick={handleSubmitAssignment}
              disabled={!selectedOfficer}
            >
              Assign Case
            </button>
          </div>
        </div>
      )}
    </>
  )
}
