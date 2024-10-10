import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import userDummy from '../../assets/images/users/user-dummy-img.jpg';
// actions
import { createSelector } from 'reselect';
import { useProfile } from '../../Components/Hooks/UserHooks';
import {
  editProfileForAdmin,
  editProfileForUser,
  resetProfileFlag,
} from '../../slices/thunks';

const UserProfile = () => {
  const { userProfile } = useProfile();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('admin@gmail.com');
  const [idx, setIdx] = useState('1');
  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('Admin');

  const selectLayoutState = (state) => state.Profile;
  const userprofileData = createSelector(selectLayoutState, (state) => ({
    user: state.user,
    success: state.success,
    error: state.error,
    loading: state.loading,
  }));

  // Inside your component
  const { user, success, error, loading } = useSelector(userprofileData);

  useEffect(() => {
    if (sessionStorage.getItem('authUser')) {
      const obj = JSON.parse(sessionStorage.getItem('authUser'));

      if (!isEmpty(user)) {
        obj.firstName = user.firstName;
        obj.lastName = user.lastName;
        sessionStorage.removeItem('authUser');
        sessionStorage.setItem('authUser', JSON.stringify(obj));
      }

      setFirstName(obj.firstName);
      setLastName(obj.lastName);
      setEmail(obj.email);
      setIdx(obj._id || '1');

      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, user]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: firstName || 'Admin',
      lastName: lastName || 'Admin',
      old_password: '',
      new_password: '',
      confirm_password: '',
      idx: idx || '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Please Enter Your UserName'),
      lastName: Yup.string().required('Please Enter Your LastName'),
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
        firstName: values.firstName,
        lastName: values.lastName,
        password: values.new_password,
        old_password: values.old_password,
      };
      let response;
      if (
        userProfile.role.some((role) => role.toLowerCase().includes('admin'))
      ) {
        response = await dispatch(editProfileForAdmin(payload));
      } else {
        response = await dispatch(editProfileForUser(payload));
      }
      if (response) {
        validation.setFieldValue('old_password', '', false);
        validation.setFieldValue('new_password', '', false);
        validation.setFieldValue('confirm_password', '', false);
        const obj = JSON.parse(sessionStorage.getItem('authUser'));
        setFirstName(obj.firstName);
        setLastName(obj.lastName);
        setEmail(obj.email);
        setIdx(obj.id || '1');
      }
    },
  });

  document.title = 'Profile | Documents Uploader';
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
                        src={userDummy}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center">
                      <div className="text-muted">
                        <h5>
                          {firstName || 'Admin'}
                          {lastName ? `-${lastName}` : ''}
                        </h5>
                        <p className="mb-1">Email Id : {email}</p>
                        <p className="mb-0">Id No : #{idx}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">User</h4>

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
                  <Label className="form-label">First Name</Label>
                  <Input
                    name="firstName"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.firstName || ''}
                    invalid={
                      validation.touched.firstName &&
                      validation.errors.firstName
                        ? true
                        : false
                    }
                    disabled={true}
                  />
                  {validation.touched.firstName &&
                  validation.errors.firstName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.firstName}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label className="form-label">Last Name</Label>
                  <Input
                    name="lastName"
                    className="form-control"
                    placeholder="Enter User Name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.lastName || ''}
                    invalid={
                      validation.touched.lastName && validation.errors.lastName
                        ? true
                        : false
                    }
                    disabled={true}
                  />
                  {validation.touched.lastName && validation.errors.lastName ? (
                    <FormFeedback type="invalid">
                      {validation.errors.lastName}
                    </FormFeedback>
                  ) : null}
                  <Input name="idx" value={idx} type="hidden" />
                </FormGroup>
                {/* <FormGroup className="mb-3">
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
                </FormGroup> */}
                {/* <div className="text-center mt-4">
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
                </div> */}
              </Form>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserProfile;
