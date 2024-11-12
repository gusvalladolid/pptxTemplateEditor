import React from 'react';
import './styles/attributeInputs.css';

const AttributeInput = ({ slideIndex, attributeIndex, attribute, value, handleInputChange }) => {
  return (
    <div className="inputs-container">
      {/* Label for the input field, displaying the attribute name */}
      <label htmlFor={`input-${slideIndex}-${attributeIndex}`} className="input-label">
        {attribute}:
      </label>

      {/* Textarea input field, allowing multi-line input and auto-expansion based on content */}
      <textarea
        id={`input-${slideIndex}-${attributeIndex}`} // Unique ID to connect the label and input
        placeholder="Input Value"
        name={attribute}
        value={value} // Controlled input value, managed by parent state
        onChange={(e) => handleInputChange(e, slideIndex, attribute)} // Call parent handler on change
        className="input-field"
      />
    </div>
  );
};

export default AttributeInput;
