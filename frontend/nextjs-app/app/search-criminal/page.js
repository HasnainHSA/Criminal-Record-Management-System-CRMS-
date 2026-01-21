'use client'
import { useState } from 'react'

export default function SearchCriminal() {
  const [criminalName, setCriminalName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://localhost:5000/api/search_criminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criminal_name: criminalName })
      })

      const data = await response.json()
      setResult(data.data)
    } catch (error) {
      setResult('Failed to connect to backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 style={{fontSize: '24px', marginBottom: '20px'}}>Search Criminal Records</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Criminal Name</label>
          <input
            type="text"
            value={criminalName}
            onChange={(e) => setCriminalName(e.target.value)}
            required
            placeholder="Enter criminal name to search"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {result && (
        <div style={{marginTop: '30px'}}>
          <h3 style={{marginBottom: '15px'}}>Search Result:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  )
}
