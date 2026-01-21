'use client'
import { useState } from 'react'

export default function SearchCriminal() {
  const [filters, setFilters] = useState({
    name: '',
    crime: '',
    location: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch('http://localhost:5000/api/search_criminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criminal_name: filters.name })
      })

      const data = await response.json()
      
      if (data.success && data.records) {
        setResults(data.records.map(r => ({
          id: r.id,
          name: r.criminal_name,
          crime: r.crime,
          location: r.location,
          date: r.date,
          status: r.status || 'Active',
          description: `${r.crime} incident at ${r.location}`
        })))
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({
      name: '',
      crime: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      status: ''
    })
    setResults([])
    setSearched(false)
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
        
        .search-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 25px;
        }
        
        /* Filters Panel */
        .filters-panel {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          height: fit-content;
          position: sticky;
          top: 100px;
        }
        
        .filters-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .filter-group {
          margin-bottom: 20px;
        }
        
        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2d3561;
          font-size: 14px;
        }
        
        .filter-group input,
        .filter-group select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e8eaf0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: #f5f6fa;
        }
        
        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: #1e3a8a;
          background: white;
        }
        
        .filter-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 25px;
        }
        
        .search-btn {
          padding: 14px;
          background: linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        
        .reset-btn {
          padding: 14px;
          background: #f5f6fa;
          color: #2d3561;
          border: 2px solid #e8eaf0;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .reset-btn:hover {
          background: #e8eaf0;
        }
        
        /* Results Panel */
        .results-panel {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          min-height: 500px;
        }
        
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f5f6fa;
        }
        
        .results-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3561;
        }
        
        .results-count {
          font-size: 14px;
          color: #a0a4b8;
          font-weight: 600;
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
        
        .results-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .result-card {
          padding: 25px;
          border: 2px solid #f5f6fa;
          border-radius: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .result-card:hover {
          border-color: #1e3a8a;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transform: translateY(-3px);
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }
        
        .result-id {
          font-size: 13px;
          font-weight: 700;
          color: #1e3a8a;
          background: #1e3a8a15;
          padding: 6px 12px;
          border-radius: 6px;
        }
        
        .result-status {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        
        .result-status.active {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .result-status.solved {
          background: #d1fae5;
          color: #065f46;
        }
        
        .result-status.pending {
          background: #fef3c7;
          color: #92400e;
        }
        
        .result-name {
          font-size: 20px;
          font-weight: 700;
          color: #2d3561;
          margin-bottom: 12px;
        }
        
        .result-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .detail-label {
          font-size: 12px;
          color: #a0a4b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .detail-value {
          font-size: 14px;
          color: #2d3561;
          font-weight: 600;
        }
        
        .result-description {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          padding-top: 15px;
          border-top: 1px solid #f5f6fa;
        }
        
        @media (max-width: 1024px) {
          .search-container {
            grid-template-columns: 1fr;
          }
          
          .filters-panel {
            position: static;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Search Criminal Records</h1>
        <p className="page-subtitle">Use advanced filters to find specific criminal records</p>
      </div>

      <div className="search-container">
        {/* Filters Panel */}
        <div className="filters-panel">
          <h3 className="filters-title">
            <span>🔍</span>
            <span>Search Filters</span>
          </h3>

          <form onSubmit={handleSearch}>
            <div className="filter-group">
              <label>Criminal Name</label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
                placeholder="Enter name..."
              />
            </div>

            <div className="filter-group">
              <label>Crime Type</label>
              <select
                value={filters.crime}
                onChange={(e) => setFilters({...filters, crime: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="Theft">Theft</option>
                <option value="Robbery">Robbery</option>
                <option value="Burglary">Burglary</option>
                <option value="Assault">Assault</option>
                <option value="Murder">Murder</option>
                <option value="Kidnapping">Kidnapping</option>
                <option value="Fraud">Fraud</option>
                <option value="Cybercrime">Cybercrime</option>
                <option value="Drug Trafficking">Drug Trafficking</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                placeholder="Enter location..."
              />
            </div>

            <div className="filter-group">
              <label>Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>

            <div className="filter-group">
              <label>Case Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Solved">Solved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="filter-actions">
              <button type="submit" className="search-btn" disabled={loading}>
                <span>🔍</span>
                <span>{loading ? 'Searching...' : 'Search'}</span>
              </button>
              <button type="button" className="reset-btn" onClick={handleReset}>
                Reset Filters
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <div className="results-header">
            <h3 className="results-title">Search Results</h3>
            {results.length > 0 && (
              <span className="results-count">{results.length} records found</span>
            )}
          </div>

          {!searched ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p className="empty-text">Use filters to search for criminal records</p>
            </div>
          ) : results.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-text">No records found matching your criteria</p>
            </div>
          ) : (
            <div className="results-grid">
              {results.map((result, index) => (
                <div key={index} className="result-card">
                  <div className="result-header">
                    <span className="result-id">{result.id}</span>
                    <span className={`result-status ${result.status.toLowerCase()}`}>
                      {result.status}
                    </span>
                  </div>
                  
                  <h4 className="result-name">{result.name}</h4>
                  
                  <div className="result-details">
                    <div className="detail-item">
                      <span className="detail-label">Crime Type</span>
                      <span className="detail-value">{result.crime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{result.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{result.date}</span>
                    </div>
                  </div>
                  
                  <p className="result-description">{result.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
