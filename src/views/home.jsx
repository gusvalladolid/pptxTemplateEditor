import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/home.css';

/**
 * Home Component
 * Renders the main interface for uploading a PowerPoint (.pptx) file and submitting it for editing.
 * State:
 * - file: Stores the file selected by the user.
 * Props:
 * - state (from useLocation): Used to check if the file has been successfully submitted from a previous screen.
 * Functions:
 * - handleChange: Handles the event for file selection.
 * - handleSubmit: Validates file selection, navigates to the template editor if valid.
 */

const Home = () => {
  const [file, setFile] = useState();  // Stores the selected file
  const { state } = useLocation();     // Access state from navigation to check for submission success
  const navigate = useNavigate();       // Navigation hook for redirecting to the template editor

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  /**
   * handleSubmit - Validates the selected file and navigates to the template editor page.
   * If no file is selected, alerts the user.
   * @param {Object} event - The form submission event.
   */
  function handleSubmit(event) {
    event.preventDefault();
    if (file) {
      navigate(`/template`, { state: { file } });
    } else {
      alert('Please upload a valid .pptx file.');
    }
  }

  return (
    <div className="home-container">
      <h1 className="title">Power Point Templates</h1>
      <div className="upload-file-container">
        <form onSubmit={handleSubmit}>
          {state?.isSubmitted && <h2>File uploaded successfully!</h2>}
          <h1>Upload the PPTX file</h1>
          <input 
            id="file-upload" 
            type="file" 
            onChange={handleChange} 
            accept='.pptx' 
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
