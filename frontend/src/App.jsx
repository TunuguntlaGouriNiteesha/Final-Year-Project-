import { useState, useEffect } from 'react'
import axios from 'axios'
import { Shield } from 'lucide-react'
import LandingPage from './components/LandingPage_new'
import AnalysisApp from './components/AnalysisApp_new'

function App() {
  // Navigation state
  const [showLanding, setShowLanding] = useState(true)
  
  // States for text analysis
  const [mode, setMode] = useState('text')
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // States for news verification
  const [newsTopic, setNewsTopic] = useState('')
  const [newsResult, setNewsResult] = useState(null)
  const [randomTopics, setRandomTopics] = useState([])
  const [verifyingNews, setVerifyingNews] = useState(false)

  // API base URL
  const API_BASE = 'http://localhost:8000'

  // Text analysis function
  const handleTextAnalysis = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('Making API call to:', `${API_BASE}/predict/text`)
      const response = await axios.post(`${API_BASE}/predict/text`, {
        text: text.trim()
      })
      
      console.log('API response:', response.data)
      setResult(response.data)
    } catch (err) {
      console.error('API Error:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to analyze text. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Social media analysis function
  const handleSocialAnalysis = async () => {
    if (!text.trim()) {
      setError('Please enter social media content to analyze')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      console.log('Making social API call to:', `${API_BASE}/predict/social`)
      const response = await axios.post(`${API_BASE}/predict/social`, {
        content: text.trim()
      })
      
      console.log('Social API response:', response.data)
      setResult(response.data)
    } catch (err) {
      console.error('Social API Error:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to analyze social media content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Get random topics
  const getRandomTopics = async () => {
    try {
      const response = await axios.get(`${API_BASE}/news/random-topics`)
      setRandomTopics(response.data.topics || [])
    } catch (err) {
      setError('Failed to get random topics')
    }
  }

  // News verification function
  const handleNewsVerification = async () => {
    if (!newsTopic.trim()) {
      setError('Please enter a news topic to verify')
      return
    }

    setVerifyingNews(true)
    setError('')
    setNewsResult(null)

    try {
      console.log('Making news verification API call to:', `${API_BASE}/news/verify`)
      const response = await axios.post(`${API_BASE}/news/verify`, {
        topic: newsTopic.trim(),
        max_articles: 5
      })
      
      console.log('News verification API response:', response.data)
      setNewsResult(response.data)
    } catch (err) {
      console.error('News verification API Error:', err)
      setError(err.response?.data?.detail || err.message || 'Failed to verify news. Please try again.')
    } finally {
      setVerifyingNews(false)
    }
  }

  // Reset function when switching modes
  const handleModeChange = (newMode) => {
    setMode(newMode)
    setResult(null)
    setNewsResult(null)
    setError('')
    setText('')
    setNewsTopic('')
  }

  // Navigation handlers
  const handleGetStarted = () => {
    setShowLanding(false)
  }

  const handleBackToLanding = () => {
    setShowLanding(true)
    // Reset all states
    setResult(null)
    setNewsResult(null)
    setError('')
    setText('')
    setNewsTopic('')
    setRandomTopics([])
  }

  return (
    <div className="App">
      {showLanding ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <div>
          {/* Navigation Bar */}
          <nav className="navbar">
            <div className="navbar-content">
              <button
                onClick={handleBackToLanding}
                className="logo"
                style={{ textDecoration: 'none' }}
              >
                <div className="logo-icon">
                  <Shield size={24} />
                </div>
                <span>FakeGuard</span>
              </button>
              <div style={{ color: '#4a5568', fontSize: '14px' }}>
                Advanced Fake News Detection
              </div>
            </div>
          </nav>

          {/* Main App Content */}
          <div className="pt-16">
            <AnalysisApp
              mode={mode}
              setMode={handleModeChange}
              text={text}
              setText={setText}
              result={result}
              setResult={setResult}
              loading={loading}
              error={error}
              setError={setError}
              newsTopic={newsTopic}
              setNewsTopic={setNewsTopic}
              newsResult={newsResult}
              setNewsResult={setNewsResult}
              randomTopics={randomTopics}
              setRandomTopics={setRandomTopics}
              verifyingNews={verifyingNews}
              setVerifyingNews={setVerifyingNews}
              handleTextAnalysis={handleTextAnalysis}
              handleSocialAnalysis={handleSocialAnalysis}
              handleNewsVerification={handleNewsVerification}
              getRandomTopics={getRandomTopics}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
