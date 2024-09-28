import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

// Formik Validation
import { useFormik } from 'formik';
import * as Yup from 'yup';

//redux
import { useDispatch, useSelector } from 'react-redux';

import avatar from '../../assets/images/users/avatar-1.jpg';
// actions
import { createSelector } from 'reselect';
import Loader from '../../Components/Common/Loader';
import { useProfile } from '../../Components/Hooks/UserHooks';
import {
  editProfileForAdmin,
  editProfileForPartner,
  resetProfileFlag,
} from '../../slices/thunks';

const UserProfile = () => {
  const { userProfile } = useProfile();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('admin@gmail.com');
  const [idx, setIdx] = useState('1');
  const [userName, setUserName] = useState('Admin');

  const selectLayoutState = (state) => state.Profile;
  const userprofileData = createSelector(selectLayoutState, (state) => ({
    user: state.user,
    success: state.success,
    error: state.error,
    loading: state.loading,
  }));

  // Inside your component
  const { user, success, error, loading } = useSelector(userprofileData);
  console.log('loading: ', loading);

  useEffect(() => {
    if (sessionStorage.getItem('authUser')) {
      const obj = JSON.parse(sessionStorage.getItem('authUser'));

      if (!isEmpty(user)) {
        obj.first_name = user.first_name;
        sessionStorage.removeItem('authUser');
        sessionStorage.setItem('authUser', JSON.stringify(obj));
      }

      setUserName(obj.name);
      setEmail(obj.email);
      setIdx(obj.id || '1');

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, user]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userName || 'Admin',
      old_password: '',
      new_password: '',
      confirm_password: '',
      idx: idx || '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('Please Enter Your UserName'),
      old_password: Yup.string().required('Please Enter Your Old Password'),
      new_password: Yup.string()
        .required('Please Enter Your New Password')
        .min(8, 'New Password must be at least 8 characters'),
      confirm_password: Yup.string()
        .required('Please Confirm Your New Password')
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      const payload = {
        name: values.first_name,
        password: values.new_password,
        old_password: values.old_password,
      };
      let response;
      if (
        userProfile.role.some((role) => role.toLowerCase().includes('admin'))
      ) {
        response = await dispatch(editProfileForAdmin(payload));
      } else {
        response = await dispatch(editProfileForPartner(payload));
      }
      console.log('response: ', response);
      if (response) {
        validation.setFieldValue('old_password', '', false);
        validation.setFieldValue('new_password', '', false);
        validation.setFieldValue('confirm_password', '', false);
        const obj = JSON.parse(sessionStorage.getItem('authUser'));
        setUserName(obj.name);
        setEmail(obj.email);
        setIdx(obj.id || '1');
      }
    },
  });

  document.title = 'Profile | Velzon - React Admin & Dashboard Template';
  return (
    <React.Fragment>
      <div className="page-content mt-lg-5">
        <Container fluid>
          <Row>
            <Col lg="12">
              {error && <Alert color="danger">{error.toString()}</Alert>}
              {success && (
                <Alert color="success">Profile Updated Successfully</Alert>
              )}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="mx-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>{userName || 'Admin'}</h5>
                        <p className="mb-1">Email Id : {email}</p>
                        <p className="mb-0">Id No : #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Change User Name & Password</h4>

          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <FormGroup className="mb-3">
                  <Label className="form-label">User Name</Label>
                  <Input
                    name="first_name"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name || ''}
                    invalid={
                      validation.touched.first_name &&
                      validation.errors.first_name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.first_name &&
                  validation.errors.first_name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.first_name}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label className="form-label">Old Password</Label>
                  <Input
                    name="old_password"
                    type="password"
                    className="form-control"
                    placeholder="Enter Old Password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.old_password || ''}
                    invalid={
                      validation.touched.old_password &&
                      validation.errors.old_password
                        ? true
                        : false
                    }
                  />
                  {validation.touched.old_password &&
                  validation.errors.old_password ? (
                    <FormFeedback type="invalid">
                      {validation.errors.old_password}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label className="form-label">New Password</Label>
                  <Input
                    name="new_password"
                    type="password"
                    className="form-control"
                    placeholder="Enter New Password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.new_password || ''}
                    invalid={
                      validation.touched.new_password &&
                      validation.errors.new_password
                        ? true
                        : false
                    }
                  />
                  {validation.touched.new_password &&
                  validation.errors.new_password ? (
                    <FormFeedback type="invalid">
                      {validation.errors.new_password}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label className="form-label">Confirm Password</Label>
                  <Input
                    name="confirm_password"
                    type="password"
                    className="form-control"
                    placeholder="Confirm New Password"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.confirm_password || ''}
                    invalid={
                      validation.touched.confirm_password &&
                      validation.errors.confirm_password
                        ? true
                        : false
                    }
                  />
                  {validation.touched.confirm_password &&
                  validation.errors.confirm_password ? (
                    <FormFeedback type="invalid">
                      {validation.errors.confirm_password}
                    </FormFeedback>
                  ) : null}
                </FormGroup>
                <div className="text-center mt-4">
                  <Button
                    type="submit"
                    className={`btn btn-success position-relative d-flex justify-content-center ${
                      loading && 'opacity-75'
                    }`}
                    disabled={loading}
                  >
                    {loading && (
                      <span className="position-absolute loader-wrapper">
                        <Loader error={null} />
                      </span>
                    )}
                    Update Profile
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
