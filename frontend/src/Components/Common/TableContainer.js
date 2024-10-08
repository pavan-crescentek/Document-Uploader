import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardHeader, Col, Row, Table } from 'reactstrap';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';

// Column Filter
const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  const handleClear = () => {
    setValue('');
    onChange('');
  };

  return (
    <div className="position-relative" style={{ maxWidth: '300px' }}>
      <input
        {...props}
        value={value}
        id="search-bar-0"
        className="form-control search"
        onChange={(e) => setValue(e.target.value)}
        style={{
          paddingRight: '26px',
          textOverflow: 'ellipsis',
        }}
        autoComplete="off"
      />
      {value && (
        <button
          className="btn btn-link position-absolute"
          style={{
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '2px 6px',
          }}
          onClick={handleClear}
        >
          <i className="ri-close-circle-fill"></i>
        </button>
      )}
    </div>
  );
};

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isProductsFilter,
  isCustomerFilter,
  isOrderFilter,
  isContactsFilter,
  isCompaniesFilter,
  isLeadsFilter,
  isCryptoOrdersFilter,
  isInvoiceListFilter,
  isTicketsListFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  title,
  addContentButton,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageSize, setPageSize] = useState(customPageSize || 10);
  const [pageIndex, setPageIndex] = useState(0);

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };
  const setPagination = (updater) => {
    if (typeof updater === 'function') {
      const nextState = updater(table.getState().pagination);
      setPageSize(nextState.pageSize);
      setPageIndex(nextState.pageIndex);
    } else {
      setPageSize(updater.pageSize);
      setPageIndex(updater.pageIndex);
    }
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      pagination: {
        pageSize,
        pageIndex,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    nextPage,
    previousPage,
    getState,
  } = table;

  useEffect(() => {
    customPageSize && setPageSize(customPageSize);
  }, [customPageSize]);

  const handlePageSizeChange = (e) => {
    const newPageSize =
      e.target.value === 'all' ? data.length : Number(e.target.value);
    setPageSize(newPageSize);
    setPageIndex(0);
  };

  return (
    <Fragment>
      <Row className="mb-3">
        <form>
          <CardHeader className="border border-dashed border-end-0 border-start-0 border-top-0">
            <Row className="g-4 align-items-center">
              <div className="col-sm">
                <div>
                  <h5 className="card-title mb-0">{title}</h5>
                </div>
              </div>
              {isGlobalFilter && (
                <Col sm={2}>
                  <div
                    className={
                      isProductsFilter ||
                      isContactsFilter ||
                      isCompaniesFilter ||
                      isNFTRankingFilter
                        ? 'search-box me-2 d-inline-block'
                        : 'search-box me-2 d-inline-block col-12'
                    }
                  >
                    <DebouncedInput
                      value={globalFilter ?? ''}
                      onChange={(value) => setGlobalFilter(value)}
                      placeholder={SearchPlaceholder}
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                </Col>
              )}
              <div className="col-sm-auto">
                <div>{addContentButton}</div>
              </div>
            </Row>
          </CardHeader>
        </form>
      </Row>

      <div className={divClass}>
        <Table hover className={tableClass}>
          <thead className={theadClass}>
            {getHeaderGroups().map((headerGroup) => (
              <tr className={trClass} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={thClass}
                    {...{
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <React.Fragment>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ',
                          desc: ' ',
                        }[header.column.getIsSorted()] ?? null}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </React.Fragment>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  <i
                    className="text-muted ri-database-2-fill align-bottom"
                    style={{ fontSize: '24px' }}
                  ></i>
                  <h4 className="text-muted">Data not available</h4>
                </td>
              </tr>
            ) : (
              getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
        <div className="col-sm">
          <div className="text-muted">
            Showing
            <span className="fw-semibold ms-1">
              {pageIndex * pageSize + 1} to{' '}
              {Math.min((pageIndex + 1) * pageSize, data.length)}
            </span>{' '}
            of {data.length} Results
          </div>
        </div>
        <div className="col-sm-auto">
          <select
            className="form-select"
            value={pageSize === data.length ? 'all' : pageSize}
            onChange={handlePageSizeChange}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
            <option value="all">Show All</option>
          </select>
        </div>
        <div className="col-sm-auto">
          <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
            <li
              className={
                !getCanPreviousPage() ? 'page-item disabled' : 'page-item'
              }
            >
              <Link to="#" className="page-link" onClick={previousPage}>
                Previous
              </Link>
            </li>
            {getPageOptions().map((item, key) => (
              <React.Fragment key={key}>
                <li className="page-item">
                  <Link
                    to="#"
                    className={
                      pageIndex === item ? 'page-link active' : 'page-link'
                    }
                    onClick={() => setPageIndex(item)}
                  >
                    {item + 1}
                  </Link>
                </li>
              </React.Fragment>
            ))}
            <li
              className={!getCanNextPage() ? 'page-item disabled' : 'page-item'}
            >
              <Link to="#" className="page-link" onClick={nextPage}>
                Next
              </Link>
            </li>
          </ul>
        </div>
      </Row>
    </Fragment>
  );
};

export default TableContainer;
