const groundTableFields = (
  category,
  Status,
  handleCustomerClick,
  onClickDelete,
  editTimeSlot,
  displyBookings,
  bookSlot
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
      header: 'Details',
      accessorKey: 'details',
      enableColumnFilter: false,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      enableColumnFilter: false,
    },
    {
      header: 'Mobile',
      accessorKey: 'mobile_number',
      enableColumnFilter: false,
    },
    {
      header: 'Address',
      accessorKey: 'address',
      enableColumnFilter: false,
    },
    {
      header: 'Category',
      accessorKey: 'cat_id',
      enableColumnFilter: false,
      cell: (cellProps) => {
        const categoryId = cellProps.getValue();
        const categories = category.find((cat) => cat.id == categoryId);
        const categoryName = categories ? categories.name : '-';
        return <span>{categoryName}</span>;
      },
    },
    {
      header: 'Status',
      accessorKey: 'active',
      enableColumnFilter: false,
      cell: (cell) => {
        return Status({ ...cell });
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
                  const groundData = cellProps.row.original;
                  handleCustomerClick(groundData);
                }}
              >
                <i className="ri-pencil-fill fs-16"></i>
              </span>
            </li>
            <li className="list-inline-item" title="Delete">
              <span
                className="text-danger d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const groundData = cellProps.row.original;
                  onClickDelete(groundData);
                }}
              >
                <i className="ri-delete-bin-5-fill fs-16"></i>
              </span>
            </li>
            <li className="list-inline-item" title="Slot">
              <span
                className="d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const groundData = cellProps.row.original;
                  editTimeSlot(groundData);
                }}
              >
                <i className=" ri-timer-flash-fill fs-16"></i>
              </span>
            </li>
            <li className="list-inline-item" title="Bookings">
              <span
                className="d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const groundData = cellProps.row.original;
                  displyBookings(groundData);
                }}
              >
                <i className="ri-eye-fill fs-16"></i>
              </span>
            </li>
            <li className="list-inline-item" title="Slot">
              <span
                className="d-inline-block remove-item-btn cursor-pointer"
                onClick={() => {
                  const groundData = cellProps.row.original;
                  bookSlot(groundData);
                }}
              >
                <i className="ri-bookmark-3-fill fs-16"></i>
              </span>
            </li>
          </ul>
        );
      },
    },
  ];
};

export default groundTableFields;
