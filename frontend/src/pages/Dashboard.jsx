import { useState } from 'react';
import Navbar from '../components/Navbar';
import API from '../api/axios';

const LANGUAGES = [
  'javascript', 'python', 'java', 'c', 'c++',
  'typescript', 'php', 'ruby', 'go', 'rust'
];

function Dashboard() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setError('');
    setLoading(true);
    setReview('');

    try {
      const res = await API.post('/code/review', { code, language });
      setReview(res.data.review);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setReview('');
    setError('');
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Page Title */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Code Review</h1>
          <p style={styles.subtitle}>
            Paste your code below and get an instant AI-powered review
          </p>
        </div>

        {/* Main content */}
        <div style={styles.grid}>

          {/* Left — Code Input */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Your Code</h2>

              {/* Language selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={styles.select}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Paste your ${language} code here...`}
              style={styles.textarea}
              spellCheck={false}
            />

            {/* Error */}
            {error && <div style={styles.error}>{error}</div>}

            {/* Buttons */}
            <div style={styles.buttonRow}>
              <button
                onClick={handleClear}
                style={styles.clearBtn}
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                style={loading ? styles.submitBtnDisabled : styles.submitBtn}
                disabled={loading}
              >
                {loading ? '⏳ Reviewing...' : '⚡ Review Code'}
              </button>
            </div>
          </div>

          {/* Right — AI Review Output */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>AI Review</h2>
              {review && <span style={styles.badge}>✅ Complete</span>}
            </div>

            {/* Empty state */}
            {!review && !loading && (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>🤖</p>
                <p style={styles.emptyText}>
                  Your AI review will appear here
                </p>
                <p style={styles.emptySubtext}>
                  Paste your code and click "Review Code"
                </p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>⏳</p>
                <p style={styles.emptyText}>Analyzing your code...</p>
                <p style={styles.emptySubtext}>
                  This usually takes 5-10 seconds
                </p>
              </div>
            )}

            {/* Review output */}
            {review && (
              <pre style={styles.reviewOutput}>{review}</pre>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f172a',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  titleSection: {
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    background: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '600px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  select: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#f1f5f9',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  textarea: {
    flex: 1,
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '16px',
    color: '#e2e8f0',
    fontSize: '14px',
    fontFamily: 'monospace',
    resize: 'none',
    outline: 'none',
    lineHeight: '1.6',
    minHeight: '420px',
  },
  error: {
    background: '#450a0a',
    border: '1px solid #dc2626',
    color: '#fca5a5',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  clearBtn: {
    background: 'transparent',
    border: '1px solid #475569',
    color: '#94a3b8',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitBtnDisabled: {
    background: '#4338ca',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'not-allowed',
    opacity: '0.7',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  emptyIcon: {
    fontSize: '48px',
  },
  emptyText: {
    color: '#cbd5e1',
    fontSize: '16px',
    fontWeight: '500',
  },
  emptySubtext: {
    color: '#64748b',
    fontSize: '14px',
  },
  badge: {
    background: '#052e16',
    color: '#86efac',
    border: '1px solid #166534',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  reviewOutput: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: '14px',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowY: 'auto',
    fontFamily: 'inherit',
    margin: 0,
  },
};

export default Dashboard;