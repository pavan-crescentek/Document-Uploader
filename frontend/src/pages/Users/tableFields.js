import { emojiCountryCode } from 'country-code-emoji';
import React from 'react';
import Flag from 'react-flagkit';

const usersListTableFields = (Status, IsVerified) => {
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
      header: 'Phone Number',
      accessorKey: 'phone_number',
      enableColumnFilter: false,
      cell: (cell) => {
        const rowData = cell.row.original;
        const countryCode = rowData.country_code;
        return (
          <div className="d-flex align-items-center">
            {cell.getValue() ? (
              <>
                <a
                  href={`tel:+${countryCode}${cell.getValue()}`}
                  className="clickable"
                >
                  +{countryCode}-<span className="">{cell.getValue()}</span>
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
      header: 'Country',
      accessorKey: 'country_name',
      enableColumnFilter: false,
      cell: (cell) => {
        const rowData = cell.row.original;
        const countryCode = [rowData.emoji].map(emojiCountryCode);
        return (
          <div className="d-flex align-items-center">
            <Flag country={countryCode[0]} size={15} />
            <span className="ms-2">{cell.getValue()}</span>
          </div>
        );
      },
    },
    {
      header: 'State',
      accessorKey: 'state_name',
      enableColumnFilter: false,
    },
    {
      header: 'City',
      accessorKey: 'city_name',
      enableColumnFilter: false,
    },
    {
      header: 'Is Verified',
      accessorKey: 'is_verified',
      enableColumnFilter: false,
      cell: (cell) => {
        return <IsVerified {...cell} />;
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
  ];
};

export default usersListTableFields;
