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

// Formik
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import './partners.css';

//Import Breadcrumb
import BreadCrumb from '../../Components/Common/BreadCrumb';
import DeleteModal from '../../Components/Common/DeleteModal';

//redux
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '../../Components/Common/TableContainer';

import { isUndefined } from 'lodash';
import { createSelector } from 'reselect';
import SimpleBar from 'simplebar-react';
import Loader from '../../Components/Common/Loader';
import OffCanvas from '../../Components/Common/OffCanvas';
import RenderFormSingleColumn from '../../Components/Common/RenderFormSingleColumn';
import {
  addNewPatnerThunk,
  deleteBankDetails,
  deletePartner,
  getAllPatnersData,
  updatePartner,
  updatePartnerBankDetails,
} from '../../slices/thunks';
import {
  partnerBankDetailsFieldsInitialValues,
  partnerFieldsInitialValues,
  partnersBankDetailsFormFields,
  partnersBankDetailsFormFieldsValidation,
  partnersFormFields,
  partnersFormFieldsValidation,
} from './formsFields';
import partnerListTableFields from './tableFields';

const Partners = () => {
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Partner;
  const partnerProperties = createSelector(selectLayoutState, (partner) => ({
    partnersData: partner.partnersData,
    error: partner.error,
    loading: partner.loading,
    addEditLoading: partner.addEditLoading,
    deleteBankDetailsLoading: partner.deleteBankDetailsLoading,
  }));
  // Inside your component
  const {
    partnersData,
    error,
    loading,
    addEditLoading,
    deleteBankDetailsLoading,
  } = useSelector(partnerProperties);

  const [selectPartner, setSelectPartner] = useState();
  const [selectPartnerBankDetails, setSelectPartnerBankDetails] = useState();

  const [partners, setPartners] = useState([]);
  const [partnerForDelete, setPartnerForDelete] = useState();

  // Delete Partner
  const [deleteModal, setDeleteModal] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const [addEditBankDetails, setAddEditBankDetails] = useState(false);

  const toggleRightCanvas = () => {
    validation.resetForm();
    bankDetailsValidation.resetForm();
    setIsRight(!isRight);
    if (isRight) {
      setIsEdit(false);
      setAddEditBankDetails(false);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      // setPartners(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: partnerFieldsInitialValues(selectPartner),

    validationSchema: partnersFormFieldsValidation(isEdit),
    onSubmit: async (values) => {
      if (isEdit) {
        const updatePartnerData = {
          id: values.id,
          name: values.name,
          active: values.activeStatus,
          email: values.email,
          commission_percentage: values.commission_percentage,
        };
        if (values.password) {
          updatePartnerData['password'] = values.password;
        }
        // update partners
        await dispatch(updatePartner(updatePartnerData));
        setSelectPartner();
        validation.resetForm();
        toggleRightCanvas();
        toggle();
      } else {
        const newPartner = {
          name: values.name,
          active: values.activeStatus,
          email: values.email,
          password: values.password,
          commission_percentage: values.commission_percentage,
        };
        // save new partners
        await dispatch(addNewPatnerThunk(newPartner));
        setSelectPartner();
        validation.resetForm();
        toggleRightCanvas();
      }
    },
  });
  // validation
  const bankDetailsValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: partnerBankDetailsFieldsInitialValues(
      selectPartnerBankDetails
    ),

    validationSchema: partnersBankDetailsFormFieldsValidation(),
    onSubmit: async (values) => {
      const updatePartnerData = {
        name: values.name,
        bank_name: values.bank_name,
        branch_name: values.branch_name,
        account_number: values.account_number,
        ifsc: values.ifsc,
        active: values.active === 'true' ? true : false,
        user_id: values.user_id,
        id: selectPartnerBankDetails?.id,
      };
      if (isUndefined(updatePartnerData?.id)) {
        delete updatePartnerData.id;
      }
      // update partners
      await dispatch(updatePartnerBankDetails(updatePartnerData));
      setSelectPartnerBankDetails();
      bankDetailsValidation.resetForm();
      toggleRightCanvas();
      toggle();
    },
  });

  // Delete Data
  const handleDeleteCustomer = async () => {
    if (partnerForDelete) {
      await dispatch(deletePartner({ id: partnerForDelete.id }));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback(
    (arg) => {
      const partners = arg;
      setSelectPartner({
        id: partners.id,
        name: partners.name,
        email: partners.email,
        active: partners.active === 'true' ? true : false,
        commission_percentage: partners.commission_percentage,
      });

      setIsEdit(true);
      toggleRightCanvas();
      // toggle();
    },
    [toggle]
  );
  const addEditBankDetailsFunction = useCallback(
    (arg) => {
      const bankDetail = arg;
      setSelectPartnerBankDetails({
        id: bankDetail?.id,
        name: bankDetail?.name,
        bank_name: bankDetail?.bank_name,
        branch_name: bankDetail?.branch_name,
        account_number: bankDetail?.account_number,
        ifsc: bankDetail?.ifsc,
        user_id: bankDetail?.user_id,
        active: bankDetail?.active,
      });

      setAddEditBankDetails(true);
      toggleRightCanvas();
      // toggle();
    },
    [toggle]
  );

  // Delete Data
  const onClickDelete = (partners) => {
    setPartnerForDelete(partners);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (partners) {
      dispatch(getAllPatnersData());
    }
  }, [dispatch]);

  useEffect(() => {
    setPartners(partnersData);
  }, [partnersData]);

  // Add Data
  const handleCustomerClicks = () => {
    setSelectPartner('');
    setIsEdit(false);
    toggle();
  };

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById('checkBoxAll');
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteCustomer(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };
  const deleteBankDetailsFunction = async (id) => {
    try {
      const response = await dispatch(
        deleteBankDetails(id, selectPartnerBankDetails?.user_id)
      );
      if (response) {
        bankDetailsValidation.resetForm();
        toggleRightCanvas();
        toggle();
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const fields = partnersFormFields(statusOption);

  const renderFields = (fieldNames) => (
    <RenderFormSingleColumn
      fieldNames={fieldNames}
      fields={fields}
      validation={validation}
      isEdit={isEdit}
    />
  );

  const renderFieldsData = [
    renderFields([
      'name',
      'email',
      'commission_percentage',
      'password',
      'activeStatus',
    ]),
  ];

  const createEditPartner = () => {
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
          <OffcanvasBody className="p-2 overflow-hidden">
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
            >
              {' '}
              {addEditLoading && (
                <span className="position-absolute loader-wrapper">
                  <Loader error={null} />
                </span>
              )}
              {!!isEdit ? 'Update' : 'Add Partner'}{' '}
            </button>
          </div>
        </Form>
      </React.Fragment>
    );
  };
  const bankDetailsFields = partnersBankDetailsFormFields(statusOption);

  const renderBankDetailsFields = (fieldNames) => (
    <RenderFormSingleColumn
      fieldNames={fieldNames}
      fields={bankDetailsFields}
      validation={bankDetailsValidation}
      isEdit={addEditBankDetails}
    />
  );

  const renderBankDetailsFieldsData = [
    renderBankDetailsFields([
      'name',
      'bank_name',
      'branch_name',
      'account_number',
      'ifsc',
      'active',
    ]),
  ];

  const createEditPartnerBankDetails = () => {
    return (
      <React.Fragment>
        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            bankDetailsValidation.handleSubmit();
            return false;
          }}
        >
          <OffcanvasBody className="p-2 overflow-hidden">
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
                  name="id"
                />
              </div>
              <div className="mb-3" id="user_id" style={{ display: 'none' }}>
                <Label htmlFor="user_id" className="form-label">
                  user_id
                </Label>
                <Input
                  type="text"
                  id="user_id"
                  className="form-control"
                  placeholder="ID"
                  readOnly
                />
              </div>

              {renderBankDetailsFieldsData.length &&
                renderBankDetailsFieldsData.map((renderFields, idx) => (
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
              disabled={addEditLoading || deleteBankDetailsLoading}
            >
              {' '}
              Close{' '}
            </button>

            {selectPartnerBankDetails?.id && (
              <button
                type="submit"
                className={`btn btn-danger position-relative d-flex justify-content-center ${deleteBankDetailsLoading && 'opacity-75'} margin-right-20px`}
                disabled={deleteBankDetailsLoading || addEditLoading}
                onClick={() => {
                  deleteBankDetailsFunction(selectPartnerBankDetails?.id);
                }}
              >
                {' '}
                {deleteBankDetailsLoading && (
                  <span className="position-absolute loader-wrapper">
                    <Loader error={null} />
                  </span>
                )}
                Delete
              </button>
            )}

            <button
              type="submit"
              className={`btn btn-success position-relative d-flex justify-content-center ${addEditLoading && 'opacity-75'}`}
              disabled={addEditLoading || deleteBankDetailsLoading}
            >
              {' '}
              {addEditLoading && (
                <span className="position-absolute loader-wrapper">
                  <Loader error={null} />
                </span>
              )}
              {!!addEditBankDetails
                ? 'Update Bank Details'
                : 'Add Bank Details'}{' '}
            </button>
          </div>
        </Form>
      </React.Fragment>
    );
  };

  // Partners Column
  const columns = useMemo(
    () =>
      partnerListTableFields(
        Status,
        handleCustomerClick,
        onClickDelete,
        addEditBankDetailsFunction
      ),
    [handleCustomerClick]
  );

  const addPartnerbutton = (
    <button
      type="button"
      className="btn btn-success add-btn"
      id="create-btn"
      onClick={() => {
        setSelectPartner('');
        setIsEdit(false);
        toggleRightCanvas();
      }}
    >
      <i className="ri-add-line align-bottom me-1"></i> Add Partner
    </button>
  );

  document.title = 'Partners | Velzon - React Admin & Dashboard Template';
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Partners" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <div className="card-body pt-0">
                  <div>
                    {!loading ? (
                      <TableContainer
                        columns={columns}
                        data={partners || []}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isGlobalFilter={true}
                        title={'Partner List'}
                        SearchPlaceholder="Search for partners..."
                        addContentButton={addPartnerbutton}
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
        data={
          addEditBankDetails
            ? createEditPartnerBankDetails()
            : createEditPartner()
        }
        title={
          addEditBankDetails
            ? selectPartnerBankDetails?.id
              ? 'Update Bank Details'
              : 'Add Bank Details '
            : isEdit
              ? 'Update Partner'
              : 'Create Partner'
        }
        isOpen={isRight}
        direction={null}
        toggleFunction={toggleRightCanvas}
      />
    </React.Fragment>
  );
};

export default Partners;
