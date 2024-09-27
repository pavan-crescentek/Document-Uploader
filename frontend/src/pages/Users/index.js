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

  const IsVerified = (cell) => {
    return (
      <React.Fragment>
        {cell.getValue() === true ? (
          <span className="badge bg-success-subtle text-success text-uppercase">
            Verified
          </span>
        ) : cell.getValue() === false ? (
          <span className="badge bg-warning-subtle text-warning text-uppercase">
            Not Verified
          </span>
        ) : null}
      </React.Fragment>
    );
  };

  // Users Column
  const columns = useMemo(
    () => usersListTableFields(Status, IsVerified),
    [usersList]
  );

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
    </React.Fragment>
  );
};

export default UsersList;
