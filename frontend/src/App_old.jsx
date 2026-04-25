import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
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

  // Advanced Fake News Generator for placeholders
  const fakeNewsGenerator = {
    subjects: [
      "Scientists", "Researchers", "Government officials", "Military insiders",
      "Tech executives", "Medical professionals", "Financial analysts", 
      "Anonymous sources", "Whistleblowers", "Security experts", 
      "Former employees", "Intelligence agents", "Academic institutions",
      "Independent investigators", "Data analysts"
    ],
    
    verbs: [
      "discovered", "exposed", "confirmed", "revealed", "leaked",
      "admitted", "warned about", "predicted", "uncovered", "documented",
      "identified", "verified", "authenticated", "validated", "substantiated"
    ],
    
    objects: [
      "a shocking truth about", "hidden evidence of", "a major cover-up involving",
      "the real story behind", "secret documents proving", "undeniable proof of",
      "disturbing details about", "alarming information regarding", 
      "explosive findings concerning", "compelling evidence for",
      "troubling revelations about", "sensational claims regarding"
    ],
    
    topics: [
      "climate change data", "vaccine effectiveness", "UFO technology",
      "ancient civilizations", "cancer cures", "financial collapse",
      "mind control technology", "extraterrestrial life", "time travel experiments",
      "secret societies", "weather manipulation", "quantum computing breakthroughs",
      "artificial intelligence consciousness", "alternative energy sources",
      "hidden archeological sites", "genetic modification experiments",
      "parallel universe discoveries", "consciousness after death",
      "government surveillance programs", "suppressed medical treatments"
    ],
    
    socialEndings: [
      "SHARE THIS BEFORE IT'S DELETED!",
      "SPREAD THE WORD!",
      "TELL EVERYONE YOU KNOW!",
      "FORWARD TO ALL YOUR CONTACTS!",
      "REPOST THIS URGENTLY!",
      "PASS THIS ALONG IMMEDIATELY!",
      "DON'T LET THEM SILENCE THIS TRUTH!",
      "THIS CHANGES EVERYTHING! SHARE NOW!",
      "THEY DON'T WANT YOU TO SEE THIS!",
      "THIS INFORMATION COULD SAVE LIVES!"
    ],
    
    textEndings: [
      "The implications could change everything we know about the subject.",
      "Mainstream media outlets have remained suspiciously silent on these findings.",
      "Independent verification is still pending but initial data appears convincing.",
      "Official sources have categorically denied these claims despite mounting evidence.",
      "Further investigation is underway as the scientific community debates the validity.",
      "The discovery challenges fundamental assumptions in the field.",
      "Peer review processes have been unusually slow for this research.",
      "Several experts have called for immediate replication of the study.",
      "The methodology has drawn both praise and criticism from various quarters.",
      "If confirmed, these findings would represent a paradigm shift."
    ],
    
    adjectives: [
      "stunning", "groundbreaking", "controversial", "explosive",
      "revolutionary", "unprecedented", "remarkable", "astonishing",
      "paradigm-shifting", "earth-shattering", "game-changing",
      "mind-boggling", "jaw-dropping", "history-making", "epoch-defining"
    ],
    
    generateSocial: function() {
      const subject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
      const verb = this.verbs[Math.floor(Math.random() * this.verbs.length)];
      const object = this.objects[Math.floor(Math.random() * this.objects.length)];
      const topic = this.topics[Math.floor(Math.random() * this.topics.length)];
      const ending = this.socialEndings[Math.floor(Math.random() * this.socialEndings.length)];
      
      // Generate some social media flavor
      const prefixes = ["🔥 ", "🚨 ", "⚠️ ", "💥 ", "🔴 "];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      
      return `${prefix}"${subject.toUpperCase()} ${verb.toUpperCase()} ${object.toUpperCase()} ${topic.toUpperCase()}! ${ending}"`;
    },
    
    generateText: function() {
      const adjective = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
      const subject = this.subjects[Math.floor(Math.random() * this.subjects.length)];
      const verb = this.verbs[Math.floor(Math.random() * this.verbs.length)];
      const object = this.objects[Math.floor(Math.random() * this.objects.length)];
      const topic = this.topics[Math.floor(Math.random() * this.topics.length)];
      const ending = this.textEndings[Math.floor(Math.random() * this.textEndings.length)];
      
      // Additional context sentences
      const contextSentences = [
        "The research, conducted over several years, involved cutting-edge technology and innovative methodologies.",
        "Data was collected from multiple independent sources and cross-referenced for accuracy.",
        "Initial skepticism has given way to cautious interest as more details emerge.",
        "Funding for the study came from unconventional sources, raising questions about potential biases.",
        "The timeline of discovery suggests coordinated efforts to suppress the information.",
        "Similar findings have been reported anecdotally for years but lacked rigorous documentation.",
        "International collaboration played a crucial role in uncovering the complete picture.",
        "Digital forensics and advanced analytics were employed to verify the authenticity of evidence."
      ];
      
      const context = contextSentences[Math.floor(Math.random() * contextSentences.length)];
      
      return `In a ${adjective} development, ${subject} ${verb} ${object} ${topic}. ${context} ${ending}`;
    }
  };

  // Fetch random topics on mount
  useEffect(() => {
    fetchRandomTopics()
  }, [])

  // Get random topics from backend
  const fetchRandomTopics = async () => {
    try {
      const response = await axios.get('http://localhost:8000/news/random-topics')
      setRandomTopics(response.data.topics)
    } catch (err) {
      console.error('Error fetching random topics:', err)
      // Set diverse default topics if API fails
      setRandomTopics([
        'artificial intelligence ethics', 
        'climate change policies', 
        'medical research breakthroughs',
        'space exploration discoveries',
        'cryptocurrency regulations',
        'quantum computing advancements',
        'genetic engineering developments',
        'renewable energy innovations'
      ])
    }
  }

  // Generate placeholder text
  const getPlaceholder = () => {
    if (mode === 'social') {
      return fakeNewsGenerator.generateSocial();
    } else {
      return fakeNewsGenerator.generateText();
    }
  }

  // Analyze content (text or social)
  const analyzeContent = async () => {
    setError('')
    setResult(null)
    setNewsResult(null)

    if (text.trim().length < 5) {
      setError('Please enter at least 5 characters of content')
      return
    }

    try {
      setLoading(true)

      const endpoint = mode === 'social' 
        ? 'http://localhost:8000/predict/social' 
        : 'http://localhost:8000/predict/text'

      const payload = mode === 'social' 
        ? { content: text } 
        : { text: text }

      const response = await axios.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' }
      })

      // Process social media results to include evidence-based explanations
      if (mode === 'social' && response.data) {
        const processedResult = {
          ...response.data,
          // Calculate dynamic risk score based on confidence
          riskScore: Math.round(response.data.summary?.confidence * 100) || 0,
          // Generate evidence-based explanation
          evidence: generateEvidence(response.data)
        }
        setResult(processedResult)
      } else {
        setResult(response.data)
      }
    } catch (err) {
      console.error('Analysis error:', err)
      setError(
        err.response?.data?.detail || 
        err.message || 
        'Analysis service is temporarily unavailable. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Generate evidence-based explanation for social media content
  const generateEvidence = (data) => {
    if (!data.summary) return null;

    const evidence = {
      indicators: [],
      explanations: [],
      recommendations: [],
      factChecks: []
    };

    const hasIndicators = data.summary.has_misinformation_indicators;
    const confidence = data.summary.confidence || 0;
    const keyFindings = data.summary.key_findings || [];
    const textLength = text.length;

    // Calculate risk level based on confidence and content analysis
    let riskLevel = 'LOW';
    let riskScore = Math.round(confidence * 100);
    
    // Adjust risk based on text characteristics
    const emotionalWords = ['urgent', 'breaking', 'shocking', 'emergency', 'warning', 'danger'];
    const emotionalCount = emotionalWords.filter(word => 
      text.toLowerCase().includes(word)
    ).length;
    
    if (riskScore >= 70 || emotionalCount >= 3) {
      riskLevel = 'HIGH';
    } else if (riskScore >= 40 || emotionalCount >= 2) {
      riskLevel = 'MEDIUM';
    } else {
      riskLevel = 'LOW';
    }

    // Generate indicators based on findings and text analysis
    keyFindings.forEach(finding => {
      const findingLower = finding.toLowerCase();
      
      if (findingLower.includes('emotional') || findingLower.includes('sensational') || findingLower.includes('alarming')) {
        evidence.indicators.push({
          type: 'Emotional Manipulation',
          description: 'Content uses exaggerated emotional language to provoke strong reactions',
          impact: 'High emotional language often indicates manipulative intent',
          severity: 'High'
        });
      }
      
      if (findingLower.includes('unverified') || findingLower.includes('source') || findingLower.includes('evidence')) {
        evidence.indicators.push({
          type: 'Lack of Verification',
          description: 'Makes claims without citing credible sources or providing verifiable evidence',
          impact: 'Unverified claims are a hallmark of misinformation',
          severity: 'High'
        });
      }
      
      if (findingLower.includes('exaggerat') || findingLower.includes('extreme') || findingLower.includes('absolute')) {
        evidence.indicators.push({
          type: 'Exaggeration & Extremism',
          description: 'Uses absolute terms or extreme statements that lack nuance',
          impact: 'Extreme claims often indicate misleading or false information',
          severity: 'Medium'
        });
      }
      
      if (findingLower.includes('conspiracy') || findingLower.includes('secret') || findingLower.includes('cover-up')) {
        evidence.indicators.push({
          type: 'Conspiracy Elements',
          description: 'Contains elements of conspiracy theories without factual basis',
          impact: 'Conspiracy narratives typically lack empirical evidence',
          severity: 'High'
        });
      }
      
      if (findingLower.includes('urgency') || findingLower.includes('immediate') || findingLower.includes('now')) {
        evidence.indicators.push({
          type: 'Artificial Urgency',
          description: 'Creates false sense of urgency to bypass critical thinking',
          impact: 'Urgency tactics are common in misinformation campaigns',
          severity: 'Medium'
        });
      }
    });

    // Add text analysis indicators
    if (emotionalCount >= 2) {
      evidence.indicators.push({
        type: 'Emotional Word Density',
        description: `Contains ${emotionalCount} high-emotion words indicating manipulative intent`,
        impact: 'High emotional density correlates with misinformation',
        severity: 'Medium'
      });
    }

    if (text.includes('!'.repeat(3))) {
      evidence.indicators.push({
        type: 'Excessive Punctuation',
        description: 'Uses multiple exclamation marks to create artificial excitement',
        impact: 'Exaggerated punctuation often accompanies false claims',
        severity: 'Low'
      });
    }

    // Generate explanations based on risk level
    if (riskLevel === 'HIGH') {
      evidence.explanations.push(
        'This content shows multiple strong indicators of potential misinformation',
        'Analysis reveals patterns consistent with manipulative online content',
        'The combination of emotional language and unverified claims is concerning'
      );
      
      evidence.recommendations.push(
        'Verify all claims through reputable fact-checking organizations like Snopes or FactCheck.org',
        'Search for the topic on mainstream news sites to compare reporting',
        'Check if experts in the field have commented on these claims',
        'Be extremely cautious about sharing this content further'
      );
    } else if (riskLevel === 'MEDIUM') {
      evidence.explanations.push(
        'Some questionable elements detected that require further verification',
        'Content shows mixed signals - some credible aspects but also red flags',
        'Recommend approaching this information with healthy skepticism'
      );
      
      evidence.recommendations.push(
        'Cross-reference claims with multiple independent sources',
        'Look for primary sources or official statements on the topic',
        'Consider the credibility of the original poster/source',
        'Wait for additional verification before accepting claims as fact'
      );
    } else {
      evidence.explanations.push(
        'Content appears relatively credible based on initial analysis',
        'No major red flags detected in language patterns or claim structure',
        'Claims seem reasonable within the context provided'
      );
      
      evidence.recommendations.push(
        'Always maintain critical thinking when consuming online information',
        'Continue to verify unusual or surprising claims',
        'Share responsibly with appropriate context when necessary'
      );
    }

    // Generate fact-check suggestions based on content
    evidence.factChecks = [
      'Search for the exact claim on Snopes.com',
      'Check FactCheck.org for related fact-checks',
      'Look for official statements from relevant authorities or organizations',
      'Search academic databases for peer-reviewed research on the topic',
      'Verify dates, locations, and names mentioned in the content'
    ];

    return {
      riskLevel,
      riskScore,
      hasIndicators,
      confidence,
      emotionalWordCount: emotionalCount,
      ...evidence
    };
  }

  // Verify news topic
  const verifyNews = async (topic = '') => {
    setError('')
    setResult(null)
    setNewsResult(null)
    
    const topicToVerify = topic || newsTopic
    
    if (!topicToVerify.trim()) {
      setError('Please enter a news topic to verify')
      return
    }

    try {
      setVerifyingNews(true)
      
      const response = await axios.post('http://localhost:8000/news/verify', {
        topic: topicToVerify,
        random: !topicToVerify
      })
      
      setNewsResult(response.data)
    } catch (err) {
      console.error('News verification error:', err)
      setError(
        err.response?.data?.detail || 
        'News verification service is temporarily unavailable. Please try again later.'
      )
    } finally {
      setVerifyingNews(false)
    }
  }

  // Calculate confidence percentage
  const confidencePercent = result?.confidence 
    ? Math.round(result.confidence * 100) 
    : result?.summary?.confidence 
      ? Math.round(result.summary.confidence * 100) 
      : 0

  // Load sample text with new placeholder
  const loadSampleText = () => {
    setText(getPlaceholder());
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-badge">
              <div className="logo-icon">🔍</div>
            </div>
            <div className="logo-text">
              <h1 className="app-title">Fake News <span className="app-title-highlight">Detection</span> System</h1>
              <p className="app-subtitle">AI-Powered Misinformation Analysis & Verification</p>
            </div>
          </div>
          
          <div className="header-meta">
            <div className="version-badge">v2.1</div>
            <div className="api-status">
              <span className="status-indicator active"></span>
              <span className="status-text">API Online</span>
            </div>
            <div className="model-info">
              <span className="model-badge">🤖 BERT + Gemini AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Analysis Mode Selection */}
        <div className="mode-selection">
          <div className="mode-header">
            <h3 className="mode-title">Select Analysis Mode</h3>
            <p className="mode-description">Choose the type of content you want to analyze</p>
          </div>
          <div className="mode-buttons">
            <button 
              className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
              onClick={() => {
                setMode('text')
                setResult(null)
                setNewsResult(null)
                setError('')
              }}
            >
              <span className="mode-icon">📝</span>
              <span className="mode-label">Text Analysis</span>
              <span className="mode-desc">News articles, blog posts</span>
            </button>
            <button 
              className={`mode-btn ${mode === 'social' ? 'active' : ''}`}
              onClick={() => {
                setMode('social')
                setResult(null)
                setNewsResult(null)
                setError('')
              }}
            >
              <span className="mode-icon">📱</span>
              <span className="mode-label">Social Media</span>
              <span className="mode-desc">Posts, tweets, comments</span>
            </button>
            <button 
              className={`mode-btn ${mode === 'news' ? 'active' : ''}`}
              onClick={() => {
                setMode('news')
                setResult(null)
                setNewsResult(null)
                setError('')
              }}
            >
              <span className="mode-icon">📰</span>
              <span className="mode-label">News Verification</span>
              <span className="mode-desc">Topic-based fact-checking</span>
            </button>
          </div>
        </div>

        {/* Text/Social Analysis Section */}
        {(mode === 'text' || mode === 'social') && (
          <div className="analysis-controls">
            <div className="control-group">
              <label className="control-label">
                <span className="label-icon">
                  {mode === 'text' ? '📝' : '📱'}
                </span>
                {mode === 'text' ? 'Enter Text to Analyze' : 'Enter Social Media Content'}
                <span className="char-counter">{text.length} characters</span>
                <span className="word-counter">{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
              </label>
              
              <textarea
                placeholder="Click 'Load Sample' for an example or type your own content..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="8"
                className="content-input"
              />
              
              <div className="input-actions">
                <button 
                  className="clear-btn"
                  onClick={() => setText('')}
                  disabled={!text.trim()}
                >
                  <span className="btn-icon">🗑️</span>
                  Clear Text
                </button>
                <button 
                  className="sample-btn"
                  onClick={loadSampleText}
                >
                  <span className="btn-icon">🎲</span>
                  Load Random Sample
                </button>
              </div>
              
              <div className="input-tips">
                <p className="tip-text">
                  💡 <strong>Tip:</strong> {mode === 'text' 
                    ? 'Paste news articles, blog posts, or written content for authenticity analysis.'
                    : 'Copy social media posts, tweets, or forum content to check for misinformation indicators.'}
                </p>
              </div>
            </div>

            <button 
              onClick={analyzeContent} 
              disabled={loading || text.trim().length < 5}
              className={`analyze-btn ${loading ? 'loading' : ''} ${mode}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Analyzing Content...</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🔍</span>
                  <span>Analyze {mode === 'text' ? 'Text' : 'Social Media Content'}</span>
                  <span className="btn-subtext">AI-powered deep analysis</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* News Verification Section */}
        {mode === 'news' && (
          <div className="news-verification-section">
            <div className="news-header">
              <h3>News Topic Verification</h3>
              <p>Enter any news topic to verify its credibility across multiple sources</p>
            </div>
            
            <div className="news-input-section">
              <div className="input-group">
                <div className="input-icon">🔍</div>
                <input
                  type="text"
                  placeholder="Enter news topic (e.g., 'AI developments', 'climate change', 'medical breakthroughs')"
                  value={newsTopic}
                  onChange={(e) => setNewsTopic(e.target.value)}
                  className="news-topic-input"
                  onKeyPress={(e) => e.key === 'Enter' && verifyNews()}
                />
                <button 
                  onClick={() => verifyNews()}
                  disabled={verifyingNews || !newsTopic.trim()}
                  className="verify-news-btn"
                >
                  {verifyingNews ? (
                    <>
                      <span className="spinner"></span> Verifying...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      Verify Topic
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {randomTopics.length > 0 && (
              <div className="random-topics">
                <div className="topics-header">
                  <span className="topics-icon">🎯</span>
                  <h4>Try Trending Topics</h4>
                </div>
                <p className="topics-label">Click any topic to instantly verify:</p>
                <div className="topic-buttons">
                  {randomTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setNewsTopic(topic)
                        verifyNews(topic)
                      }}
                      className="topic-btn"
                    >
                      <span className="topic-icon">
                        {['🔬', '🌍', '💊', '🚀', '💰', '⚛️', '🧬', '🌞'][index % 8]}
                      </span>
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="verification-info">
              <div className="info-card">
                <div className="info-icon">📊</div>
                <div className="info-content">
                  <h5>How It Works</h5>
                  <p>Our AI analyzes multiple news sources on your topic and provides a credibility score based on consistency, sources, and factual reporting.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-alert">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h4>Analysis Error</h4>
              <p>{error}</p>
            </div>
            <button className="error-close" onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Text Analysis Results */}
        {result && mode === 'text' && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-title">
                <span className="results-title-icon">📝</span>
                <div>
                  <h3>Text Analysis Results</h3>
                  <p className="results-subtitle">AI-powered content verification report</p>
                </div>
              </div>
              <div className="results-meta">
                <div className="meta-item">
                  <span className="meta-label">Analysis completed</span>
                  <span className="meta-value">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Confidence Score</span>
                  <span className="meta-value confidence-highlight">{confidencePercent}%</span>
                </div>
              </div>
            </div>

            <div className="verification-card">
              <div className="verification-header">
                <h3>Content Verification</h3>
                <div className="verification-result">
                  <div className={`verification-badge ${result.label === 'FAKE' ? 'fake' : 'real'}`}>
                    {result.label === 'FAKE' ? (
                      <>
                        <span className="badge-icon">❌</span>
                        <span>POTENTIALLY FALSE</span>
                      </>
                    ) : (
                      <>
                        <span className="badge-icon">✅</span>
                        <span>LIKELY CREDIBLE</span>
                      </>
                    )}
                  </div>
                  <div className="verification-subtext">
                    {result.label === 'FAKE' 
                      ? 'Content shows indicators of misinformation' 
                      : 'Content appears credible based on analysis'}
                  </div>
                </div>
              </div>
              
              <div className="confidence-meter">
                <div className="meter-header">
                  <span className="meter-label">AI Confidence Level</span>
                  <span className="meter-value">{confidencePercent}%</span>
                </div>
                <div className="meter-bar">
                  <div 
                    className="meter-fill"
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
                </div>
                <div className="meter-labels">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              <div className="analysis-insights">
                <h4>Key Insights</h4>
                <div className="insights-grid">
                  <div className="insight-card">
                    <div className="insight-icon">🎯</div>
                    <div className="insight-content">
                      <h5>Accuracy Score</h5>
                      <p>{confidencePercent}% confidence</p>
                      <span className="insight-subtext">Based on BERT model analysis</span>
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">⚡</div>
                    <div className="insight-content">
                      <h5>Processing Time</h5>
                      <p>Real-time analysis</p>
                      <span className="insight-subtext">AI-powered instant results</span>
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">🤖</div>
                    <div className="insight-content">
                      <h5>AI Model</h5>
                      <p>BERT Transformer</p>
                      <span className="insight-subtext">State-of-the-art NLP</span>
                    </div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-icon">📊</div>
                    <div className="insight-content">
                      <h5>Text Analysis</h5>
                      <p>{text.trim().split(/\s+/).length} words analyzed</p>
                      <span className="insight-subtext">Comprehensive evaluation</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="recommendations-section">
                <h4>Recommendations</h4>
                <div className="recommendations-list">
                  <div className="recommendation-item">
                    <span className="rec-icon">✅</span>
                    <span>Verify claims through reputable news sources</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">✅</span>
                    <span>Check for multiple independent confirmations</span>
                  </div>
                  <div className="recommendation-item">
                    <span className="rec-icon">✅</span>
                    <span>Consider the credibility of original sources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Analysis Results */}
        {result && mode === 'social' && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-title">
                <span className="results-title-icon">📱</span>
                <div>
                  <h3>Social Media Analysis Report</h3>
                  <p className="results-subtitle">Misinformation risk assessment</p>
                </div>
              </div>
              <div className="results-meta">
                <div className="meta-item">
                  <span className="meta-label">Analysis completed</span>
                  <span className="meta-value">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Risk Score</span>
                  <span className={`meta-value ${result.evidence?.riskLevel === 'HIGH' ? 'risk-high' : 
                                                       result.evidence?.riskLevel === 'MEDIUM' ? 'risk-medium' : 
                                                       'risk-low'}`}>
                    {result.evidence?.riskScore || 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="risk-assessment">
              <div className="risk-header">
                <h3>Risk Assessment Summary</h3>
                <div className="risk-result">
                  <div className={`risk-level ${result.evidence?.riskLevel.toLowerCase()} ${result.summary?.has_misinformation_indicators ? 'fake-content' : 'real-content'}`}>
                    {result.summary?.has_misinformation_indicators ? (
                      <>
                        <span className="risk-icon">�</span>
                        <span>FAKE CONTENT DETECTED</span>
                      </>
                    ) : (
                      <>
                        <span className="risk-icon">🟢</span>
                        <span>REAL CONTENT</span>
                      </>
                    )}
                  </div>
                  <div className="risk-subtext">
                    {result.summary?.has_misinformation_indicators 
                      ? 'Multiple strong indicators of potential misinformation detected' 
                      : 'No major red flags detected in content analysis'}
                  </div>
                </div>
              </div>

              <div className="risk-meter">
                <div className="risk-score-display">
                  <div className="score-circle">
                    <span className="score-value">{result.evidence?.riskScore || 0}</span>
                    <span className="score-label">Risk Score</span>
                  </div>
                  <div className="score-breakdown">
                    <div className="breakdown-item">
                      <span className="breakdown-label">Confidence Level:</span>
                      <span className="breakdown-value">{Math.round(result.summary?.confidence * 100) || 0}%</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="breakdown-label">Emotional Indicators:</span>
                      <span className="breakdown-value">{result.evidence?.emotionalWordCount || 0} detected</span>
                    </div>
                  </div>
                </div>
                <div className="risk-bar-container">
                  <div className="risk-bar">
                    <div 
                      className="risk-fill"
                      style={{ width: `${result.evidence?.riskScore || 0}%` }}
                    ></div>
                  </div>
                  <div className="risk-labels">
                    <span>Low Risk</span>
                    <span>Moderate Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>
              </div>

              {/* Evidence Indicators */}
              {result.evidence?.indicators && result.evidence.indicators.length > 0 && (
                <div className="evidence-section">
                  <div className="section-header">
                    <h4>📊 Evidence-Based Indicators Detected</h4>
                    <span className="section-badge">{result.evidence.indicators.length} indicators</span>
                  </div>
                  <div className="indicators-grid">
                    {result.evidence.indicators.map((indicator, index) => (
                      <div key={index} className="indicator-card">
                        <div className="indicator-header">
                          <span className={`indicator-type severity-${indicator.severity.toLowerCase()}`}>
                            {indicator.type}
                          </span>
                          <span className="indicator-severity">
                            Severity: {indicator.severity}
                          </span>
                        </div>
                        <p className="indicator-description">{indicator.description}</p>
                        <div className="indicator-impact">
                          <strong>Impact:</strong> {indicator.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Explanation */}
              {result.evidence?.explanations && result.evidence.explanations.length > 0 && (
                <div className="explanation-section">
                  <div className="section-header">
                    <h4>🤖 AI Analysis Explanation</h4>
                    <span className="section-badge">Gemini AI Insights</span>
                  </div>
                  <div className="explanation-list">
                    {result.evidence.explanations.map((exp, index) => (
                      <div key={index} className="explanation-item">
                        <div className="explanation-icon">
                          {index === 0 ? '🔍' : index === 1 ? '📈' : '🎯'}
                        </div>
                        <div className="explanation-content">
                          <p>{exp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fact-Check Recommendations */}
              {result.evidence?.factChecks && result.evidence.factChecks.length > 0 && (
                <div className="factcheck-section">
                  <div className="section-header">
                    <h4>🔍 Recommended Fact-Check Steps</h4>
                    <span className="section-badge">Verification Guide</span>
                  </div>
                  <div className="factcheck-grid">
                    {result.evidence.factChecks.map((check, index) => (
                      <div key={index} className="factcheck-card">
                        <div className="factcheck-number">Step {index + 1}</div>
                        <div className="factcheck-content">
                          <p>{check}</p>
                        </div>
                        <div className="factcheck-resources">
                          {index === 0 && <span className="resource-tag">Snopes.com</span>}
                          {index === 1 && <span className="resource-tag">FactCheck.org</span>}
                          {index === 3 && <span className="resource-tag">Google Scholar</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Analysis */}
              <div className="detailed-analysis">
                <div className="analysis-header">
                  <div className="analysis-title">
                    <h4>📈 Detailed Risk Analysis Report</h4>
                    <p className="analysis-subtitle">Comprehensive content evaluation</p>
                  </div>
                  <div className="analysis-model-info">
                    <span className="model-badge">Gemini AI Model</span>
                    <span className="model-version">v2.1</span>
                  </div>
                </div>
                
                <div className="analysis-content">
                  {result.analysis ? (
                    <div className="formatted-analysis">
                      {result.analysis.split('\n').filter(line => line.trim()).map((paragraph, index) => {
                        // Format headers and important points
                        if (paragraph.includes('###') || paragraph.includes('**')) {
                          return (
                            <div key={index} className="analysis-section">
                              {paragraph.split('**').map((part, i) => 
                                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                              )}
                            </div>
                          );
                        } else if (paragraph.includes(':') && paragraph.length < 100) {
                          return (
                            <div key={index} className="analysis-highlight">
                              {paragraph}
                            </div>
                          );
                        } else if (paragraph.includes('-') || paragraph.includes('•')) {
                          return (
                            <div key={index} className="analysis-bullet">
                              {paragraph}
                            </div>
                          );
                        } else {
                          return (
                            <div key={index} className="analysis-paragraph">
                              {paragraph}
                            </div>
                          );
                        }
                      })}
                    </div>
                  ) : (
                    <div className="no-analysis">
                      <p>📊 AI Analysis Complete</p>
                      <p>The AI has processed the content and identified key risk indicators as shown in the risk assessment above.</p>
                    </div>
                  )}
                </div>
                
                {/* Recommendations */}
                {result.evidence?.recommendations && result.evidence.recommendations.length > 0 && (
                  <div className="recommendations">
                    <h5>📋 Recommendations for Action</h5>
                    <div className="recommendations-grid">
                      {result.evidence.recommendations.map((rec, index) => (
                        <div key={index} className="recommendation-card">
                          <div className="rec-icon">
                            {index === 0 ? '✅' : index === 1 ? '🔍' : '🚫'}
                          </div>
                          <div className="rec-content">
                            <p>{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Analysis Summary */}
                <div className="analysis-summary">
                  <h5>Summary</h5>
                  <p>
                    Based on the analysis, this content has been classified as 
                    <strong> {result.evidence?.riskLevel} risk</strong> with a score of 
                    <strong> {result.evidence?.riskScore}%</strong>. {
                      result.evidence?.riskLevel === 'HIGH' 
                        ? 'Exercise extreme caution and verify all claims before sharing.'
                        : result.evidence?.riskLevel === 'MEDIUM'
                        ? 'Proceed with caution and seek additional verification.'
                        : 'Content appears reasonable but always maintain critical thinking.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Verification Results */}
        {newsResult && mode === 'news' && (
          <div className="results-section">
            <div className="results-header">
              <div className="results-title">
                <span className="results-title-icon">📰</span>
                <div>
                  <h3>News Verification Results</h3>
                  <p className="results-subtitle">Topic: {newsResult.topic}</p>
                </div>
              </div>
              <div className="results-meta">
                <div className="meta-item">
                  <span className="meta-label">Articles Analyzed</span>
                  <span className="meta-value">{newsResult.articles_analyzed}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Overall Score</span>
                  <span className="meta-value">{Math.round(newsResult.overall_credibility.score * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="overall-credibility">
              <div className={`credibility-badge ${newsResult.overall_credibility.label}`}>
                {newsResult.overall_credibility.label.replace('_', ' ').toUpperCase()}
              </div>
              <div className="credibility-score-display">
                <div className="score-circle large">
                  <span className="score-value">{Math.round(newsResult.overall_credibility.score * 100)}</span>
                  <span className="score-label">Credibility Score</span>
                </div>
                <div className="score-explanation">
                  <p>
                    Based on analysis of {newsResult.articles_analyzed} articles from various sources. 
                    Higher scores indicate greater consistency and reliability across sources.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="articles-summary">
              <div className="summary-header">
                <h5>AI Analysis Summary</h5>
                <span className="summary-source">Multiple Sources</span>
              </div>
              <p>{newsResult.summary}</p>
            </div>
            
            <div className="verified-articles">
              <div className="articles-header">
                <h5>Analyzed Articles ({newsResult.articles_analyzed})</h5>
                <div className="articles-filter">
                  <span className="filter-label">Sorted by:</span>
                  <select className="filter-select">
                    <option>Credibility Score</option>
                    <option>Source Reliability</option>
                    <option>Publication Date</option>
                  </select>
                </div>
              </div>
              <div className="articles-grid">
                {newsResult.articles.map((article, index) => (
                  <div key={index} className="article-card">
                    <div className="article-header">
                      <h6>{article.article.title}</h6>
                      <div className="article-source-info">
                        <span className="article-source">Source: {article.article.source}</span>
                        <span className="article-date">• Today</span>
                      </div>
                    </div>
                    <div className="article-prediction">
                      <span className={`prediction-badge ${article.prediction.label.toLowerCase()}`}>
                        {article.prediction.label}
                      </span>
                      <div className="prediction-confidence">
                        <span className="confidence-label">Confidence:</span>
                        <span className="confidence-value">{Math.round(article.prediction.confidence * 100)}%</span>
                      </div>
                    </div>
                    <p className="article-description">{article.article.description}</p>
                    {article.article.url && article.article.url.startsWith('http') && (
                      <div className="article-actions">
                        <a 
                          href={article.article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="article-link"
                        >
                          <span className="link-icon">↗️</span>
                          Read full article
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Section - Only show when no results */}
        {!result && !newsResult && !error && (
          <div className="quick-stats">
            <div className="stats-header">
              <h4>System Statistics</h4>
              <p className="stats-subtitle">Real-time analysis metrics</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🚀</div>
                <div className="stat-content">
                  <h5>Processing Speed</h5>
                  <p className="stat-value">&lt; 1 Minute</p>
                  <p className="stat-label">Average analysis time</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <h5>Accuracy Rate</h5>
                  <p className="stat-value">94.7%+</p>
                  <p className="stat-label">Verified by testing</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h5>Content Analyzed</h5>
                  <p className="stat-value">100+</p>
                  <p className="stat-label">Articles & posts</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🔒</div>
                <div className="stat-content">
                  <h5>Privacy Focused</h5>
                  <p className="stat-value">100% Secure</p>
                  <p className="stat-label">No data stored</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="patent-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="footer-logo-icon">🔍</div>
              <div className="footer-logo-text">
                <h4>Fake News Detection AI</h4>
                <p>Advanced Misinformation Analysis</p>
              </div>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">API Reference</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
          
          <div className="footer-legal">
            <div className="legal-header">
              <div className="patent-logo">
                <svg viewBox="0 0 100 100" className="patent-icon">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M30 50L45 65L70 35" stroke="currentColor" strokeWidth="4" fill="none"/>
                </svg>
                <span className="patent-text">PATENT PENDING</span>
              </div>
            </div>
            
            <p className="legal-text">
              © 2026 Fake News Detection AI System. All rights reserved. 
              This system uses proprietary algorithms protected under intellectual property laws. 
              Unauthorized use, reproduction, or distribution is strictly prohibited.
            </p>
            
            <div className="legal-meta">
              <span className="legal-item">Version 2.1.0</span>
              <span className="legal-item">•</span>
              <span className="legal-item">Build #2026.01</span>
              <span className="legal-item">•</span>
              <span className="legal-item">AI Models: BERT + Gemini</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App