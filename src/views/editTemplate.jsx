import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { unzipFile, getAttributeValues, generateUpdatedFile } from '../functions/xmlFunctions';
import AttributeInput from '../components/attributeInputs';
import './styles/editTemplate.css';

const EditTemplate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { file } = state;
  const [slidesData, setSlidesData] = useState(null);
  const [attributeValues, setAttributeValues] = useState([]);
  const [inputValues, setInputValues] = useState([]);

  const handleInputChange = (event, slideIndex, attribute) => {
    const { value } = event.target;
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  
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
      generateUpdatedFile(slidesData, inputValues, file);
      navigate('/', { state: { isSubmitted: true } });
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
    <div className="container-edit-template">
      <h1 className="main-heading">Edit Template</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className='inputs-container'>
        {attributeValues.map((slideAttributes, slideIndex) => (
          <div key={`slide-${slideIndex}`} className="single-input-container">
            <h2 className="slide-heading">Slide {slideIndex + 1}</h2>
            {Object.keys(slideAttributes).map((attribute, attributeIndex) => (
              <AttributeInput
                key={`attribute-${attributeIndex}`}
                slideIndex={slideIndex}
                attributeIndex={attributeIndex}
                attribute={attribute}
                value={inputValues[slideIndex]?.[attribute] || ''}
                handleInputChange={handleInputChange}
              />
            ))}
          </div>
        ))}
        </div>
        <div className='submit-container'>
          <button type="submit" className="submit-button">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default EditTemplate;
