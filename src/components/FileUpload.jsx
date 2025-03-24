import React from 'react';

const FileUpload = ({ handleFileChange, error }) => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    maxWidth: '400px',
    margin: '20px auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    padding: '10px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
    marginBottom: '10px',
  };

  const errorStyle = {
    marginTop: '10px',
    color: 'red',
    fontSize: '0.9rem',
    textAlign: 'center',
  };

  const labelStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>Upload a .docx File:</label>
      <input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        style={inputStyle}
      />
      {error && <div style={errorStyle}><p>{error}</p></div>}
    </div>
  );
};

export default FileUpload;
