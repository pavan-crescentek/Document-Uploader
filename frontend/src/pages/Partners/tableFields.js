import React from 'react';

const partnerListTableFields = (
  Status,
  handleCustomerClick,
  onClickDelete,
  addEditBankDetailsFunction
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
      header: 'Email',
      accessorKey: 'email',
      enableColumnFilter: false,
    },
    {
      header: 'Commission',
      accessorKey: 'commission_percentage',
      enableColumnFilter: false,
      cell: (cell) => {
        return (
          <div className="d-flex align-items-center">
            <span className="">
              {cell.getValue() ? cell.getValue() + '%' : '-'}
            </span>
          </div>
        );
      },
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
            <li className="list-inline-item" title="Remove">
              <span
                className="text-primary d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  addEditBankDetailsFunction({
                    ...customerData.bank_details,
                    user_id: customerData.id,
                  });
                }}
              >
                <i className="ri-bank-fill fs-16"></i>
              </span>
            </li>
          </ul>
        );
      },
    },
  ];
};

export default partnerListTableFields;
