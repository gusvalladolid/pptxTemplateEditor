import xml2js from 'xml2js';
import JSZip from 'jszip';

const xmlRoute = 'ppt/slides/slide';
const regex = /\w+AttributeValue\d+/g;

const getSlidesData = async (file) => {
  const bufferFile = await readFileAsArrayBuffer(file);
  return JSZip.loadAsync(bufferFile);
}

const unzipFile = async (file) => {
  const fileData = await getSlidesData(file);
  
  const slideFiles = Object.keys(fileData.files).filter((fileName) => fileName.startsWith(xmlRoute));

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

const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = () => reject(new Error('Error reading file as ArrayBuffer'));
    fileReader.readAsArrayBuffer(file);
  });
};

const getAttributeValues = (slides) => {
  const attributeValues = slides.map((slide) => {
    const attributeValue = slide.match(regex);
    const attributeObject = attributeValue.reduce((acc, attribute) => {
      acc[attribute] = "";
      return acc;
    }, {});
    
    return attributeObject;
  }); 
  return attributeValues;
};

const generateUpdatedFile = async (slides, attributeDictionaries, file) => {
  const updatedSlides = updateSlidesContent(slides, attributeDictionaries);
  const builder = new xml2js.Builder();
  const fileData = await getSlidesData(file);

  updatedSlides.forEach((slide, slideIndex) => {
    let slideFileName = `${xmlRoute}${slideIndex+1}.xml`;
    const updatedXmlContent = builder.buildObject(JSON.parse(slide));
    fileData.file(slideFileName, updatedXmlContent);
  });

  const updatedFile = await fileData.generateAsync({type: 'blob'});
  const url = URL.createObjectURL(updatedFile);
  // Trigger file download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'updatedFile.pptx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('UPDATED SLIDES', updatedSlides);
};

const updateSlidesContent = (slides, attributeDictionaries) => {
  return slides.map((slide, slideIndex) => {
    let updatedSlide = slide;
    const attributeDictionary = attributeDictionaries[slideIndex];
    Object.keys(attributeDictionary).forEach(key => {
      const regex = new RegExp(key, 'g');
      updatedSlide = updatedSlide.replace(regex, attributeDictionary[key] || ''); 
    });
    return updatedSlide;
  });
};

export { unzipFile, getAttributeValues, generateUpdatedFile };