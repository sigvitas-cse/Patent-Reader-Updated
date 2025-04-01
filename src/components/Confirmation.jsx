import React, { useState } from 'react';

const Confirmation = ({ wordCounts, replacementSelections, handleConfirmDownload, showProfanity, confirmationNeeded }) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    margin: '20px auto',
    padding: '20px',
    maxWidth: '800px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    marginTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const thStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    color: '#555',
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#45a049',
  };

  return (
    <div style={containerStyle}>
      {showProfanity && confirmationNeeded && (
        <div>
          <h3 style={titleStyle}>Confirm Replacement</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Predefined Word</th>
                <th style={thStyle}>Alternative Word</th>
                <th style={thStyle}>Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(wordCounts).map(([word, count]) => (
                <tr key={word}>
                  <td style={tdStyle}>{word}</td>
                  <td style={tdStyle}>{replacementSelections[word]}</td>
                  <td style={tdStyle}>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            style={{
              margin: "5%",
              padding: "12px 20px",
              background: isHovered
                ? "linear-gradient(135deg,rgb(204, 151, 167), #6a4caf)"
                : "linear-gradient(135deg, #6a4caf, #c35b7a)",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              letterSpacing: "1.5px",
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
              position: "relative",
              boxShadow: isHovered
                ? "0 0 10px rgba(255, 255, 255, 0.5)"
                : "2px 2px 10px rgba(0, 0, 0, 0.2)",
              transform: isHovered ? "translateY(-2px)" : "none",
              display: "flex",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleConfirmDownload}
          >
            Confirm and Download
          </button>
        </div>
      )}
    </div>

  );
};

export default Confirmation;
