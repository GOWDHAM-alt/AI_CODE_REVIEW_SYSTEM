import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

function History() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load reviews on page open
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/code/history');
      setReviews(res.data.reviews);
    } catch (err) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/code/history/${id}`);
      setReviews(reviews.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Title */}
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Review History</h1>
          <p style={styles.subtitle}>
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Loading */}
        {loading && (
          <div style={styles.centered}>
            <p style={styles.loadingText}>⏳ Loading your reviews...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && reviews.length === 0 && (
          <div style={styles.centered}>
            <p style={styles.emptyIcon}>📭</p>
            <p style={styles.emptyText}>No reviews yet</p>
            <p style={styles.emptySubtext}>
              Go to Dashboard and review some code!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              style={styles.goBtn}
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Reviews grid */}
        {!loading && reviews.length > 0 && (
          <div style={styles.grid}>

            {/* Left — Review list */}
            <div style={styles.list}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  onClick={() => setSelected(review)}
                  style={selected?.id === review.id
                    ? styles.listItemActive
                    : styles.listItem
                  }
                >
                  <div style={styles.listItemHeader}>
                    <span style={styles.langBadge}>
                      {review.language}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent selecting item
                        handleDelete(review.id);
                      }}
                      style={styles.deleteBtn}
                    >
                      🗑️
                    </button>
                  </div>
                  <p style={styles.codePreview}>
                    {review.code.substring(0, 80)}...
                  </p>
                  <p style={styles.date}>{formatDate(review.created_at)}</p>
                </div>
              ))}
            </div>

            {/* Right — Selected review detail */}
            <div style={styles.detail}>
              {!selected ? (
                <div style={styles.centered}>
                  <p style={styles.emptyIcon}>👈</p>
                  <p style={styles.emptyText}>Select a review to see details</p>
                </div>
              ) : (
                <>
                  <div style={styles.detailHeader}>
                    <span style={styles.langBadge}>{selected.language}</span>
                    <span style={styles.date}>
                      {formatDate(selected.created_at)}
                    </span>
                  </div>

                  <h3 style={styles.detailTitle}>Submitted Code</h3>
                  <pre style={styles.codeBlock}>{selected.code}</pre>

                  <h3 style={styles.detailTitle}>AI Review</h3>
                  <pre style={styles.reviewBlock}>{selected.review}</pre>
                </>
              )}
            </div>

          </div>
        )}
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
  error: {
    background: '#450a0a',
    border: '1px solid #dc2626',
    color: '#fca5a5',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px',
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '12px',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: '16px',
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
  goBtn: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '24px',
    alignItems: 'start',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  listItem: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'border-color 0.2s',
  },
  listItemActive: {
    background: '#1e293b',
    border: '1px solid #6366f1',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langBadge: {
    background: '#1e1b4b',
    color: '#818cf8',
    border: '1px solid #3730a3',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    borderRadius: '4px',
  },
  codePreview: {
    color: '#64748b',
    fontSize: '13px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  date: {
    color: '#475569',
    fontSize: '12px',
  },
  detail: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '600px',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailTitle: {
    color: '#94a3b8',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  codeBlock: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '16px',
    color: '#e2e8f0',
    fontSize: '13px',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowY: 'auto',
    maxHeight: '200px',
    margin: 0,
  },
  reviewBlock: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '16px',
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

export default History;