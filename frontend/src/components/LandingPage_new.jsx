import React from 'react';
import { Shield, Search, TrendingUp, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">
            <div className="logo-icon">
              <Shield size={24} />
            </div>
            <span>FakeGuard</span>
          </div>
          <button className="btn btn-primary" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>
              Fight Fake News
              <br />
              With AI-Powered Detection
            </h1>
            <p className="hero-subtitle">
              Advanced machine learning algorithms analyze text, social media content, and verify news sources in real-time. 
              Stay informed with accurate, reliable information.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={onGetStarted}>
                Start Analyzing
                <ArrowRight size={20} />
              </button>
              <button className="btn btn-secondary">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Comprehensive tools to detect and verify information across multiple platforms
            </p>
          </div>
          
          <div className="card-grid">
            <div className="card">
              <div className="card-icon">
                <Search size={32} />
              </div>
              <h3>Text Analysis</h3>
              <p>
                Advanced NLP algorithms analyze text patterns, sentiment, and linguistic markers to identify potentially fake content.
              </p>
            </div>
            
            <div className="card">
              <div className="card-icon">
                <Users size={32} />
              </div>
              <h3>Social Media Detection</h3>
              <p>
                Specialized models analyze social media posts, engagement patterns, and source credibility for comprehensive verification.
              </p>
            </div>
            
            <div className="card">
              <div className="card-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Real-time News Verification</h3>
              <p>
                Cross-reference news articles with multiple sources and fact-check databases to verify authenticity instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">99.2%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1M+</div>
              <div className="stat-label">Articles Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">&lt;2s</div>
              <div className="stat-label">Analysis Time</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-light">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Simple three-step process to verify any information
            </p>
          </div>
          
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Input Content</h3>
              <p>
                Paste text, enter a social media post, or provide a news topic for analysis.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>
                Our advanced algorithms analyze patterns, sources, and cross-reference information.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Results</h3>
              <p>
                Receive detailed analysis with confidence scores and verification recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-dark">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <div className="cta-icon">
                <Zap size={48} />
              </div>
              <h2 className="cta-title">Ready to Fight Misinformation?</h2>
              <p className="cta-subtitle">
                Join thousands of users who trust FakeGuard for accurate, reliable information verification.
              </p>
              <button className="btn btn-primary" onClick={onGetStarted}>
                Start Using FakeGuard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
