'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalFIRs: 0,
    activeCases: 0,
    solvedCases: 0,
    officers: 0,
    myAssignedCases: 0
  })
  const [recentCases, setRecentCases] = useState([])
  const [myAssignedCases, setMyAssignedCases] = useState([])
  const [crimeTypes, setCrimeTypes] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchStats(parsedUser)
    }
  }, [])

  const fetchStats = async (currentUser) => {
    setLoading(true)
    try {
      // Fetch FIRs
      const firsResponse = await fetch('http://localhost:5000/api/view_all')
      const firsData = await firsResponse.json()
      
      // Fetch Officers
      const officersResponse = await fetch('http://localhost:5000/api/get_officers')
      const officersData = await officersResponse.json()
      
      if (firsData.success && firsData.records) {
        const firs = firsData.records
        const totalFIRs = firs.length
        const activeCases = firs.filter(f => f.status === 'Active').length
        const solvedCases = firs.filter(f => f.status === 'Solved').length
        
        // Get assigned cases for current officer
        let myAssigned = []
        let myAssignedCount = 0
        if (currentUser && currentUser.role === 'officer') {
          myAssigned = firs.filter(f => f.assigned_officer === currentUser.id)
          myAssignedCount = myAssigned.length
        }
        
        setStats({
          totalFIRs,
          activeCases,
          solvedCases,
          officers: officersData.officers?.length || 0,
          myAssignedCases: myAssignedCount
        })
        
        // Set recent cases (last 5)
        setRecentCases(firs.slice(-5).reverse().map(f => ({
          id: f.id,
          criminal: f.criminal_name,
          crime: f.crime,
          location: f.location,
          date: f.date,
          status: f.status || 'Pending'
        })))
        
        // Set my assigned cases for officers
        if (myAssigned.length > 0) {
          setMyAssignedCases(myAssigned.map(f => ({
            id: f.id,
            criminal: f.criminal_name,
            crime: f.crime,
            location: f.location,
            date: f.date,
            status: f.status || 'Pending',
            priority: f.priority || 'Medium'
          })))
        }
        
        // Calculate crime types for chart
        const crimeTypes = {}
        firs.forEach(fir => {
          crimeTypes[fir.crime] = (crimeTypes[fir.crime] || 0) + 1
        })
        
        const crimeArray = Object.entries(crimeTypes).map(([type, count]) => ({
          type,
          count,
          color: ['#1e3a8a', '#3b82f6', '#dc2626', '#ef4444', '#10b981', '#fbbf24'][Object.keys(crimeTypes).indexOf(type) % 6]
        })).sort((a, b) => b.count - a.count).slice(0, 5)
        
        setCrimeTypes(crimeArray)
        
        // Calculate monthly data
        const monthlyData = {}
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        firs.forEach(fir => {
          if (fir.date) {
            const date = new Date(fir.date)
            const monthKey = monthNames[date.getMonth()]
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
          }
        })
        
        // Create monthly array with last 9 months
        const currentMonth = new Date().getMonth()
        const monthData = []
        for (let i = 8; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          const monthName = monthNames[monthIndex]
          monthData.push({
            month: monthName,
            cases: monthlyData[monthName] || 0
          })
        }
        setMonthlyData(monthData)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxCases = Math.max(...monthlyData.map(d => d.cases), 1)

  return (
    <>
      <style jsx>{`
        .dashboard-header {
          margin-bottom: 30px;
        }
        
        .dashboard-title {
          font-size: 32px;
          font-weight: 800;
          color: #2d3561;
          margin-bottom: 8px;
        }
        
        .dashboard-subtitle {
          font-size: 15px;
          color: #a0a4b8;
        }
        
        /* Stats Cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(180deg, #1e3a8a 0%, #dc2626 100%);
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
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
        
        .stat-icon.blue {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
        }
        
        .stat-icon.pink {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        }
        
        .stat-icon.green {
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
        }
        
        .stat-icon.purple {
          background: linear-gradient(135deg, #3b82f6 0%, #dc2626 100%);
        }
        
        .stat-trend {
          font-size: 13px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
        }
        
        .stat-trend.up {
          background: #d1fae5;
          color: #065f46;
        }
        
        .stat-trend.down {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .stat-value {
          font-size: 36px;
          font-weight: 800;
          color: #2d3561;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #a0a4b8;
          font-weight: 600;
        }
        
        /* Charts Section */
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 25px;
          margin-bottom: 30px;
        }
        
        .chart-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        
        .chart-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3561;
        }
        
        .chart-filters {
          display: flex;
          gap: 10px;
        }
        
        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #e8eaf0;
          background: white;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #a0a4b8;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border-color: transparent;
        }
        
        /* Bar Chart */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 250px;
          gap: 15px;
        }
        
        .bar-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .bar {
          width: 100%;
          background: linear-gradient(180deg, #1e3a8a 0%, #dc2626 100%);
          border-radius: 8px 8px 0 0;
          position: relative;
          transition: all 0.3s ease;
          animation: growUp 1s ease-out;
        }
        
        @keyframes growUp {
          from {
            height: 0;
          }
        }
        
        .bar:hover {
          opacity: 0.8;
          transform: translateY(-5px);
        }
        
        .bar-value {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          font-weight: 700;
          color: #2d3561;
          background: white;
          padding: 4px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .bar-label {
          font-size: 13px;
          font-weight: 600;
          color: #a0a4b8;
        }
        
        /* Crime Types */
        .crime-types {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .crime-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .crime-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .crime-name {
          font-size: 14px;
          font-weight: 600;
          color: #2d3561;
        }
        
        .crime-count {
          font-size: 14px;
          font-weight: 700;
          color: #1e3a8a;
        }
        
        .crime-bar {
          height: 8px;
          background: #f5f6fa;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .crime-progress {
          height: 100%;
          border-radius: 4px;
          transition: width 1s ease-out;
          animation: slideIn 1s ease-out;
        }
        
        @keyframes slideIn {
          from {
            width: 0;
          }
        }
        
        /* Recent Cases */
        .recent-cases {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .cases-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .cases-table th {
          text-align: left;
          padding: 15px;
          font-size: 13px;
          font-weight: 700;
          color: #a0a4b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #f5f6fa;
        }
        
        .cases-table td {
          padding: 18px 15px;
          font-size: 14px;
          color: #2d3561;
          border-bottom: 1px solid #f5f6fa;
        }
        
        .cases-table tr:hover {
          background: #f5f6fa;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }
        
        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-badge.active {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .status-badge.solved {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-badge.high {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .status-badge.medium {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-badge.low {
          background: #dbeafe;
          color: #1e40af;
        }
        
        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon blue">📋</div>
            <span className="stat-trend up">Real-time</span>
          </div>
          <div className="stat-value">{stats.totalFIRs}</div>
          <div className="stat-label">Total FIRs</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon pink">⚖️</div>
            <span className="stat-trend up">Active</span>
          </div>
          <div className="stat-value">{stats.activeCases}</div>
          <div className="stat-label">Active Cases</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon green">✅</div>
            <span className="stat-trend up">Completed</span>
          </div>
          <div className="stat-value">{stats.solvedCases}</div>
          <div className="stat-label">Solved Cases</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon purple">
              {user?.role === 'officer' ? '📌' : '👮'}
            </div>
            <span className="stat-trend up">
              {user?.role === 'officer' ? 'Assigned' : 'Active'}
            </span>
          </div>
          <div className="stat-value">
            {user?.role === 'officer' ? stats.myAssignedCases : stats.officers}
          </div>
          <div className="stat-label">
            {user?.role === 'officer' ? 'My Cases' : 'Active Officers'}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Monthly Cases Report</h3>
            <div className="chart-filters">
              <button className="filter-btn">7 Days</button>
              <button className="filter-btn active">30 Days</button>
              <button className="filter-btn">90 Days</button>
            </div>
          </div>
          <div className="bar-chart">
            {monthlyData.length > 0 ? (
              monthlyData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div 
                    className="bar" 
                    style={{ height: `${item.cases > 0 ? (item.cases / maxCases) * 100 : 5}%` }}
                  >
                    {item.cases > 0 && <span className="bar-value">{item.cases}</span>}
                  </div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))
            ) : (
              <div style={{width: '100%', textAlign: 'center', color: '#a0a4b8'}}>
                No data available
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Crime Types</h3>
          </div>
          <div className="crime-types">
            {crimeTypes.length > 0 ? (
              crimeTypes.map((crime, index) => {
                const maxCount = Math.max(...crimeTypes.map(c => c.count))
                const percentage = (crime.count / maxCount) * 100
                return (
                  <div key={index} className="crime-item">
                    <div className="crime-header">
                      <span className="crime-name">{crime.type}</span>
                      <span className="crime-count">{crime.count}</span>
                    </div>
                    <div className="crime-bar">
                      <div 
                        className="crime-progress" 
                        style={{ 
                          width: `${percentage}%`,
                          background: crime.color
                        }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{textAlign: 'center', color: '#a0a4b8', padding: '40px 20px'}}>
                No crime data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Cases or My Assigned Cases */}
      <div className="recent-cases">
        <div className="chart-header">
          <h3 className="chart-title">
            {user?.role === 'officer' && myAssignedCases.length > 0 
              ? 'My Assigned Cases' 
              : 'Recent Cases'}
          </h3>
        </div>
        <table className="cases-table">
          <thead>
            <tr>
              <th>FIR No.</th>
              <th>Criminal Name</th>
              <th>Crime Type</th>
              <th>Location</th>
              <th>Date</th>
              {user?.role === 'officer' && myAssignedCases.length > 0 && <th>Priority</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(user?.role === 'officer' && myAssignedCases.length > 0 
              ? myAssignedCases 
              : recentCases
            ).map((caseItem, index) => (
              <tr key={index}>
                <td>{caseItem.id}</td>
                <td>{caseItem.criminal}</td>
                <td>{caseItem.crime}</td>
                <td>{caseItem.location}</td>
                <td>{caseItem.date}</td>
                {user?.role === 'officer' && myAssignedCases.length > 0 && (
                  <td>
                    <span className={`status-badge ${caseItem.priority?.toLowerCase() || 'medium'}`}>
                      {caseItem.priority || 'Medium'}
                    </span>
                  </td>
                )}
                <td>
                  <span className={`status-badge ${caseItem.status.toLowerCase()}`}>
                    {caseItem.status}
                  </span>
                </td>
              </tr>
            ))}
            {((user?.role === 'officer' && myAssignedCases.length === 0) || 
              (user?.role !== 'officer' && recentCases.length === 0)) && (
              <tr>
                <td colSpan={user?.role === 'officer' && myAssignedCases.length > 0 ? "7" : "6"} 
                    style={{textAlign: 'center', color: '#a0a4b8', padding: '40px'}}>
                  {user?.role === 'officer' 
                    ? 'No cases assigned to you yet' 
                    : 'No cases registered yet'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
