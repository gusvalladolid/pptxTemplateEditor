import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/home.css';

const Home = () => {
  const [file, setFile] = useState();
  const { state } = useLocation();
  const navigate = useNavigate();
  function handleChange(event) {
    setFile(event.target.files[0])
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (file) {
      navigate(`/template`,  { state: { file } })
    } else {
      alert('Please upload a valid .pptx file.')
    }
  }

  return (
    <div className="home-container">
      <h1 className="title">Power Point Templates</h1>
      <div className="upload-file-container">
        <form onSubmit={handleSubmit}>
          {state?.isSubmitted && <h2>File uploaded successfully!</h2>}
          <h1>Upload the PPTX file</h1>
          <input id="file-upload" type="file" onChange={handleChange} accept='.pptx' />
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Home;