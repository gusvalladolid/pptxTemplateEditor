import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/home.css';

const Home = () => {
  const [file, setFile] = useState();
  const navigate = useNavigate();

  function handleChange(event) {
    setFile(event.target.files[0])
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (file && file.name.endsWith('.pptx')) {
      navigate(`/template`,  { state: { file } })
    } else {
      alert('Please upload a valid .pptx file.')
    }
  }

  return (
    <div className="container">
      <h1 className="title">Power Point Templates</h1>
      <div className="upload-file-container">
        <form onSubmit={handleSubmit}>
          <h1>Upload the PPTX file</h1>
          <input id="file-upload" type="file" onChange={handleChange}/>
          <button type="submit">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Home;