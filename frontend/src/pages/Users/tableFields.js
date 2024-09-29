import React from 'react';

const usersListTableFields = (IsVerified, handleCustomerClick) => {
  return [
    // {
    //   id: '#',
    //   accessorKey: '_id',
    //   enableColumnFilter: false,
    //   enableSorting: false,
    // },
    {
      header: 'First Name',
      accessorKey: 'firstName',
      enableColumnFilter: false,
    },
    {
      header: 'Last Name',
      accessorKey: 'lastName',
      enableColumnFilter: false,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      enableColumnFilter: false,
      cell: (cell) => {
        return (
          <div className="d-flex align-items-center">
            {cell.getValue() ? (
              <>
                <a href={`mailto:${cell.getValue()}`} className="clickable">
                  {cell.getValue()}
                </a>
              </>
            ) : (
              '-'
            )}
          </div>
        );
      },
    },
    {
      header: 'Role',
      accessorKey: 'role',
      enableColumnFilter: false,
      cell: (cell) => {
        const roles = cell.getValue();
        return (
          <div className="d-flex align-items-center">
            {Array.isArray(roles) && roles.length > 0 ? roles.join(', ') : '-'}
          </div>
        );
      },
    },
    {
      header: 'Is Active',
      accessorKey: 'isActive',
      enableColumnFilter: false,
      cell: (cell) => {
        return <IsVerified {...cell} />;
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
          </ul>
        );
      },
    },
  ];
};

export default usersListTableFields;
