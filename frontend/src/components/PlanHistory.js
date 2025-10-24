import React, { useState, useEffect } from 'react';
import { planService } from '../services/api';
import PlanDisplay from './PlanDisplay';

const PlanHistory = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchPlans = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await planService.getAllPlans(page, 5);
      setPlans(response.plans);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedPlan(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Plan History</h2>
        <div className="loading">
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>Loading your plans...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h2>Your Plan History</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          View and manage your previously generated workout and diet plans.
        </p>

        {error && <div className="error">{error}</div>}

        {plans.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h3>No plans found</h3>
            <p>Generate your first plan to see it here!</p>
          </div>
        ) : (
          <>
            <div className="plan-grid">
              {plans.map((plan) => (
                <div 
                  key={plan._id} 
                  className="plan-card"
                  style={{ 
                    cursor: 'pointer',
                    border: selectedPlan?._id === plan._id ? '2px solid #667eea' : '1px solid #e1e5e9'
                  }}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <h3>Plan #{plan._id.slice(-6)}</h3>
                  <div className="plan-section">
                    <p><strong>Weight:</strong> {plan.present_weight}kg → {plan.expected_weight}kg</p>
                    <p><strong>Duration:</strong> {plan.target_months} months</p>
                    <p><strong>Created:</strong> {formatDate(plan.created_at)}</p>
                  </div>
                  <div style={{ 
                    marginTop: '10px', 
                    padding: '8px', 
                    background: '#667eea', 
                    color: 'white', 
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '14px'
                  }}>
                    Click to view details
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '10px',
                marginTop: '20px'
              }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <span style={{ 
                  padding: '10px 15px', 
                  background: '#f8f9fa', 
                  borderRadius: '5px',
                  fontWeight: '600'
                }}>
                  Page {currentPage} of {pagination.pages}
                </span>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPlan && (
        <div className="card">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3>Plan Details</h3>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedPlan(null)}
            >
              Close
            </button>
          </div>
          <PlanDisplay plan={selectedPlan} />
        </div>
      )}
    </div>
  );
};

export default PlanHistory;
