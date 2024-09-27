import moment from 'moment';
import React from 'react';

const bookingListTableFields = (Status, checkBookings, displayInvoice) => {
  return [
    {
      id: '#',
      accessorKey: 'id',
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      header: 'Ground Name',
      accessorKey: 'ground_name',
      enableColumnFilter: false,
    },
    {
      header: 'Booking Date',
      accessorKey: 'booking_date',
      enableColumnFilter: false,
      cell: (cell) => {
        const rowData = cell.row.original;
        return (
          <div className="d-flex align-items-center">
            {moment(rowData.booking_date).format('DD-MM-YYYY')}
          </div>
        );
      },
    },
    {
      header: 'Booked By Name',
      enableColumnFilter: false,
      cell: (cell) => {
        const rowData = cell.row.original;
        return (
          <div className="d-flex align-items-center">
            {rowData?.is_booking_by_partner
              ? rowData?.payment?.info?.name
              : rowData?.user?.name}
          </div>
        );
      },
    },
    {
      header: 'Booked By Email',
      enableColumnFilter: false,
      cell: (cell) => {
        const rowData = cell.row.original;
        return (
          <div className="d-flex align-items-center">
            {!rowData?.is_booking_by_partner ? rowData?.user?.email : '-'}
          </div>
        );
      },
    },
    {
      header: 'Booked By Phone',
      enableColumnFilter: false,
      cell: (cell) => {
        const rowData = cell.row.original;
        return (
          <div className="d-flex align-items-center">
            {rowData?.is_booking_by_partner
              ? rowData?.payment?.info?.mobile_number
              : '-'}
          </div>
        );
      },
    },
    {
      header: 'Booked Soltes Count',
      enableColumnFilter: false,
      cell: (cell) => {
        const rowData = cell.row.original;
        return (
          <div className="d-flex align-items-center">
            {rowData?.booking_slots?.length}
          </div>
        );
      },
    },
    {
      header: 'Is Booking Cancelled',
      accessorKey: 'is_cancelled',
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
            <li className="list-inline-item" title="bookings">
              <span
                className="d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const groundData = cellProps.row.original;
                  checkBookings(groundData);
                }}
              >
                <i className="ri-eye-fill fs-16"></i>
              </span>
            </li>
            <li className="list-inline-item" title="bookings">
              <span
                className="d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const groundData = cellProps.row.original;
                  displayInvoice(groundData);
                }}
              >
                <i className="ri-bill-fill fs-16"></i>
              </span>
            </li>
          </ul>
        );
      },
    },
  ];
};

export default bookingListTableFields;
