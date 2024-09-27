import React from 'react';
import { api } from '../../config';

const categoryListTableFields = (
  Status,
  handleCustomerClick,
  onClickDelete
) => {
  return [
    {
      id: '#',
      accessorKey: 'id',
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      enableColumnFilter: false,
    },
    {
      header: 'Status',
      accessorKey: 'active',
      enableColumnFilter: false,
      cell: (cell) => {
        return <Status {...cell} />;
      },
    },
    {
      header: 'Logo',
      accessorKey: 'image',
      enableColumnFilter: false,
      cell: (cellProps) => {
        const imgName = cellProps.row.original.image;
        const imgPath = `${api.API_URL}/public/categories_images/${imgName}`;
        return <img src={imgPath} alt="Preview" className="img-thumbnail" />;
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

export default categoryListTableFields;
