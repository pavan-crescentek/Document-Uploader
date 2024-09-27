import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import { Col, OffcanvasBody, Row } from 'reactstrap';
import { createSelector } from 'reselect';
import SimpleBar from 'simplebar-react';
import * as Yup from 'yup';
import Loader from '../../../Components/Common/Loader';
import { bookAvailableSlotByPartner } from '../../../slices/thunks';
import './grounds.css';

const validationSchema = Yup.object({
  userName: Yup.string().required('Customer name is required'),
  mobile_number: Yup.number()
    .required('Mobile number is required')
    .test('valid-mobile', 'Invalid mobile number', (value) => {
      return /^[0-9]{10}$/.test(value);
    }),
  selectedSlots: Yup.array().min(1, 'At least one time slot must be selected'),
  payment_method: Yup.string().required('Payment method is required'),
});

const AvailableTimeSlotForBooking = ({
  data,
  getDifferentDateSlots,
  toggleRightCanvas,
  selectedGround,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const dispatch = useDispatch();

  const selectLayoutState = (state) => ({
    grounds: state.Grounds,
  });

  const groundsProperties = createSelector(
    selectLayoutState,
    ({ grounds }) => ({
      loading: grounds.loading,
    })
  );

  const { loading } = useSelector(groundsProperties);

  useEffect(() => {
    getDifferentDateSlots(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const amount = selectedSlots.reduce((sum, slotId) => {
      const slot = data.find((slot) => slot.id === slotId);
      const price = Number(slot ? slot.price : 0);
      return sum + price;
    }, 0);
    setTotalAmount(amount);
  }, [selectedSlots, data]);

  const handleSlotSelect = (slot) => {
    if (slot.isBooked) return;

    let newSlotArray;

    setSelectedSlots((prevSelectedSlots) => {
      if (prevSelectedSlots.includes(slot.id)) {
        newSlotArray = prevSelectedSlots.filter((id) => id !== slot.id);
        return prevSelectedSlots.filter((id) => id !== slot.id);
      } else {
        newSlotArray = [...prevSelectedSlots, slot.id];
        return [...prevSelectedSlots, slot.id];
      }
    });
    return newSlotArray;
  };

  const handleSubmit = async (values) => {
    const payload = {
      ground_id: selectedGround,
      booking_date: moment(selectedDate).format('YYYY/MM/DD'),
      ground_slot_ids: selectedSlots,
      payment_method: values.payment_method,
      amount: totalAmount,
      customer_info: {
        name: values.userName,
        mobile_number: values.mobile_number,
      },
    };
    const isBookingSuccessFul = await dispatch(
      bookAvailableSlotByPartner(payload)
    );
    if (isBookingSuccessFul) {
      setSelectedSlots([]);
      toggleRightCanvas();
    }
  };

  const handleCancel = () => {
    setSelectedSlots([]);
    toggleRightCanvas();
  };

  return (
    <OffcanvasBody
      className="p-0 overflow-hidden"
      style={{ maxHeight: '100%' }}
    >
      <SimpleBar style={{ height: '100%' }}>
        <div className="activity-timeline">
          <Formik
            initialValues={{
              userName: '',
              mobile_number: '',
              selectedSlots: selectedSlots,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              values.selectedSlots = selectedSlots;
              handleSubmit(values);
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="px-4 pt-2">
                  <Row className="mb-3">
                    <Col md={3} className="form-group">
                      <label htmlFor="userName">Select The Date</label>
                      <Flatpickr
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date[0])}
                        className="form-control"
                        placeholder="Select Date"
                        options={{
                          dateFormat: 'Y-m-d',
                          minDate: 'today',
                        }}
                        style={{ marginBottom: '1rem' }}
                      />
                    </Col>

                    <Col md={3} className="form-group">
                      <label htmlFor="userName">Name</label>
                      <Field
                        name="userName"
                        type="text"
                        className="form-control"
                        placeholder="Enter customer name"
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <ErrorMessage
                        name="userName"
                        component="div"
                        className="error text-danger"
                      />
                    </Col>

                    <Col md={3} className="form-group">
                      <label htmlFor="mobile_number">Mobile Number</label>
                      <Field
                        name="mobile_number"
                        type="text"
                        className="form-control"
                        placeholder="Enter customer mobile number"
                        style={{ marginBottom: '0.5rem' }}
                      />
                      <ErrorMessage
                        name="mobile_number"
                        component="div"
                        className="error text-danger"
                      />
                    </Col>

                    <Col md={3} className="form-group">
                      <label>Payment Method</label>
                      <div
                        role="group"
                        aria-labelledby="payment_method"
                        className="d-flex"
                      >
                        <div className="form-check">
                          <Field
                            type="radio"
                            name="payment_method"
                            value="cash"
                            className="form-check-input"
                            id="payment_cash"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="payment_cash"
                          >
                            Cash
                          </label>
                        </div>
                        <div className="form-check onlineDiv">
                          <Field
                            type="radio"
                            name="payment_method"
                            value="online"
                            className="form-check-input"
                            id="payment_online"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="payment_online"
                          >
                            Online
                          </label>
                        </div>
                      </div>
                      <ErrorMessage
                        name="payment_method"
                        component="div"
                        className="error text-danger"
                      />
                    </Col>
                  </Row>

                  <Row md={12} lg={12} xl={12}>
                    {data.map((slot) => (
                      <Col md={6} lg={4} xl={3} key={slot.id} className="mb-3">
                        <div
                          className={`time-slot ${slot.isBooked ? 'booked' : ''
                            } ${selectedSlots.includes(slot.id) ? 'selected' : ''}`}
                          onClick={() => {
                            if (!slot.is_booked) {
                              const newSelectedSlots = handleSlotSelect(slot);
                              setFieldValue('selectedSlots', newSelectedSlots);
                            }
                          }}
                          style={{
                            cursor: slot.is_booked ? 'not-allowed' : 'pointer',
                            padding: '0.5rem',
                            border: selectedSlots.includes(slot.id)
                              ? '1px solid black'
                              : '1px solid #dee2e6',
                            borderRadius: '4px',
                            textAlign: 'center',
                            opacity: slot.is_booked ? 0.6 : '',
                          }}
                        >
                          <div>
                            <div>
                              <span>
                                <b>Time: </b>
                                {slot.slot}
                              </span>
                            </div>
                            <div className="text-start">
                              <span>
                                <b>Price:</b> {slot.price}
                              </span>
                            </div>
                          </div>

                          {selectedSlots.includes(slot.id) && (
                            <span className="checkmark">✓</span>
                          )}
                        </div>
                      </Col>
                    ))}
                    <Col xs={12}>
                      <ErrorMessage
                        name="selectedSlots"
                        component="div"
                        className="error text-danger"
                      />
                    </Col>
                  </Row>
                </div>
                <div className="offcanvas-foorter border-top p-3 text-center actionButons">
                  <button
                    type="button"
                    className="btn btn-light margin-right-20px"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-success position-relative d-flex justify-content-center 
                      ${loading && 'opacity-75'}
                    `}
                    disabled={loading}
                  >
                    {loading && (
                      <span className="position-absolute loader-wrapper">
                        <Loader error={null} />
                      </span>
                    )}
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </SimpleBar>
    </OffcanvasBody>
  );
};

export default AvailableTimeSlotForBooking;
