import React, { useState } from 'react';
import { planService } from '../services/api';
import PlanDisplay from './PlanDisplay';

const PlanGenerator = () => {
  const [formData, setFormData] = useState({
    present_weight: '',
    expected_weight: '',
    target_months: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const validMonths = [2, 4, 6, 8, 12, 16, 24];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.present_weight || !formData.expected_weight || !formData.target_months) {
      setError('Please fill in all fields');
      return false;
    }

    const presentWeight = parseFloat(formData.present_weight);
    const expectedWeight = parseFloat(formData.expected_weight);
    const targetMonths = parseInt(formData.target_months);

    if (isNaN(presentWeight) || presentWeight <= 0) {
      setError('Please enter a valid present weight');
      return false;
    }

    if (isNaN(expectedWeight) || expectedWeight <= 0) {
      setError('Please enter a valid expected weight');
      return false;
    }

    if (isNaN(targetMonths) || !validMonths.includes(targetMonths)) {
      setError(`Target months must be one of: ${validMonths.join(', ')}`);
      return false;
    }

    if (expectedWeight >= presentWeight) {
      setError('Expected weight should be less than present weight for weight loss');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');
    setGeneratedPlan(null);

    try {
      const planData = {
        present_weight: parseFloat(formData.present_weight),
        expected_weight: parseFloat(formData.expected_weight),
        target_months: parseInt(formData.target_months)
      };

      const response = await planService.generatePlan(planData);
      
      setGeneratedPlan(response);
      setSuccess('Plan generated successfully!');
      
      // Reset form
      setFormData({
        present_weight: '',
        expected_weight: '',
        target_months: ''
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Generate Your AI Workout & Diet Plan</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Enter your details below to get a personalized workout and diet plan powered by AI.
      </p>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="present_weight">Present Weight (kg)</label>
          <input
            type="number"
            id="present_weight"
            name="present_weight"
            value={formData.present_weight}
            onChange={handleInputChange}
            placeholder="e.g., 70"
            step="0.1"
            min="1"
            max="500"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="expected_weight">Expected Weight (kg)</label>
          <input
            type="number"
            id="expected_weight"
            name="expected_weight"
            value={formData.expected_weight}
            onChange={handleInputChange}
            placeholder="e.g., 65"
            step="0.1"
            min="1"
            max="500"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="target_months">Target Duration (months)</label>
          <select
            id="target_months"
            name="target_months"
            value={formData.target_months}
            onChange={handleInputChange}
            required
          >
            <option value="">Select duration</option>
            {validMonths.map(month => (
              <option key={month} value={month}>
                {month} {month === 1 ? 'month' : 'months'}
              </option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '10px' }}></span>
              Generating Plan...
            </>
          ) : (
            'Generate My Plan'
          )}
        </button>
      </form>

      {generatedPlan && (
        <PlanDisplay plan={generatedPlan} />
      )}
    </div>
  );
};

export default PlanGenerator;
