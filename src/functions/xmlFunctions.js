import xml2js from 'xml2js';
import JSZip from 'jszip';

const xmlRoute = 'ppt/slides/slide'; // Path to locate slide files within the PPTX zip structure
const regex = /\w+AttributeValue\d+/g; // Regular expression to find attribute values in XML

/**
 * getSlidesData - Reads a .pptx file and extracts the slides' data as a JSZip object.
 * @param {File} file - The uploaded PowerPoint (.pptx) file.
 * @returns {Promise<Object>} - A promise that resolves with the JSZip object of the file.
 */
const getSlidesData = async (file) => {
  const bufferFile = await readFileAsArrayBuffer(file);
  return JSZip.loadAsync(bufferFile);
};

/**
 * unzipFile - Extracts and parses XML content of each slide in the .pptx file.
 * @param {File} file - The uploaded PowerPoint (.pptx) file.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of JSON strings representing each slide's XML.
 */
const unzipFile = async (file) => {
  const fileData = await getSlidesData(file);
  
  // Filter for files that are slide XML files in the specified path
  const slideFiles = Object.keys(fileData.files).filter((fileName) => fileName.startsWith(xmlRoute));

  // Parse each slide XML into a JSON string
  const slidePromises = slideFiles.map((slideFile) => {
    return fileData.file(slideFile).async('string').then((data) => {
      return new Promise((resolve, reject) => {
        xml2js.parseString(data, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.stringify(result));
          }
        });
      });
    });
  });

  return Promise.all(slidePromises);
};

/**
 * readFileAsArrayBuffer - Converts a file to an ArrayBuffer.
 * @param {File} file - The uploaded PowerPoint (.pptx) file.
 * @returns {Promise<ArrayBuffer>} - A promise that resolves with the file's ArrayBuffer.
 */
const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = () => reject(new Error('Error reading file as ArrayBuffer'));
    fileReader.readAsArrayBuffer(file);
  });
};

/**
 * getAttributeValues - Extracts attribute placeholders from each slide using a regex and initializes them with empty values.
 * @param {Array<string>} slides - Array of slides in JSON string format.
 * @returns {Array<Object>} - Array of objects where keys are attribute placeholders with empty string values.
 */
const getAttributeValues = (slides) => {
  const attributeValues = slides.map((slide) => {
    const attributeValue = slide.match(regex);
    const attributeObject = attributeValue.reduce((acc, attribute) => {
      acc[attribute] = ""; // Initialize each placeholder with an empty string
      return acc;
    }, {});
    
    return attributeObject;
  }); 
  return attributeValues;
};

/**
 * generateUpdatedFile - Generates and triggers the download of an updated .pptx file after replacing attribute values.
 * @param {Array<string>} slides - Array of slide data as JSON strings.
 * @param {Array<Object>} attributeDictionaries - Array of attribute-value mappings for each slide.
 * @param {File} file - Original .pptx file used to preserve file structure during updates.
 */
const generateUpdatedFile = async (slides, attributeDictionaries, file) => {
  const updatedSlides = updateSlidesContent(slides, attributeDictionaries);
  const builder = new xml2js.Builder(); // Rebuild XML with updates
  const fileData = await getSlidesData(file);

  // Update each slide file in the .pptx structure with modified XML content
  updatedSlides.forEach((slide, slideIndex) => {
    let slideFileName = `${xmlRoute}${slideIndex + 1}.xml`; // Locate the original slide XML file
    const updatedXmlContent = builder.buildObject(JSON.parse(slide)); // Rebuild JSON back into XML
    fileData.file(slideFileName, updatedXmlContent); // Replace the slide's content in zip structure
  });

  // Generate a new .pptx file and initiate download
  const updatedFile = await fileData.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(updatedFile);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'updatedFile.pptx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('UPDATED SLIDES', updatedSlides); // Log updated slides for debugging
};

/**
 * updateSlidesContent - Updates each slide's XML content by replacing placeholder attributes with user input values.
 * @param {Array<string>} slides - Array of slide data as JSON strings.
 * @param {Array<Object>} attributeDictionaries - Array of objects where keys are attribute placeholders and values are user input.
 * @returns {Array<string>} - Array of updated slides as JSON strings.
 */
const updateSlidesContent = (slides, attributeDictionaries) => {
  return slides.map((slide, slideIndex) => {
    let updatedSlide = slide;
    const attributeDictionary = attributeDictionaries[slideIndex];

    // Replace each placeholder in the slide with corresponding user input
    Object.keys(attributeDictionary).forEach(key => {
      const regex = new RegExp(key, 'g');
      updatedSlide = updatedSlide.replace(regex, attributeDictionary[key] || ''); 
    });
    return updatedSlide;
  });
};

export { unzipFile, getAttributeValues, generateUpdatedFile };
