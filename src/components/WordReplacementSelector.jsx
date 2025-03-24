
import React, { useState } from 'react';

const WordReplacementSelector = ({ matchedKeys, replacementSelections, predefinedWords, handleReplacementChange, handlePerformReplacement }) => {
const [isHovered, setIsHovered]= useState(false);

  return (
    <div>
      <h3>Select Replacements for Matched Words</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePerformReplacement();
        }}
      >
        {matchedKeys.map((key) => (
          <div key={key} style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>{key}:</label>
            <select
              value={[key]}
              onChange={(e) => handleReplacementChange(key, e.target.value)}
            >
              {predefinedWords[key].map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit" style={{
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
          onMouseLeave={() => setIsHovered(false)}>
          Perform Replacements
        </button>
      </form>
    </div>
  );
};

export default WordReplacementSelector;
