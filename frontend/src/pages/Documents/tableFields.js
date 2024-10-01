import React from 'react';

const documentsListTableFields = (
  Status,
  handleCustomerClick,
  onClickDelete
) => {
  return [
    // {
    //   id: '#',
    //   accessorKey: 'id',
    //   enableColumnFilter: false,
    //   enableSorting: false,
    // },
    {
      header: 'Name',
      accessorKey: 'metadata',
      enableColumnFilter: false,
    },
    {
      header: 'Section',
      accessorKey: 'section',
      enableColumnFilter: false,
    },
    {
      header: 'Subsection',
      accessorKey: 'subsection',
      enableColumnFilter: false,
    },
    {
      header: 'Link',
      accessorKey: 'doc',
      enableColumnFilter: false,
      cell: (cellProps) => {
        return (
          <a
            href={cellProps.row.original.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="document-view-link"
          >
            View File
          </a>
        );
      },
    },
    {
      header: 'Type',
      accessorKey: 'media_type',
      enableColumnFilter: false,
      cell: (cellProps) => {
        return (
          <div>
            <span>{`${cellProps.row.original?.media_type || ''}`}</span>
          </div>
        );
      },
    },
    {
      header: 'Size',
      accessorKey: 'media_size',
      enableColumnFilter: false,
      cell: (cellProps) => {
        const sizeInBytes = cellProps.row.original.media_size;
        const sizeInKB = sizeInBytes / 1024;
        if (sizeInKB < 1024) {
          return <span>{sizeInKB.toFixed(2)} KB</span>;
        } else {
          const sizeInMB = sizeInKB / 1024;
          return <span>{sizeInMB.toFixed(2)} MB</span>;
        }
      },
    },
    {
      header: 'Action',
      cell: (cellProps) => {
        return (
          <ul className="list-inline hstack gap-2 mb-0">
            <li className="list-inline-item edit" title="Edit">
              <span
                className="text-primary d-inline-block edit-item-btn cursor-pointer"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  handleCustomerClick(customerData);
                }}
              >
                <i className="ri-pencil-fill fs-16"></i>
              </span>
            </li>
            <li className="list-inline-item" title="Remove">
              <span
                className="text-danger d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  onClickDelete(customerData);
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </span>
            </li>
          </ul>
        );
      },
    },
  ];
};

export default documentsListTableFields;
