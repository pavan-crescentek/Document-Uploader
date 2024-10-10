import React from 'react';

const FileViewerComponent = ({ mime_type, url }) => {
  const getFileExtension = (mime) => {
    switch (mime) {
      case 'image/jpeg':
      case 'image/jpg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'application/pdf':
        return 'pdf';
      case 'application/msword':
        return 'doc';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx';
      default:
        return null;
    }
  };

  const fileExtension = getFileExtension(mime_type);

  const viewerStyle = {
    width: '100%',
    height: '80vh',
    maxWidth: '90vw',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  };

  const pdfDocStyle = {
    width: '100%',
    height: '100%',
    minWidth: '800px',
    minHeight: '600px',
  };

  return (
    <div className="p-0" style={viewerStyle}>
      {fileExtension === 'jpg' ||
      fileExtension === 'jpeg' ||
      fileExtension === 'png' ? (
        <img
          src={url}
          alt={`file of type ${fileExtension}`}
          style={imageStyle}
        />
      ) : fileExtension === 'pdf' ? (
        <embed src={url} type="application/pdf" style={pdfDocStyle} />
      ) : fileExtension === 'doc' || fileExtension === 'docx' ? (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          style={pdfDocStyle}
          frameBorder="0"
        ></iframe>
      ) : (
        <p>Unsupported file type</p>
      )}
    </div>
  );
};

export default FileViewerComponent;
