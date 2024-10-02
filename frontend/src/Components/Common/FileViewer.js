import React from 'react';
import FileViewer from 'react-file-viewer';
import { Document, Page } from 'react-pdf';

const FileViewerComponent = ({ fileUrl, fileType }) => {
  if (fileType.startsWith('image/')) {
    return (
      <img
        src={fileUrl}
        alt="file"
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    );
  }

  if (fileType === 'application/pdf') {
    return (
      <Document file={fileUrl}>
        <Page pageNumber={1} />
      </Document>
    );
  }

  if (
    fileType === 'application/msword' ||
    fileType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <FileViewer fileType="docx" filePath={fileUrl} />;
  }

  return <div>Unsupported file type</div>;
};
export default FileViewerComponent;
