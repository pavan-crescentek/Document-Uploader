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

  // Render based on file type
  return (
    <div>
      {fileExtension === 'jpg' ||
      fileExtension === 'jpeg' ||
      fileExtension === 'png' ? (
        <img
          src={url}
          alt={`file of type ${fileExtension}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      ) : fileExtension === 'pdf' ? (
        <embed src={url} type="application/pdf" width="100%" height="600px" />
      ) : fileExtension === 'doc' || fileExtension === 'docx' ? (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          width="100%"
          height="600px"
          frameBorder="0"
        ></iframe>
      ) : (
        <p>Unsupported file type</p>
      )}
    </div>
  );
};

export default FileViewerComponent;
