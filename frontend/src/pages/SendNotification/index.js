import React from 'react';
import {
  Card,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

import './sendNotification.css';

//Import Breadcrumb
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import Loader from '../../Components/Common/Loader';
import { sendNotification } from '../../slices/thunks';
import {
  sendNotificationFieldsInitialValues,
  sendNotificationFormFields,
  sendNotificationFormFieldsValidation,
} from './formsFields';

const SendNotification = () => {
  const dispatch = useDispatch();
  const selectLayoutState = (state) => ({
    sendNotification: state.SendNotification,
  });

  const notificationProperties = createSelector(
    selectLayoutState,
    ({ sendNotification }) => ({
      loading: sendNotification.loading,
      error: sendNotification.error,
    })
  );

  const { error, loading } = useSelector(notificationProperties);

  document.title =
    'Send Notification | Velzon - React Admin & Dashboard Template';

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: sendNotificationFieldsInitialValues(),
    validationSchema: sendNotificationFormFieldsValidation,

    onSubmit: async (values) => {
      const notificationData = {
        title: values.title || '',
        message: values.message || '',
      };
      const result = await dispatch(sendNotification(notificationData));

      if (!result) {
        return;
      }
      validation.resetForm();
    },
  });
  const fields = sendNotificationFormFields();
  const renderFields = (fieldNames) => {
    return (
      <>
        {fieldNames.map((name, index) => {
          const field = fields.find((field) => field.name === name);
          return (
            <Col md={12} key={index}>
              <FormGroup className="mb-3">
                <Label htmlFor={`${field.name}-field`} className="form-label">
                  {field.label}
                </Label>
                {field.type === 'textarea' ? (
                  <Input
                    name={field.name}
                    id={`${field.name}-field`}
                    className="form-control class-for-textarea"
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values[field.name] || ''}
                    invalid={
                      validation.touched[field.name] &&
                      validation.errors[field.name]
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Input
                    name={field.name}
                    id={`${field.name}-field`}
                    className="form-control"
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values[field.name] || ''}
                    invalid={
                      validation.touched[field.name] &&
                      validation.errors[field.name]
                        ? true
                        : false
                    }
                  />
                )}
                {validation.touched[field.name] &&
                validation.errors[field.name] ? (
                  <FormFeedback type="invalid">
                    {validation.errors[field.name]}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </Col>
          );
        })}
      </>
    );
  };
  const renderFieldsData = [renderFields(['title', 'message'])];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Send Notification" />
          <Row>
            <Col lg={12}>
              <Card id="sendNootification">
                <div className="card-body pt-10">
                  <Form
                    className="tablelist-form"
                    onSubmit={validation.handleSubmit}
                  >
                    {renderFieldsData.length &&
                      renderFieldsData.map((renderFields) => (
                        <Row className="m-0">{renderFields}</Row>
                      ))}
                    <div className=" border-top p-3 text-center actionButons">
                      <button
                        type="submit"
                        className={`btn btn-success position-relative d-flex justify-content-center 
                          ${loading && 'opacity-75'}
                        `}
                      >
                        {loading && (
                          <span className="position-absolute loader-wrapper">
                            <Loader error={null} />
                          </span>
                        )}
                        Send Notification
                      </button>
                    </div>
                  </Form>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SendNotification;
