import React from 'react';
import './styles/home.css';
import TemplateCard from '../components/templateCard';

function Home() {
  return (
    <div className="container">
      <h1 className="title">Power Point Templates</h1>
      <div className="rectangle-view">
        <TemplateCard />
      </div>
    </div>
  );
}

export default Home;