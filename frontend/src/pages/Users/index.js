import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Form,
  Input,
  Label,
  OffcanvasBody,
  Row,
} from 'reactstrap';

import './users.css';

//Import Breadcrumb
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useDispatch, useSelector } from 'react-redux';
import OffCanvas from '../../Components/Common/OffCanvas';
import TableContainer from '../../Components/Common/TableContainer';

import { useFormik } from 'formik';
import { createSelector } from 'reselect';
import SimpleBar from 'simplebar-react';
import Loader from '../../Components/Common/Loader';
import RenderFormSingleColumn from '../../Components/Common/RenderFormSingleColumn';
import {
  addNewUserThunk,
  getAllUsersData,
  updateUser,
} from '../../slices/thunks';
import {
  usersFieldsInitialValues,
  usersFormFields,
  usersFormFieldsValidation,
} from './formsFields';
import usersListTableFields from './tableFields';

const UsersList = () => {
  const dispatch = useDispatch();
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [modal, setModal] = useState(false);

  const toggleRightCanvas = () => {
    validation.resetForm();
    setIsRight(!isRight);
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  const selectLayoutState = (state) => state.UsersList;
  const UsersListProperties = createSelector(
    selectLayoutState,
    (usersInfo) => ({
      usersListData: usersInfo.usersList,
      error: usersInfo.error,
      loading: usersInfo.loading,
      addEditLoading: usersInfo.addEditLoading,
    })
  );
  // Inside your component
  const { usersListData, error, loading, addEditLoading } =
    useSelector(UsersListProperties);

  useEffect(() => {
    if (usersList) {
      dispatch(getAllUsersData());
    }
  }, [dispatch]);

  useEffect(() => {
    setUsersList(usersListData);
  }, [usersListData]);

  const Status = (cell) => {
    return (
      <React.Fragment>
        {cell.getValue() === true ? (
          <span className="badge bg-success-subtle text-success text-uppercase">
            Active
          </span>
        ) : cell.getValue() === false ? (
          <span className="badge bg-warning-subtle text-warning text-uppercase">
            Inactive
          </span>
        ) : null}
      </React.Fragment>
    );
  };

  // Update Data
  const handleCustomerClick = useCallback(
    (arg) => {
      const user = arg;
      setSelectedUser({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
      });

      setIsEdit(true);
      toggleRightCanvas();
      // toggle();
    },
    [toggle]
  );

  const handleCustomerClicks = () => {
    setUsersList('');
    setIsEdit(false);
    toggle();
  };

  // Users Column
  const columns = useMemo(
    () => usersListTableFields(Status, handleCustomerClick),
    [handleCustomerClick]
  );

  const statusOption = [
    {
      label: 'Active',
      value: true,
    },
    {
      label: 'Inactive',
      value: false,
    },
  ];

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: usersFieldsInitialValues(selectedUser),

    validationSchema: usersFormFieldsValidation(isEdit),
    onSubmit: async (values) => {
      let result;
      if (isEdit) {
        const updateUserData = {
          id: values.id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          isActive: values.isActive,
        };
        if (values.password) {
          updateUserData['password'] = values.password;
        }
        // update user
        result = await dispatch(updateUser(updateUserData));
        if (!result) {
          return;
        }
        setSelectedUser();
        validation.resetForm();
        toggleRightCanvas();
        toggle();
      } else {
        const newCustomer = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          isActive: values.isActive,
          password: values.password,
        };
        // save new user
        result = await dispatch(addNewUserThunk(newCustomer));
        if (!result) {
          return;
        }
        setSelectedUser();
        validation.resetForm();
        toggleRightCanvas();
      }
    },
  });

  const fields = usersFormFields(statusOption);

  const renderFields = (fieldNames) => {
    return (
      <RenderFormSingleColumn
        fieldNames={fieldNames}
        fields={fields}
        validation={validation}
        isEdit={isEdit}
      />
    );
  };

  const renderFieldsData = [
    renderFields(['email', 'firstName', 'lastName', 'password', 'isActive']),
  ];

  const createUser = () => {
    return (
      <React.Fragment>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}
        >
          <OffcanvasBody className="p-4 overflow-hidden">
            <SimpleBar style={{ height: '100%' }}>
              <Input type="hidden" id="id-field" />
              <div className="mb-3" id="id" style={{ display: 'none' }}>
                <Label htmlFor="id" className="form-label">
                  ID
                </Label>
                <Input
                  type="text"
                  id="_id"
                  className="form-control"
                  placeholder="ID"
                  readOnly
                />
              </div>

              {renderFieldsData.length &&
                renderFieldsData.map((renderFields, idx) => (
                  <Row className="m-0" key={idx}>
                    {renderFields}
                  </Row>
                ))}
            </SimpleBar>
          </OffcanvasBody>
          <div className="offcanvas-foorter border-top p-3 text-center actionButons">
            <button
              type="button"
              className="btn btn-light margin-right-20px"
              onClick={() => {
                setIsRight(false);
                setModal(false);
              }}
              disabled={addEditLoading}
            >
              {' '}
              Close{' '}
            </button>

            <button
              type="submit"
              className={`btn btn-success position-relative d-flex justify-content-center ${addEditLoading && 'opacity-75'}`}
            >
              {' '}
              {addEditLoading && (
                <span className="position-absolute loader-wrapper">
                  <Loader error={null} />
                </span>
              )}
              {!!isEdit ? 'Update user' : 'Add user'}{' '}
            </button>
          </div>
        </Form>
      </React.Fragment>
    );
  };

  const addUserButton = (
    <button
      type="button"
      className="btn btn-success add-btn"
      id="create-btn"
      onClick={() => {
        setSelectedUser('');
        setIsEdit(false);
        toggleRightCanvas();
      }}
    >
      <i className="ri-add-line align-bottom me-1"></i> Add user
    </button>
  );

  document.title = 'Users | Documents Uploader';
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Users" />
          <Row>
            <Col lg={12}>
              <Card id="UsersList">
                <div className="card-body pt-0">
                  <div>
                    {!loading ? (
                      <TableContainer
                        columns={columns}
                        data={usersList || []}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isGlobalFilter={true}
                        title={'Users list'}
                        SearchPlaceholder="Search for users..."
                        addContentButton={addUserButton}
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
        data={createUser()}
        title={isEdit ? 'Update user' : 'Create user'}
        isOpen={isRight}
        direction={null}
        toggleFunction={toggleRightCanvas}
      />
    </React.Fragment>
  );
};

export default UsersList;
