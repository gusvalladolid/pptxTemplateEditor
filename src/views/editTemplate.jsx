import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { unzipFile, getAttributeValues, generateUpdatedFile } from '../functions/xmlFunctions';
import AttributeInput from '../components/attributeInputs';
import './styles/editTemplate.css';

/**
 * EditTemplate Component
 * This component provides an interface for editing the attributes of each slide in a PowerPoint template.
 * Key Features:
 * - Displays editable fields for each attribute in the uploaded file.
 * - Handles input changes, dynamically adjusts input height, and validates form submission.
 * - Exports the modified template upon successful submission.
 */

const EditTemplate = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { file } = state;
  const [slidesData, setSlidesData] = useState(null);      // Stores the parsed XML data of the slides
  const [attributeValues, setAttributeValues] = useState([]); // Holds initial attribute values for each slide
  const [inputValues, setInputValues] = useState([]);       // Stores current values entered by the user

  /**
   * handleInputChange - Updates input values and dynamically resizes textareas.
   * @param {Object} event - The input change event.
   * @param {number} slideIndex - Index of the slide in the attributeValues array.
   * @param {string} attribute - Attribute being modified.
   */
  const handleInputChange = (event, slideIndex, attribute) => {
    const { value } = event.target;
    const textarea = event.target;
    textarea.style.height = 'auto';  // Reset height to allow natural growth
    textarea.style.height = `${textarea.scrollHeight}px`;  // Set to full height of content
  
    setInputValues(prevValues => {
      const updatedValues = [...prevValues];
      updatedValues[slideIndex] = {
        ...updatedValues[slideIndex],
        [attribute]: value
      };
      return updatedValues;
    });
  };

  /**
   * handleSubmit - Validates form input, generates updated file, and navigates to home with success state.
   * @param {Object} event - The form submission event.
   */
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

  /**
   * useEffect - Fetches and sets XML data on component mount, triggered by file prop change.
   * Processes the slides for initial attribute values.
   */
  useEffect(() => {
    const fetchXmlData = async () => {
      try {
        const slides = await unzipFile(file);  // Unzip file and extract slide data
        const initialAttributeValues = getAttributeValues(slides);  // Get attribute values
        setSlidesData(slides);                 // Save slides data in state
        setAttributeValues(initialAttributeValues);  // Set initial attribute values
        setInputValues(initialAttributeValues);      // Initialize input values with attributes
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
