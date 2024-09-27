import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from 'reactstrap';
import { createSelector } from 'reselect';
import { getAllCountries, getIndividualGroundData } from '../../slices/thunks';

const InvoiceDetails = ({ data, closeModal }) => {
  const dispatch = useDispatch();
  const [groundData, setGroundData] = useState();

  const selectLayoutState = (state) => ({
    grounds: state.Grounds,
  });

  const groundsProperties = createSelector(
    selectLayoutState,
    ({ grounds }) => ({
      countriesList: grounds.countriesList,
    })
  );

  const { countriesList } = useSelector(groundsProperties);

  // Print the Invoice
  const printInvoice = () => {
    window.print();
  };

  useEffect(() => {
    if (!data?.ground_id) {
      return;
    }

    dispatch(getAllCountries());

    const fetchGroundData = async () => {
      try {
        const response = await dispatch(
          getIndividualGroundData(data.ground_id)
        );
        setGroundData(response);
      } catch (error) {
        setGroundData(null);
      }
    };

    fetchGroundData();
  }, [data?.ground_id, dispatch]);

  document.title =
    'Invoice Details | Velzon - React Admin & Dashboard Template';

  return (
    <div className="page-content px-0 pt-2 pb-0">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xxl={12}>
            <Card id="demo" style={{ boxShadow: 'none' }}>
              <Row id="invoice-to-print">
                <Col lg={12}>
                  <CardHeader className="border-bottom-dashed">
                    <div className="d-sm-flex">
                      <div className="flex-grow-1">
                        <div className="">
                          <h1 className="mb-1" id="address-details">
                            {data?.ground_name}
                          </h1>
                        </div>
                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        <h6>
                          <span className="text-muted fw-normal">
                            Legal Registration No:
                          </span>{' '}
                          <span id="legal-register-no">{groundData?.id}</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Email:</span>{' '}
                          <span id="email">{groundData?.email}</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Website:</span>{' '}
                          <Link
                            to={groundData?.website || '#'}
                            className="link-primary"
                            id="website"
                          >
                            {groundData?.website}
                          </Link>
                        </h6>
                        <h6 className="mb-0">
                          <span className="text-muted fw-normal">
                            Contact No:
                          </span>{' '}
                          <span id="contact-no">
                            {' '}
                            {countriesList &&
                              countriesList.length > 0 &&
                              `+${countriesList[0]?.phone_code}-`}
                            {groundData?.mobile_number}
                          </span>
                        </h6>
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <Row className="g-3">
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Invoice No
                        </p>
                        <h5 className="fs-14 mb-0">
                          <span id="invoice-no">
                            #
                            {moment(data?.booking_date, 'YYYY-MM-DD').format(
                              'DDMM'
                            ) + data?.id}
                          </span>
                        </h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Date
                        </p>
                        <h5 className="fs-14 mb-0">
                          <span id="invoice-date">
                            {data?.booking_date
                              ? moment(data?.booking_date).format(
                                  'DD MMM, YYYY'
                                )
                              : '-'}
                          </span>
                        </h5>
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Booking Status
                        </p>
                        {data?.is_cancelled ? (
                          <span className="badge bg-warning-subtle text-warning text-uppercase">
                            Cancelled
                          </span>
                        ) : (
                          <span className="badge bg-success-subtle text-success text-uppercase">
                            Confirmed
                          </span>
                        )}
                      </Col>
                      <Col lg={3} xs={6}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          Total Amount
                        </p>
                        <h5 className="fs-14 mb-0">
                          <span id="total-amount">
                            {data?.payment?.amount || '-'}
                          </span>
                        </h5>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4">
                    <div className="table-responsive">
                      <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                        <thead>
                          <tr className="table-active">
                            <th scope="col" style={{ width: '50px' }}>
                              #
                            </th>
                            <th scope="col" className="text-start">
                              Slot Timing
                            </th>
                            <th scope="col" className="text-end">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody id="products-list">
                          {data?.booking_slots &&
                            data?.booking_slots.length > 0 &&
                            data?.booking_slots.map((singleSlot, index) => {
                              return (
                                <tr key={index}>
                                  <th scope="row">
                                    {singleSlot.ground_slot_id}
                                  </th>
                                  <td className="text-start">
                                    <span className="fw-medium">
                                      {singleSlot.slot}
                                    </span>
                                  </td>
                                  <td className="text-end">
                                    {singleSlot.price}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </div>
                    <div className="border-top border-top-dashed mt-2">
                      <Table
                        className="table table-borderless table-nowrap align-middle mb-0 ms-auto"
                        style={{ width: '250px' }}
                      >
                        <tbody>
                          <tr>
                            <td>Sub Total</td>
                            <td className="text-end">
                              {data?.payment?.amount}
                            </td>
                          </tr>
                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">Total Amount</th>
                            <th className="text-end">
                              {data?.payment?.amount}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="mt-3">
                      <h6 className="text-muted text-uppercase fw-semibold mb-3">
                        Payment Details:
                      </h6>
                      <p className="text-muted mb-1">
                        Payment Method:{' '}
                        <span className="fw-medium" id="payment-method">
                          {data?.payment?.payment_method}
                        </span>
                      </p>
                      <p className="text-muted mb-1">
                        Customer Name:{' '}
                        <span className="fw-medium" id="card-holder-name">
                          {data?.is_booking_by_partner
                            ? data?.payment?.info?.name
                            : data?.user?.name}
                        </span>
                      </p>
                      <p className="text-muted mb-1">
                        {data?.is_booking_by_partner
                          ? `Customer Phone:${' '}`
                          : `Customer Email:${' '}`}
                        <span className="fw-medium" id="card-number">
                          {data?.is_booking_by_partner
                            ? data?.payment?.info?.mobile_number
                            : data?.user?.email}
                        </span>
                      </p>
                      <p className="text-muted">
                        Total Amount:{' '}
                        <span className="fw-medium" id="total-amount-final">
                          {data?.payment?.amount}
                        </span>
                      </p>
                    </div>
                  </CardBody>
                </Col>
              </Row>
              <div className="modal-footer no-print">
                <Button onClick={printInvoice} className="btn btn-success">
                  <i className="ri-printer-line align-bottom me-1"></i> Print
                </Button>
                <Button color="danger" onClick={() => closeModal()}>
                  Close
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvoiceDetails;
