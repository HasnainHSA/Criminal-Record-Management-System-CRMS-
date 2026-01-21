'use client'
import { useState } from 'react'

export default function ViewFIRs() {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState(null)

  const parseRecords = (data) => {
    if (!data || data === 'No Records Found') {
      return []
    }
    
    const lines = data.split('\n').filter(line => line.trim())
    const recordsList = []
    let currentRecord = {}
    
    for (let line of lines) {
      if (line.startsWith('FIR #')) {
        if (Object.keys(currentRecord).length > 0) {
          recordsList.push(currentRecord)
        }
        currentRecord = { id: line.replace('FIR #', '').trim() }
      } else if (line.startsWith('Criminal:')) {
        currentRecord.criminal = line.replace('Criminal:', '').trim()
      } else if (line.startsWith('Crime:')) {
        currentRecord.crime = line.replace('Crime:', '').trim()
      } else if (line.startsWith('Location:')) {
        currentRecord.location = line.replace('Location:', '').trim()
      } else if (line.startsWith('Date:')) {
        currentRecord.date = line.replace('Date:', '').trim()
      }
    }
    
    if (Object.keys(currentRecord).length > 0) {
      recordsList.push(currentRecord)
    }
    
    return recordsList
  }

  const handleLoadRecords = async () => {
    setLoading(true)
    setRecords(null)

    try {
      const response = await fetch('http://localhost:5000/api/view_all')
      const data = await response.json()
      setRecords(data.data)
    } catch (error) {
      setRecords('Failed to connect to backend')
    } finally {
      setLoading(false)
    }
  }

  const recordsList = records ? parseRecords(records) : []

  return (
    <div className="card">
      <h2>View All FIR Records</h2>
      
      <button 
        onClick={handleLoadRecords} 
        className="btn" 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Load All Records'}
      </button>

      {records && (
        <div className="records-container">
          <h3 style={{marginBottom: '20px', color: '#2d3748'}}>
            FIR Records: {recordsList.length > 0 ? `${recordsList.length} found` : 'No records'}
          </h3>
          
          {recordsList.length > 0 ? (
            recordsList.map((record, index) => (
              <div key={index} className="record-card">
                <h3>FIR #{record.id || index + 1}</h3>
                <div className="record-field">
                  <strong>Criminal:</strong> {record.criminal}
                </div>
                <div className="record-field">
                  <strong>Crime:</strong> {record.crime}
                </div>
                <div className="record-field">
                  <strong>Location:</strong> {record.location}
                </div>
                <div className="record-field">
                  <strong>Date:</strong> {record.date}
                </div>
              </div>
            ))
          ) : (
            <div style={{textAlign: 'center', padding: '40px', color: '#718096'}}>
              {records === 'No Records Found' ? 'No FIR records found. Add some records first!' : records}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
