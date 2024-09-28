import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Container, Row } from 'reactstrap';

import './users.css';

//Import Breadcrumb
import BreadCrumb from '../../Components/Common/BreadCrumb';

//redux
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '../../Components/Common/TableContainer';

import { createSelector } from 'reselect';
import Loader from '../../Components/Common/Loader';
import { getAllUsersData } from '../../slices/thunks';
import { usersFormFields } from './formsFields';
import usersListTableFields from './tableFields';

const UsersList = () => {
  const dispatch = useDispatch();
  const [usersList, setUsersList] = useState([]);

  const selectLayoutState = (state) => ({
    usersList: state.UsersList,
  });
  const UsersListProperties = createSelector(
    selectLayoutState,
    ({ usersList }) => ({
      usersListData: usersList.usersListData,
      error: usersList.error,
      loading: usersList.loading,
    })
  );
  // Inside your component
  const { usersListData, error, loading } = useSelector(UsersListProperties);

  useEffect(() => {
    if (usersList) {
      dispatch(getAllUsersData());
    }
  }, [dispatch]);

  useEffect(() => {
    setUsersList(usersListData);
  }, [usersListData]);

  const IsVerified = (cell) => {
    return (
      <React.Fragment>
        {cell.getValue() === 'ACTIVE' ? (
          <span className="badge bg-success-subtle text-success text-uppercase">
            ACTIVE
          </span>
        ) : cell.getValue() === 'DISABLED' ? (
          <span className="badge bg-warning-subtle text-warning text-uppercase">
            DISABLED
          </span>
        ) : null}
      </React.Fragment>
    );
  };

  // Users Column
  const columns = useMemo(() => usersListTableFields(IsVerified), [usersList]);

  // const addPartnerbutton = (
  //   <button
  //     type="button"
  //     className="btn btn-success add-btn"
  //     id="create-btn"
  //     onClick={() => {
  //       setSelectPartner('');
  //       setIsEdit(false);
  //       toggleRightCanvas();
  //     }}
  //   >
  //     <i className="ri-add-line align-bottom me-1"></i> Add Partner
  //   </button>
  // );

  const fields = usersFormFields(statusOption);

  const renderFields = (fieldNames) => (
    <RenderFormSingleColumn
      fieldNames={fieldNames}
      fields={fields}
      validation={validation}
    />
  );

  const renderFieldsData = [
    renderFields(['email', 'firstName', 'lastName', 'password', 'isActive']),
  ];

  const createCategory = () => {
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
              <input type="hidden" id="id-field" />
              <div className="mb-3" id="id" style={{ display: 'none' }}>
                <Label htmlFor="id" className="form-label">
                  ID
                </Label>
                <Input
                  type="text"
                  id="id"
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
              onClick={() => {
                if (!photoPreviews) {
                  setDisplayPhotoError(true);
                }
              }}
            >
              {' '}
              {addEditLoading && (
                <span className="position-absolute loader-wrapper">
                  <Loader error={null} />
                </span>
              )}
              {!!isEdit ? 'Update' : 'Add Category'}{' '}
            </button>
          </div>
        </Form>
      </React.Fragment>
    );
  };

  document.title = 'Users | Velzon - React Admin & Dashboard Template';
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
                        // handleCustomerClick={handleCustomerClicks}
                        isGlobalFilter={true}
                        title={'Users List'}
                        SearchPlaceholder="Search for users..."
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
        data={createCategory()}
        title={isEdit ? 'Update User' : 'Create User'}
        isOpen={isRight}
        direction={null}
        toggleFunction={toggleRightCanvas}
      />
    </React.Fragment>
  );
};

export default UsersList;
