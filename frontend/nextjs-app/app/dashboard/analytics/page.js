'use client'
import { useState, useEffect } from 'react'

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('month')
  const [stats, setStats] = useState({
    totalCases: 0,
    activeCases: 0,
    solvedCases: 0,
    pendingCases: 0,
    totalOfficers: 0,
    resolutionRate: 0,
    avgDaysToSolve: 0
  })
  const [crimeDistribution, setCrimeDistribution] = useState([])
  const [locationStats, setLocationStats] = useState([])
  const [officerPerformance, setOfficerPerformance] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [pieChartData, setPieChartData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
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
        
        // Calculate stats
        const totalCases = firs.length
        const activeCases = firs.filter(f => f.status === 'Active').length
        const solvedCases = firs.filter(f => f.status === 'Solved').length
        const pendingCases = firs.filter(f => f.status === 'Pending').length
        const resolutionRate = totalCases > 0 ? ((solvedCases / totalCases) * 100).toFixed(1) : 0
        
        setStats({
          totalCases,
          activeCases,
          solvedCases,
          pendingCases,
          totalOfficers: officersData.officers?.length || 0,
          resolutionRate,
          avgDaysToSolve: 4.2 // Mock for now
        })
        
        // Crime distribution
        const crimeTypes = {}
        firs.forEach(fir => {
          crimeTypes[fir.crime] = (crimeTypes[fir.crime] || 0) + 1
        })
        
        const crimeArray = Object.entries(crimeTypes).map(([type, count]) => ({
          type,
          count,
          percentage: ((count / totalCases) * 100).toFixed(0)
        })).sort((a, b) => b.count - a.count)
        
        setCrimeDistribution(crimeArray)
        
        // Calculate pie chart percentages for conic-gradient
        let cumulativePercentage = 0
        const pieSegments = crimeArray.slice(0, 6).map((crime, index) => {
          const percentage = (crime.count / totalCases) * 100
          const start = cumulativePercentage
          const end = cumulativePercentage + percentage
          cumulativePercentage = end
          return {
            color: ['#1e3a8a', '#3b82f6', '#dc2626', '#ef4444', '#10b981', '#fbbf24'][index],
            start,
            end,
            crime: crime.type,
            count: crime.count
          }
        })
        setPieChartData(pieSegments)
        
        // Location stats
        const locations = {}
        firs.forEach(fir => {
          locations[fir.location] = (locations[fir.location] || 0) + 1
        })
        
        const locationArray = Object.entries(locations).map(([location, cases]) => ({
          location,
          cases,
          change: '+0%' // Mock for now
        })).sort((a, b) => b.cases - a.cases).slice(0, 5)
        
        setLocationStats(locationArray)
        
        // Monthly trend - group by month
        const monthlyData = {}
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        firs.forEach(fir => {
          if (fir.date) {
            const date = new Date(fir.date)
            const monthKey = monthNames[date.getMonth()]
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = { total: 0, solved: 0 }
            }
            monthlyData[monthKey].total++
            if (fir.status === 'Solved') {
              monthlyData[monthKey].solved++
            }
          }
        })
        
        // Create monthly trend array with last 6 months
        const currentMonth = new Date().getMonth()
        const trendData = []
        for (let i = 5; i >= 0; i--) {
          const monthIndex = (currentMonth - i + 12) % 12
          const monthName = monthNames[monthIndex]
          trendData.push({
            month: monthName,
            cases: monthlyData[monthName]?.total || 0,
            solved: monthlyData[monthName]?.solved || 0
          })
        }
        setMonthlyTrend(trendData)
        
        // Officer performance
        if (officersData.success && officersData.officers) {
          const performance = officersData.officers.map(officer => {
            const assignedCases = firs.filter(f => f.assigned_officer === officer.officer_id)
            const solvedByOfficer = assignedCases.filter(f => f.status === 'Solved').length
            const totalAssigned = assignedCases.length
            const rate = totalAssigned > 0 ? ((solvedByOfficer / totalAssigned) * 100).toFixed(0) : 0
            
            return {
              name: officer.name,
              solved: solvedByOfficer,
              pending: totalAssigned - solvedByOfficer,
              rate: parseInt(rate)
            }
          }).filter(o => o.solved + o.pending > 0)
          
          setOfficerPerformance(performance)
        }
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxCases = Math.max(...monthlyTrend.map(d => d.cases), 1)
  
  // Generate conic-gradient for pie chart
  const generatePieGradient = () => {
    if (pieChartData.length === 0) return 'conic-gradient(#1e3a8a 0% 100%)'
    
    const gradientParts = pieChartData.map(segment => 
      `${segment.color} ${segment.start}% ${segment.end}%`
    )
    return `conic-gradient(${gradientParts.join(', ')})`
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
        
        .time-filters {
          display: flex;
          gap: 10px;
          background: white;
          padding: 6px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .time-btn {
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
        
        .time-btn.active {
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
        }
        
        /* Stats Overview */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #1e3a8a15 0%, #dc262615 100%);
          border-radius: 50%;
          transform: translate(30%, -30%);
        }
        
        .stat-icon {
          font-size: 32px;
          margin-bottom: 15px;
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
        
        .stat-trend {
          font-size: 13px;
          font-weight: 700;
          margin-top: 10px;
        }
        
        .stat-trend.up {
          color: #16a34a;
        }
        
        .stat-trend.down {
          color: #dc2626;
        }
        
        /* Charts Grid */
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
          margin-bottom: 30px;
        }
        
        .chart-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3561;
        }
        
        .export-btn {
          padding: 10px 20px;
          background: #f5f6fa;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 13px;
          color: #2d3561;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .export-btn:hover {
          background: #e8eaf0;
        }
        
        /* Line Chart */
        .line-chart {
          height: 300px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          position: relative;
        }
        
        .line-chart::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: #e8eaf0;
        }
        
        .chart-bar-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        
        .bars-container {
          display: flex;
          gap: 5px;
          align-items: flex-end;
          width: 100%;
          justify-content: center;
        }
        
        .chart-bar {
          width: 30px;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          animation: growUp 1s ease-out;
          position: relative;
          min-height: 5%;
        }
        
        @keyframes growUp {
          from { height: 0; }
        }
        
        .chart-bar.cases {
          background: linear-gradient(180deg, #1e3a8a 0%, #dc2626 100%);
        }
        
        .chart-bar.solved {
          background: linear-gradient(180deg, #10b981 0%, #34d399 100%);
        }
        
        .chart-bar:hover {
          opacity: 0.8;
        }
        
        .chart-label {
          font-size: 13px;
          font-weight: 600;
          color: #a0a4b8;
        }
        
        .chart-legend {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          justify-content: center;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }
        
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        
        /* Pie Chart */
        .pie-chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px;
        }
        
        .pie-chart {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: conic-gradient(
            #1e3a8a 0% 28%,
            #3b82f6 28% 47%,
            #dc2626 47% 62%,
            #ef4444 62% 75%,
            #43e97b 75% 87%,
            #fbbf24 87% 100%
          );
          position: relative;
          animation: spin 1s ease-out;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .pie-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          background: white;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .pie-total {
          font-size: 32px;
          font-weight: 800;
          color: #2d3561;
        }
        
        .pie-label {
          font-size: 12px;
          color: #a0a4b8;
          font-weight: 600;
        }
        
        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        
        .pie-legend-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f5f6fa;
          border-radius: 8px;
        }
        
        .pie-legend-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .pie-legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        
        .pie-legend-name {
          font-size: 13px;
          font-weight: 600;
          color: #2d3561;
        }
        
        .pie-legend-value {
          font-size: 13px;
          font-weight: 700;
          color: #1e3a8a;
        }
        
        /* Tables */
        .tables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
        }
        
        .table-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .data-table th {
          text-align: left;
          padding: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #a0a4b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #f5f6fa;
        }
        
        .data-table td {
          padding: 15px 12px;
          font-size: 14px;
          color: #2d3561;
          border-bottom: 1px solid #f5f6fa;
        }
        
        .data-table tbody tr {
          transition: all 0.3s ease;
        }
        
        .data-table tbody tr:hover {
          background: #f5f6fa;
        }
        
        .location-name {
          font-weight: 700;
        }
        
        .change-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
        }
        
        .change-badge.positive {
          background: #d1fae5;
          color: #065f46;
        }
        
        .change-badge.negative {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .performance-bar {
          width: 100%;
          height: 8px;
          background: #e8eaf0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .performance-fill {
          height: 100%;
          background: linear-gradient(90deg, #1e3a8a 0%, #dc2626 100%);
          border-radius: 4px;
          transition: width 1s ease-out;
        }
        
        @media (max-width: 1024px) {
          .charts-grid,
          .tables-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Analytics & Reports</h1>
        <div className="time-filters">
          <button 
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{stats.totalCases}</div>
          <div className="stat-label">Total Cases</div>
          <div className="stat-trend up">Real-time data</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.resolutionRate}%</div>
          <div className="stat-label">Resolution Rate</div>
          <div className="stat-trend up">{stats.solvedCases} solved</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-value">{stats.activeCases}</div>
          <div className="stat-label">Active Cases</div>
          <div className="stat-trend up">{stats.pendingCases} pending</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👮</div>
          <div className="stat-value">{stats.totalOfficers}</div>
          <div className="stat-label">Active Officers</div>
          <div className="stat-trend up">Registered officers</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Line Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Crime Trends</h3>
            <button className="export-btn">
              <span>📥</span>
              <span>Export</span>
            </button>
          </div>

          <div className="line-chart">
            {monthlyTrend.length > 0 && monthlyTrend.some(m => m.cases > 0) ? (
              monthlyTrend.map((item, index) => (
                <div key={index} className="chart-bar-group">
                  <div className="bars-container">
                    <div 
                      className="chart-bar cases" 
                      style={{ 
                        height: item.cases > 0 ? `${(item.cases / maxCases) * 100}%` : '5%',
                        minHeight: '5%'
                      }}
                      title={`Cases: ${item.cases}`}
                    >
                      {item.cases > 0 && (
                        <span className="bar-value" style={{
                          position: 'absolute',
                          top: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#2d3561',
                          background: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.cases}
                        </span>
                      )}
                    </div>
                    <div 
                      className="chart-bar solved" 
                      style={{ 
                        height: item.solved > 0 ? `${(item.solved / maxCases) * 100}%` : '5%',
                        minHeight: '5%'
                      }}
                      title={`Solved: ${item.solved}`}
                    >
                      {item.solved > 0 && (
                        <span className="bar-value" style={{
                          position: 'absolute',
                          top: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#2d3561',
                          background: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.solved}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="chart-label">{item.month}</span>
                </div>
              ))
            ) : (
              <div style={{
                width: '100%', 
                textAlign: 'center', 
                color: '#a0a4b8',
                padding: '60px 20px',
                background: '#f5f6fa',
                borderRadius: '12px'
              }}>
                <div style={{fontSize: '48px', marginBottom: '15px', opacity: 0.3}}>📊</div>
                <div style={{fontSize: '16px', fontWeight: '600'}}>No trend data available yet</div>
                <div style={{fontSize: '14px', marginTop: '8px', opacity: 0.7}}>Register FIRs to see monthly trends</div>
              </div>
            )}
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)'}}></div>
              <span>Total Cases</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'}}></div>
              <span>Solved Cases</span>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Crime Distribution</h3>
          </div>

          <div className="pie-chart-container">
            <div 
              className="pie-chart"
              style={{ background: generatePieGradient() }}
            >
              <div className="pie-center">
                <div className="pie-total">{stats.totalCases}</div>
                <div className="pie-label">Total</div>
              </div>
            </div>

            <div className="pie-legend">
              {crimeDistribution.slice(0, 6).map((item, index) => (
                <div key={index} className="pie-legend-item">
                  <div className="pie-legend-left">
                    <div 
                      className="pie-legend-color" 
                      style={{background: ['#1e3a8a', '#3b82f6', '#dc2626', '#ef4444', '#10b981', '#fbbf24'][index]}}
                    />
                    <span className="pie-legend-name">{item.type}</span>
                  </div>
                  <span className="pie-legend-value">{item.count}</span>
                </div>
              ))}
              {crimeDistribution.length === 0 && (
                <div style={{textAlign: 'center', color: '#a0a4b8', padding: '20px'}}>
                  No crime data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="tables-grid">
        {/* Top Locations */}
        <div className="table-card">
          <h3 className="chart-title">Top Crime Locations</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Cases</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {locationStats.map((item, index) => (
                <tr key={index}>
                  <td className="location-name">{item.location}</td>
                  <td>{item.cases}</td>
                  <td>
                    <span className={`change-badge ${item.change.startsWith('+') ? 'positive' : 'negative'}`}>
                      {item.change}
                    </span>
                  </td>
                </tr>
              ))}
              {locationStats.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', color: '#a0a4b8'}}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Officer Performance */}
        <div className="table-card">
          <h3 className="chart-title">Officer Performance</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Officer</th>
                <th>Solved</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {officerPerformance.map((item, index) => (
                <tr key={index}>
                  <td className="location-name">{item.name}</td>
                  <td>{item.solved}/{item.solved + item.pending}</td>
                  <td>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {officerPerformance.length === 0 && (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', color: '#a0a4b8'}}>
                    No officer data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
