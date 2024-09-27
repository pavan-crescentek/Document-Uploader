import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';

import { isNull } from 'lodash';

import './bookingTable.css';

//Import Breadcrumb
import BreadCrumb from '../../../Components/Common/BreadCrumb';

//redux
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '../../../Components/Common/TableContainer';

import moment from 'moment';
import { createSelector } from 'reselect';
import Loader from '../../../Components/Common/Loader';
import OffCanvas from '../../../Components/Common/OffCanvas';
import { getBookingListData } from '../../../slices/thunks';
import DisplayInvoice from './invoiceModal';
import bookingListTableFields from './tableFields';

const BookingList = ({ backToGround = null, bookingData = null }) => {
  const dispatch = useDispatch();
  const [bookingsList, setBookingsList] = useState([]);
  const [selectedBookedData, setSelectedBookedData] = useState();
  const [selectedBookedFullGroundDetail, setSelectedBookedFullGroundDetail] =
    useState();
  const [isOpenedOffCanvase, setIsOpenedOffCanvase] = useState(false);
  const [isDisplayInvoiceModal, setIsDisplayInvoiceModal] = useState(false);

  const selectLayoutState = (state) => ({
    bookingList: state.BookingList,
  });
  const BookingsListProperties = createSelector(
    selectLayoutState,
    ({ bookingList }) => ({
      bookingListData: bookingList.bookingListData,
      error: bookingList.error,
      loading: bookingList.loading,
    })
  );
  // Inside your component
  const { bookingListData, error, loading } = useSelector(
    BookingsListProperties
  );

  useEffect(() => {
    if (bookingsList && isNull(bookingData) && isNull(backToGround)) {
      dispatch(getBookingListData());
    }
  }, [dispatch]);
  // useEffect(() => {
  //   if (!isNull(bookingData)&&bookingData?.length > 0) {
  //     setBookingsList(bookingData);
  //   }
  // }, [bookingData]);

  useEffect(() => {
    setBookingsList(bookingListData);
    if (
      !isNull(bookingData) &&
      !isNull(backToGround) &&
      bookingData?.length > 0
    ) {
      setBookingsList(bookingData);
    }
  }, [bookingListData]);

  useEffect(() => {
    if (!selectedBookedData) {
      setSelectedBookedData([]);
    }
  }, [selectedBookedData]);

  const Status = (cell) => {
    return (
      <React.Fragment>
        {cell.getValue() === true ? (
          <span className="badge bg-warning-subtle text-warning text-uppercase">
            Yes
          </span>
        ) : cell.getValue() === false ? (
          <span className="badge bg-success-subtle text-success text-uppercase">
            No
          </span>
        ) : null}
      </React.Fragment>
    );
  };
  const toggleRightCanvas = () => {
    setIsOpenedOffCanvase(!isOpenedOffCanvase);
  };

  const checkBookings = (bookedSlots) => {
    if (bookedSlots) {
      setSelectedBookedData(bookedSlots);
      toggleRightCanvas();
    }
  };

  const displayInvoiceModal = () => {
    setIsDisplayInvoiceModal(!isDisplayInvoiceModal);
    if (isDisplayInvoiceModal) {
      setSelectedBookedFullGroundDetail();
    }
  };

  const displayInvoice = (selectedGroundData) => {
    setSelectedBookedFullGroundDetail(selectedGroundData);
    displayInvoiceModal();
  };

  const getGroundSlotDataData = () => {
    return (
      <ListGroup className="border-dashed p-3" flush>
        {selectedBookedData?.booking_slots?.length > 0 &&
          selectedBookedData?.booking_slots.map((item, key) => (
            <ListGroupItem className="ps-0" key={key}>
              <Row className="align-items-center g-3">
                <Col className="col-auto">
                  <div className="avatar-sm p-1 py-2 h-auto bg-light rounded-3 material-shadow">
                    <div className="text-center">
                      <h5 className="mb-0">
                        {moment(selectedBookedData.booking_date).date()}
                      </h5>
                      <div className="text-muted">
                        {moment(selectedBookedData.booking_date).format('ddd')}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="col">
                  <h5 className="text-muted mt-0 mb-1 fs-13">{item.slot}</h5>
                  <div className="d-flex justify-content-between">
                    <span className="text-reset fs-14 mb-0 d-flex gap-2 align-items-center">
                      <h5 className="text-muted m-0 fs-13">Price:</h5>{' '}
                      {item.price}
                    </span>
                  </div>
                </Col>
              </Row>
            </ListGroupItem>
          ))}
      </ListGroup>
    );
  };

  // Booking Column
  const columns = useMemo(
    () => bookingListTableFields(Status, checkBookings, displayInvoice),
    [bookingsList]
  );

  document.title = 'Bookingd | Velzon - React Admin & Dashboard Template';
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {!isNull(bookingData) ? (
            <button
              onClick={() => {
                backToGround();
              }}
              type="button"
              className="btn btn-light btn-label previestab mb-3"
              data-previous="pills-bill-info-tab"
              style={{ background: '#ebebeb' }}
            >
              <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>
              Back to Grounds
            </button>
          ) : (
            <BreadCrumb title="Bookings" />
          )}
          <Row>
            <Col lg={12}>
              <Card id="BookingList">
                <div className="card-body pt-0">
                  <div>
                    {!loading ? (
                      <TableContainer
                        columns={columns}
                        data={bookingsList || []}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        // handleCustomerClick={handleCustomerClicks}
                        isGlobalFilter={true}
                        title={'Bookings List'}
                        SearchPlaceholder="Search for booking..."
                        // addContentButton={addPartnerbutton}
                        divClass="table-responsive table-card"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light text-muted"
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <OffCanvas
        data={getGroundSlotDataData()}
        title={'Booked Solts'}
        isOpen={isOpenedOffCanvase}
        direction={null}
        toggleFunction={toggleRightCanvas}
      />
      <DisplayInvoice
        groundData={selectedBookedFullGroundDetail}
        displayInvoiceModal={displayInvoiceModal}
        isDisplayInvoiceModal={isDisplayInvoiceModal}
      />
    </React.Fragment>
  );
};

export default BookingList;
