import React from 'react';

const PlanDisplay = ({ plan }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const formatValue = (value, unit) => {
    if (value === 0) return '0';
    return `${value}`;
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Your Personalized Plan</h3>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        borderLeft: '4px solid #667eea'
      }}>
        <p><strong>Present Weight:</strong> {plan.metadata.present_weight} kg</p>
        <p><strong>Target Weight:</strong> {plan.metadata.expected_weight} kg</p>
        <p><strong>Duration:</strong> {plan.metadata.target_months} months</p>
        <p><strong>Generated:</strong> {new Date(plan.metadata.created_at).toLocaleString()}</p>
      </div>

      {/* Table Format Display */}
      <div style={{ 
        overflowX: 'auto', 
        marginBottom: '20px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ background: '#667eea', color: 'white' }}>
              <th style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Day</th>
              <th colSpan="6" style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                Workout (mins)
              </th>
              <th colSpan="4" style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                Diet (grams)
              </th>
            </tr>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}></th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Treadmill</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Power Lifting</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Squats</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Dead Lift</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Cycling</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Skipping</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Calories</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Carbohydrates</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Protein</th>
              <th style={{ padding: '10px 8px', border: '1px solid #ddd', textAlign: 'center' }}>Fat</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, index) => {
              const dayData = plan.plan[day];
              if (!dayData) return null;

              return (
                <tr key={day} style={{ 
                  background: index % 2 === 0 ? '#f9f9f9' : 'white',
                  transition: 'background-color 0.2s ease'
                }}>
                  <td style={{ 
                    padding: '12px 8px', 
                    border: '1px solid #ddd', 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    background: '#667eea',
                    color: 'white'
                  }}>
                    {day}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.treadmill, 'mins')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.power_lifting, 'mins')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.squats, 'mins')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.dead_lift, 'mins')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.cycling, 'mins')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.skipping, 'mins')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.calories, 'grams')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.carbohydrates, 'grams')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.protein, 'grams')}
                  </td>
                  <td style={{ padding: '12px 8px', border: '1px solid #ddd', textAlign: 'center' }}>
                    {formatValue(dayData.fat, 'grams')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#e8f4fd', 
        borderRadius: '8px',
        borderLeft: '4px solid #2196f3'
      }}>
        <h4>💡 Plan Tips</h4>
        <ul style={{ marginLeft: '20px', color: '#666' }}>
          <li>Follow the workout schedule consistently for best results</li>
          <li>Maintain the recommended nutrition intake</li>
          <li>Stay hydrated throughout the day</li>
          <li>Get adequate rest and sleep</li>
          <li>Track your progress weekly</li>
        </ul>
      </div>
    </div>
  );
};

export default PlanDisplay;
