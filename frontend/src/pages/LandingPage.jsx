import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const scrollToFeatures = (e) => {
    e.preventDefault();
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      <div className="bg-animation"></div>

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="logo">
          <div className="logo-icon">💪</div>
          <span>Fit-Track </span>
        </div>
        <button onClick={handleGetStarted} className="get-started-btn">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Transform Your Fitness Journey</h1>
          <p className="hero-subtitle">
            Track workouts, monitor progress, and achieve your fitness goals with precision and ease
          </p>
          <div className="hero-cta">
            <button onClick={handleGetStarted} className="cta-primary">
              Start Free Today
            </button>
            <button onClick={scrollToFeatures} className="cta-secondary">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2 className="section-title">Why Choose FitTrack Pro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Advanced Analytics</h3>
            <p className="feature-description">
              Get detailed insights into your workout performance with comprehensive charts and progress tracking.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Goal Setting</h3>
            <p className="feature-description">
              Set personalized fitness goals and track your journey with milestone celebrations and achievement badges.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💪</div>
            <h3 className="feature-title">Custom Workouts</h3>
            <p className="feature-description">
              Create and customize workout routines tailored to your fitness level and personal objectives.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3 className="feature-title">Real-time Tracking</h3>
            <p className="feature-description">
              Log exercises instantly with our intuitive interface and never miss a workout session.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">Achievement System</h3>
            <p className="feature-description">
              Stay motivated with our gamified achievement system and unlock rewards as you progress.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Cross-Platform Sync</h3>
            <p className="feature-description">
              Access your data anywhere, anytime with seamless synchronization across all your devices.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Ready to Transform Your Fitness?</h2>
        <p>Join thousands of users who are already achieving their fitness goals with FitTrack Pro</p>
        <button onClick={handleGetStarted} className="cta-primary">
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 Fit-Track </p>
      </footer>
    </div>
  );
}
