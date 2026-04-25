import React from 'react';
import { 
  FileText, 
  Users, 
  Newspaper, 
  Search, 
  Shuffle,
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Shield,
  ExternalLink,
  Activity,
  AlertTriangle,
  Info,
  Clock,
  Zap,
  Brain,
  SearchCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';

const AnalysisApp = ({ mode, setMode, text, setText, result, setResult, loading, error, setError,
                      newsTopic, setNewsTopic, newsResult, setNewsResult, randomTopics, setRandomTopics,
                      verifyingNews, setVerifyingNews, 
                      handleTextAnalysis, handleSocialAnalysis, handleNewsVerification, getRandomTopics }) => {
  
  // Helper function to get classification color and icon
  const getClassificationStyle = (label) => {
    switch (label) {
      case 'REAL':
        return { 
          colorClass: 'result-success', 
          icon: <CheckCircle size={24} />,
          title: 'Real News',
          description: 'Content appears authentic'
        };
      case 'FAKE':
        return { 
          colorClass: 'result-error', 
          icon: <XCircle size={24} />,
          title: 'Fake News',
          description: 'Misinformation detected'
        };
      case 'MISLEADING':
        return { 
          colorClass: 'result-warning', 
          icon: <AlertTriangle size={24} />,
          title: 'Misleading Content',
          description: 'Partially true or misleading'
        };
      case 'UNVERIFIED':
        return { 
          colorClass: 'result-info', 
          icon: <HelpCircle size={24} />,
          title: 'Unverified Claim',
          description: 'Cannot verify authenticity'
        };
      default:
        return { 
          colorClass: 'result-error', 
          icon: <XCircle size={24} />,
          title: 'Analysis Error',
          description: 'Something went wrong'
        };
    }
  };

  // Loading Analysis Steps Component
  const LoadingAnalysis = () => (
    <div className="loading-container">
      <div className="loading-header">
        <div className="spinner-large"></div>
        <h3>Analyzing Content...</h3>
      </div>
      <div className="loading-steps">
        <div className="loading-step active">
          <Brain size={20} />
          <span>Content Understanding</span>
        </div>
        <div className="loading-step">
          <SearchCheck size={20} />
          <span>Context Evaluation</span>
        </div>
        <div className="loading-step">
          <Activity size={20} />
          <span>Logical Consistency Check</span>
        </div>
        <div className="loading-step">
          <Shield size={20} />
          <span>Source Reliability Assessment</span>
        </div>
        <div className="loading-step">
          <Zap size={20} />
          <span>Knowledge Cross-Reference</span>
        </div>
        <div className="loading-step">
          <BarChart3 size={20} />
          <span>Final Classification</span>
        </div>
      </div>
    </div>
  );

  // Enhanced Result Display Component
  const EnhancedResultDisplay = ({ result }) => {
    if (!result) return null;
    
    const style = getClassificationStyle(result.label);
    const enhanced = result.enhanced_analysis;
    
    return (
      <div className="enhanced-result">
        {/* Main Classification Card */}
        <div className={`classification-card ${style.colorClass}`}>
          <div className="classification-header">
            <div className="classification-icon">{style.icon}</div>
            <div className="classification-info">
              <h2 className="classification-title">{style.title}</h2>
              <p className="classification-description">{style.description}</p>
            </div>
            <div className="confidence-badge">
              <span className="confidence-label">{result.confidence_level || 'Medium'}</span>
              <span className="confidence-score">{((result.confidence || 0) * 100).toFixed(1)}%</span>
            </div>
          </div>
          
          {/* Analysis Summary */}
          <div className="analysis-summary">
            <h4><Info size={18} /> Why This Classification?</h4>
            <p>{result.analysis || enhanced?.analysis || 'Analysis completed.'}</p>
          </div>
        </div>

        {/* Signals Detected */}
        {result.signals_detected && result.signals_detected.length > 0 && (
          <div className="signals-section">
            <h4><ShieldAlert size={18} /> Signals Detected</h4>
            <div className="signals-list">
              {result.signals_detected.map((signal, idx) => (
                <div key={idx} className="signal-item">
                  <AlertTriangle size={16} />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Signals (if available) */}
        {result.detailed_signals && result.detailed_signals.length > 0 && (
          <div className="detailed-signals-section">
            <h4><Search size={18} /> Detailed Signal Analysis</h4>
            {result.detailed_signals.map((signal, idx) => (
              <div key={idx} className={`detailed-signal severity-${signal.severity?.toLowerCase()}`}>
                <div className="signal-header">
                  <span className="signal-name">{signal.signal}</span>
                  <span className={`severity-badge ${signal.severity?.toLowerCase()}`}>{signal.severity}</span>
                </div>
                <p className="signal-description">{signal.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Verification Steps */}
        {result.verification_steps && result.verification_steps.length > 0 && (
          <div className="verification-steps-section">
            <h4><CheckCircle size={18} /> Verification Process</h4>
            <div className="steps-timeline">
              {result.verification_steps.map((step, idx) => (
                <div key={idx} className={`timeline-step ${step.passed ? 'passed' : 'failed'}`}>
                  <div className="step-number">{step.step}</div>
                  <div className="step-content">
                    <h5>{step.step_name}</h5>
                    <p>{step.findings}</p>
                  </div>
                  <div className="step-status">
                    {step.passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="recommendations-section">
            <h4><Shield size={18} /> Recommendations</h4>
            <ul className="recommendations-list">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="recommendation-item">
                  <CheckCircle size={16} />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Details */}
        <div className="technical-details">
          <h4><Clock size={18} /> Technical Details</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Processing Time:</span>
              <span className="detail-value">{result.processing_time || 0}ms</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Analysis Method:</span>
              <span className="detail-value">LLM + ML Hybrid</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Confidence Score:</span>
              <span className="detail-value">{((result.confidence || 0) * 100).toFixed(2)}%</span>
            </div>
            {result.ml_fallback && (
              <div className="detail-item">
                <span className="detail-label">Mode:</span>
                <span className="detail-value ml-mode">ML Fallback</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="main-app">
      <div className="container">
        {/* Header */}
        <div className="app-header">
          <h1 className="app-title">Fake News Detection System</h1>
          <p className="app-subtitle">Analyze content with advanced AI algorithms</p>
        </div>

        {/* Mode Selector */}
        <div className="mode-tabs">
          <div className="tab-container">
            <button
              onClick={() => setMode('text')}
              className={`tab-button ${mode === 'text' ? 'active' : ''}`}
            >
              <FileText size={20} />
              Text Analysis
            </button>
            <button
              onClick={() => setMode('social')}
              className={`tab-button ${mode === 'social' ? 'active' : ''}`}
            >
              <Users size={20} />
              Social Media
            </button>
            <button
              onClick={() => setMode('news')}
              className={`tab-button ${mode === 'news' ? 'active' : ''}`}
            >
              <Newspaper size={20} />
              News Verification
            </button>
          </div>
        </div>

        {/* Text Analysis Section */}
        {mode === 'text' && (
          <div className="analysis-grid">
            <div className="analysis-card">
              <div className="analysis-header">
                <div className="analysis-icon">
                  <FileText size={24} />
                </div>
                <h2 className="analysis-title">Text Analysis</h2>
              </div>
              <div className="form-group">
                <label className="form-label">Enter text to analyze</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="form-textarea"
                  placeholder="Paste the text you want to analyze for fake news detection..."
                />
              </div>
              <div className="form-buttons">
                <button
                  onClick={handleTextAnalysis}
                  disabled={!text.trim() || loading}
                  className="btn btn-primary btn-full"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Text'
                  )}
                </button>
              </div>
            </div>

            <div className="results-card">
              {loading ? (
                <LoadingAnalysis />
              ) : result ? (
                <EnhancedResultDisplay result={result} />
              ) : (
                <div className="results-placeholder">
                  <div className="results-placeholder-icon">
                    <FileText size={48} />
                  </div>
                  <p>Enter text and click analyze to see results</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media Analysis Section */}
        {mode === 'social' && (
          <div className="analysis-grid">
            <div className="analysis-card">
              <div className="analysis-header">
                <div className="analysis-icon">
                  <Users size={24} />
                </div>
                <h2 className="analysis-title">Social Media Analysis</h2>
              </div>
              <div className="form-group">
                <label className="form-label">Social Media Content</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="form-textarea"
                  placeholder="Paste social media post, tweet, or content to analyze..."
                />
              </div>
              <div className="form-buttons">
                <button
                  onClick={handleSocialAnalysis}
                  disabled={!text.trim() || loading}
                  className="btn btn-primary btn-full"
                >
                  {loading ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Social Media'
                  )}
                </button>
              </div>
            </div>

            <div className="results-card">
              {loading ? (
                <LoadingAnalysis />
              ) : result ? (
                <EnhancedResultDisplay result={result} />
              ) : (
                <div className="results-placeholder">
                  <div className="results-placeholder-icon">
                    <Users size={64} />
                  </div>
                  <h3>Social Media Analysis</h3>
                  <p>Enter social media content to verify its authenticity and detect misinformation</p>
                  <div className="placeholder-features">
                    <div className="feature-item">
                      <CheckCircle size={16} />
                      <span>Detect fake news and misinformation</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle size={16} />
                      <span>Analyze social media patterns</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle size={16} />
                      <span>Provide confidence scores</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* News Verification Section */}
        {mode === 'news' && (
          <div className="analysis-grid">
            <div className="analysis-card">
              <div className="analysis-header">
                <div className="analysis-icon">
                  <Newspaper size={24} />
                </div>
                <h2 className="analysis-title">News Verification</h2>
              </div>
              <div className="form-group">
                <label className="form-label">News Topic or Keyword</label>
                <input
                  type="text"
                  value={newsTopic}
                  onChange={(e) => setNewsTopic(e.target.value)}
                  className="form-input"
                  placeholder="Enter news topic to verify (e.g., climate change, AI technology)..."
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Analysis Options</label>
                <div className="analysis-options">
                  <div className="option-item">
                    <span className="option-label">Articles to Analyze:</span>
                    <span className="option-value">5 articles</span>
                  </div>
                  <div className="option-item">
                    <span className="option-label">Analysis Depth:</span>
                    <span className="option-value">Comprehensive</span>
                  </div>
                </div>
              </div>
              
              <div className="form-buttons">
                <button
                  onClick={handleNewsVerification}
                  disabled={!newsTopic.trim() || verifyingNews}
                  className="btn btn-primary btn-full"
                >
                  {verifyingNews ? (
                    <>
                      <div className="spinner"></div>
                      Verifying News...
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      Verify News
                    </>
                  )}
                </button>
                <button
                  onClick={getRandomTopics}
                  className="btn btn-secondary"
                >
                  <Shuffle size={16} />
                  Random Topics
                </button>
              </div>

              {randomTopics.length > 0 && (
                <div className="topics-container">
                  <label className="topics-label">Suggested Topics:</label>
                  <div className="topics-list">
                    {randomTopics.map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => setNewsTopic(topic)}
                        className="topic-chip"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="results-card">
              {newsResult ? (
                <div className="news-results">
                  <div className={`result-item ${
                    newsResult.overall_credibility.label === 'REAL' || newsResult.overall_credibility.label === 'MOSTLY_REAL' 
                      ? 'result-success' 
                      : newsResult.overall_credibility.label === 'MOSTLY_FAKE' || newsResult.overall_credibility.label === 'FAKE'
                      ? 'result-error'
                      : 'result-warning'
                  }`}>
                    <div className="result-header">
                      <div className="result-icon">
                        {newsResult.overall_credibility.label === 'REAL' || newsResult.overall_credibility.label === 'MOSTLY_REAL' ? (
                          <CheckCircle size={20} />
                        ) : newsResult.overall_credibility.label === 'MOSTLY_FAKE' || newsResult.overall_credibility.label === 'FAKE' ? (
                          <XCircle size={20} />
                        ) : (
                          <AlertCircle size={20} />
                        )}
                      </div>
                      <div>
                        <div className="result-title">
                          {newsResult.overall_credibility.label === 'REAL' || newsResult.overall_credibility.label === 'MOSTLY_REAL'
                            ? 'Verified News' 
                            : newsResult.overall_credibility.label === 'MOSTLY_FAKE' || newsResult.overall_credibility.label === 'FAKE'
                            ? 'False Information'
                            : 'Mixed Content'}
                        </div>
                        <div className="result-confidence">
                          Confidence: {(newsResult.overall_credibility.score * 100).toFixed(1)}%
                        </div>
                        <div className="result-status">
                          Status: {newsResult.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="result-details">
                    <div className="detail-row">
                      <span className="detail-label">Topic Analyzed:</span>
                      <span className="detail-value">{newsResult.topic}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Verification Status:</span>
                      <span className="detail-value">{newsResult.overall_credibility.label}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Real Articles:</span>
                      <span className="detail-value">{newsResult.overall_credibility.real_articles}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fake Articles:</span>
                      <span className="detail-value">{newsResult.overall_credibility.fake_articles}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Total Articles:</span>
                      <span className="detail-value">{newsResult.overall_credibility.total_articles}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Credibility Score:</span>
                      <span className="detail-value">{(newsResult.overall_credibility.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Analysis Type:</span>
                      <span className="detail-value">News Verification</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Analysis Status:</span>
                      <span className="detail-value">{newsResult.status}</span>
                    </div>
                  </div>
                  
                  {newsResult.articles && newsResult.articles.length > 0 && (
                    <div className="news-articles">
                      <div className="articles-header">
                        <span className="detail-label">Related Articles Analyzed:</span>
                        <span className="articles-count">{newsResult.articles.length} articles</span>
                      </div>
                      <div className="articles-grid">
                        {newsResult.articles.slice(0, 5).map((article, index) => (
                          <div key={index} className="news-article">
                            <div className="article-number">#{index + 1}</div>
                            <div className="article-content">
                              <div className="news-article-title">
                                {article.article?.title || 'Article title not available'}
                              </div>
                              <div className="news-article-source">
                                {article.article?.source || 'Source not available'}
                              </div>
                              {article.article?.url && (
                                <div className="article-url">
                                  <a 
                                    href={article.article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      console.log('Opening article URL:', article.article.url);
                                      window.open(article.article.url, '_blank', 'noopener,noreferrer');
                                    }}
                                  >
                                    <ExternalLink size={14} />
                                    Read full article
                                  </a>
                                </div>
                              )}
                              <div className="article-prediction">
                                <span className="prediction-label">Analysis:</span>
                                <span className={`prediction-value ${
                                  article.prediction?.label === 'REAL' ? 'prediction-real' : 'prediction-fake'
                                }`}>
                                  {article.prediction?.label || 'UNKNOWN'} 
                                  {article.prediction?.confidence && 
                                    ` (${(article.prediction.confidence * 100).toFixed(1)}%)`
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="results-placeholder">
                  <div className="results-placeholder-icon">
                    <Newspaper size={64} />
                  </div>
                  <h3>News Verification</h3>
                  <p>Enter a news topic to verify its credibility across multiple sources</p>
                  <div className="placeholder-features">
                    <div className="feature-item">
                      <CheckCircle size={16} />
                      <span>Analyze multiple articles</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle size={16} />
                      <span>Cross-reference sources</span>
                    </div>
                    <div className="feature-item">
                      <CheckCircle size={16} />
                      <span>Get credibility scores</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <div className="error-icon">
              <XCircle size={20} />
            </div>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisApp;
