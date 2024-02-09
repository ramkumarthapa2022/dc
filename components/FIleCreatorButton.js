'use client';
import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const FileCreatorButton = () => {
  const [inputContent, setInputContent] = useState('');

  const handleInputChange = (event) => {
    setInputContent(event.target.value);
  };

  const handleFileCreation = async () => {
    try {
      const response = await fetch('/template/mswordtemplate.docx');
      const templateContent = await response.arrayBuffer();
      const binaryString = new Uint8Array(templateContent).reduce((acc, byte) => {
        return acc + String.fromCharCode(byte);
      }, '');
      const zip = await JSZip.loadAsync(binaryString);

      let documentContent = await zip.file('word/document.xml').async('string');

      documentContent = documentContent.replace('</w:body>', `<w:p><w:r><w:t>${inputContent}</w:t></w:r></w:p></w:body>`);

      zip.file('word/document.xml', documentContent);

      const updatedContent = await zip.generateAsync({ type: 'blob' });

      saveAs(updatedContent, 'newfile.docx');
    } catch (error) {
      console.error('Error creating .docx file:', error);
    }
  };

  return (
    <div>
      <input type="text" value={inputContent} onChange={handleInputChange} placeholder="Enter content..." />
      <button onClick={handleFileCreation}>Create .docx File</button>
    </div>
  );
};

export default FileCreatorButton;
