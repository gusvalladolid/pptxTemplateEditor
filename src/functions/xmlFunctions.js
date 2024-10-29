//import { xml2js } from 'xml2js'
import { JSZip } from 'jszip'

const unzipFile = async (file) => {
  console.log('FILE IN XMLFUNCTIONS',file);
  
  const zip = await JSZip.loadAsync(file)
  const xml = await zip.file('ppt/presentation.xml').async('string');

  return xml
}

export { unzipFile }