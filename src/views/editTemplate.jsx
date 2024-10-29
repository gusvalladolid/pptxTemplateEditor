import React from 'react'
import { useLocation } from 'react-router-dom'
import { unzipFile } from '../functions/xmlFunctions';

const EditTemplate = () => {
  const { state } = useLocation();
  const { file } = state;

  const xml = unzipFile(file);
  console.log(xml);
  

  return (
    <div>
      Edit Template
    </div>
  )
}

export default EditTemplate