import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { unzipFile, getAttributeValues, updateSlides } from '../functions/xmlFunctions';

const EditTemplate = () => {
  const { state } = useLocation();
  const { file } = state;
  const [attributeValues, setAttributeValues] = useState([]);
  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (event, slideIndex, attribute) => {
    const { value } = event.target;
    setInputValues(prevValues => ({
      ...prevValues,
      [slideIndex]: {
        ...prevValues[slideIndex],
        [attribute]: value,
      }
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted dictionary:', inputValues);
    // Perform further actions like updating the slides or sending data to an API
  };

  useEffect(() => {
    const fetchXmlData = async () => {
      try {
        const slides = await unzipFile(file);
        setAttributeValues(getAttributeValues(slides));
      } catch (error) {
        console.error('Error fetching XML:', error);
      }
    };
    
    if (file) {
      fetchXmlData();
    }
  }, [file]);

  return (
    <div>
      <h1>Edit Template</h1> 
      <form onSubmit={handleSubmit}>
        {attributeValues.map((slideAttributes, slideIndex) => (
          <div key={`slide-${slideIndex}`}>
            <h2>Slide {slideIndex + 1}</h2>
            {slideAttributes.map((attribute, attributeIndex) => (
              <div key={`attribute-${attributeIndex}`} className='inputs-container'>
                <label htmlFor={`input-${slideIndex}-${attributeIndex}`}>{attribute}:</label>
                <input 
                  type='text'
                  id={`input-${slideIndex}-${attributeIndex}`}
                  placeholder='Input Value'
                  name={attribute}
                  value={inputValues[slideIndex]?.[attribute] || ''}
                  onChange={(e) => handleInputChange(e, slideIndex, attribute)}
                />
              </div>
            ))}
          </div>
        ))}
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default EditTemplate;
