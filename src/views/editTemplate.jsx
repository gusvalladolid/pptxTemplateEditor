import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { unzipFile, getAttributeValues, generateUpdatedFile } from '../functions/xmlFunctions';

const EditTemplate = () => {
  const { state } = useLocation();
  const { file } = state;
  const [slidesData, setSlidesData] = useState(null);
  const [attributeValues, setAttributeValues] = useState([]);
  const [inputValues, setInputValues] = useState([]);

  const handleInputChange = (event, slideIndex, attribute) => {
    const { value } = event.target;
    setInputValues(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[slideIndex] = {
        ...updatedValues[slideIndex],
        [attribute]: value
      };
      return updatedValues;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const hasEmptyValues = inputValues.some(slide =>
      Object.values(slide).some(value => value === "")
    );
    if (hasEmptyValues) {
      alert('Please fill in all fields for each slide.');
    } else {
      console.log(slidesData);
      
      generateUpdatedFile(slidesData, inputValues, file);
      console.log('Submitted values:', inputValues);
    }
  };

  useEffect(() => {
    const fetchXmlData = async () => {
      try {
        const slides = await unzipFile(file);
        const initialAttributeValues = getAttributeValues(slides);
        setSlidesData(slides);
        setAttributeValues(initialAttributeValues);
        setInputValues(initialAttributeValues);
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
            {Object.keys(slideAttributes).map((attribute, attributeIndex) => (
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
