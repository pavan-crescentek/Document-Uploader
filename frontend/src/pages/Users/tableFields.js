import React from 'react';

const usersListTableFields = (IsVerified) => {
  return [
    // {
    //   id: '#',
    //   accessorKey: 'id',
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
  ];
};

export default usersListTableFields;
