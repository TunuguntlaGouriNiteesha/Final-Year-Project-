import React from 'react';
import { FileText, Users, Newspaper, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const AnalysisApp = ({ mode, setMode, text, setText, result, setResult, loading, error, setError,
                      newsTopic, setNewsTopic, newsResult, setNewsResult, randomTopics, setRandomTopics,
                      verifyingNews, setVerifyingNews, 
                      handleTextAnalysis, handleSocialAnalysis, handleNewsVerification, getRandomTopics }) => {
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fake News Detection System
          </h1>
          <p className="text-xl text-gray-600">
            Analyze content with advanced AI algorithms
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setMode('text')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                mode === 'text' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Text Analysis</span>
            </button>
            <button
              onClick={() => setMode('social')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                mode === 'social' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Social Media</span>
            </button>
            <button
              onClick={() => setMode('news')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                mode === 'news' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Newspaper className="h-5 w-5" />
              <span>News Verification</span>
            </button>
          </div>
        </div>

        {/* Text Analysis Section */}
        {mode === 'text' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-primary-600" />
                Text Analysis
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter text to analyze
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="input-field min-h-[200px] resize-none"
                    placeholder="Paste the text you want to analyze for fake news detection..."
                  />
                </div>
                <button
                  onClick={handleTextAnalysis}
                  disabled={!text.trim() || loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Text'
                  )}
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h3>
              {result ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    result.prediction === 'REAL' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      {result.prediction === 'REAL' ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 mr-2" />
                      )}
                      <span className={`text-lg font-semibold ${
                        result.prediction === 'REAL' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.prediction === 'REAL' ? 'Real News' : 'Fake News'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Processing Time:</span>
                        <span className="font-medium">{result.processing_time}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model Version:</span>
                        <span className="font-medium">v2.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter text and click analyze to see results</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Social Media Analysis Section */}
        {mode === 'social' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 mr-2 text-primary-600" />
                Social Media Analysis
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Content
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="input-field min-h-[200px] resize-none"
                    placeholder="Paste social media post, tweet, or content to analyze..."
                  />
                </div>
                <button
                  onClick={handleSocialAnalysis}
                  disabled={!text.trim() || loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Social Media'
                  )}
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media Results</h3>
              {result ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    result.prediction === 'REAL' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      {result.prediction === 'REAL' ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 mr-2" />
                      )}
                      <span className={`text-lg font-semibold ${
                        result.prediction === 'REAL' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.prediction === 'REAL' ? 'Authentic Content' : 'Misleading Content'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Confidence: {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  {result.analysis && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Social Analysis</h4>
                      <p className="text-sm text-gray-600">{result.analysis}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter social media content to analyze</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* News Verification Section */}
        {mode === 'news' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Newspaper className="h-6 w-6 mr-2 text-primary-600" />
                News Verification
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    News Topic or Keyword
                  </label>
                  <input
                    type="text"
                    value={newsTopic}
                    onChange={(e) => setNewsTopic(e.target.value)}
                    className="input-field"
                    placeholder="Enter news topic to verify..."
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleNewsVerification}
                    disabled={!newsTopic.trim() || verifyingNews}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingNews ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify News'
                    )}
                  </button>
                  <button
                    onClick={getRandomTopics}
                    className="btn-secondary"
                  >
                    Random Topics
                  </button>
                </div>

                {randomTopics.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {randomTopics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => setNewsTopic(topic)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verification Results</h3>
              {newsResult ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    newsResult.verification_status === 'verified' 
                      ? 'bg-green-50 border border-green-200' 
                      : newsResult.verification_status === 'false'
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      {newsResult.verification_status === 'verified' ? (
                        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      ) : newsResult.verification_status === 'false' ? (
                        <XCircle className="h-6 w-6 text-red-600 mr-2" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
                      )}
                      <span className={`text-lg font-semibold ${
                        newsResult.verification_status === 'verified' 
                          ? 'text-green-800' 
                          : newsResult.verification_status === 'false'
                          ? 'text-red-800'
                          : 'text-yellow-800'
                      }`}>
                        {newsResult.verification_status === 'verified' 
                          ? 'Verified News' 
                          : newsResult.verification_status === 'false'
                          ? 'False Information'
                          : 'Unverified'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Confidence: {(newsResult.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  
                  {newsResult.articles && newsResult.articles.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Related Articles</h4>
                      <div className="space-y-2">
                        {newsResult.articles.slice(0, 3).map((article, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium text-gray-900">{article.title}</div>
                            <div className="text-gray-600">{article.source}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Enter a news topic to verify</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisApp;
