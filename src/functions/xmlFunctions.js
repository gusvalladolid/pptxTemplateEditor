import xml2js from 'xml2js';
import JSZip from 'jszip';

const xmlRoute = 'ppt/slides/slide';
const regex = /\w+AttributeValue\d+/g;

const unzipFile = async (file) => {
  const bufferFile = await readFileAsArrayBuffer(file);
  const zip = await JSZip.loadAsync(bufferFile);
  
  const slideFiles = Object.keys(zip.files).filter((fileName) => fileName.startsWith(xmlRoute));

  const slidePromises = slideFiles.map((slideFile) => {
    return zip.file(slideFile).async('string').then((data) => {
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

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = () => reject(new Error('Error reading file as ArrayBuffer'));
    fileReader.readAsArrayBuffer(file);
  });
};

const updateSlides = (slides, attributeDictionary) => {
  slides.map(slide => {
    
    const attributeValues = getAttributeValues(slide);
    return attributeValues;
  });
}

const getAttributeValues = (slides) => {
  const attributeValues = slides.map(slide => {
    const attributeValue = slide.match(regex);
    return attributeValue;
  });
  return attributeValues;
}

export { unzipFile, getAttributeValues, updateSlides };