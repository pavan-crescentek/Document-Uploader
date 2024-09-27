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

import './categoy.css';

//Import Breadcrumb
import BreadCrumb from '../../Components/Common/BreadCrumb';
import DeleteModal from '../../Components/Common/DeleteModal';

import {
  addNewCategory,
  deleteCategory,
  getAllCategoryData,
  updateCategory,
} from '../../slices/thunks';

//redux
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '../../Components/Common/TableContainer';

import Dropzone from 'react-dropzone';
import { createSelector } from 'reselect';
import SimpleBar from 'simplebar-react';
import Loader from '../../Components/Common/Loader';
import OffCanvas from '../../Components/Common/OffCanvas';
import RenderFormSingleColumn from '../../Components/Common/RenderFormSingleColumn';
import { useProfile } from '../../Components/Hooks/UserHooks';
import { api } from '../../config';
import {
  categoryFieldsInitialValues,
  categoryFormFields,
  categoryFormFieldsValidation,
} from './formsFields';
import categoryListTableFields from './tableFields';

const Categories = () => {
  const { userProfile } = useProfile();
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Category;
  const categoryProperties = createSelector(selectLayoutState, (cate) => ({
    categoryData: cate.categoryData,
    error: cate.error,
    loading: cate.loading,
    addEditLoading: cate.addEditLoading,
  }));
  // Inside your component
  const { categoryData, error, loading, addEditLoading } =
    useSelector(categoryProperties);

  const [isEdit, setIsEdit] = useState(false);
  const [selectCategory, setSelectCategory] = useState();

  const [category, setCategory] = useState([]);
  const [photos, setPhotos] = useState();
  const [photoPreviews, setPhotoPreviews] = useState();
  const [categoryForDelete, setCategoryForDelete] = useState();

  // Delete Category
  const [deleteModal, setDeleteModal] = useState(false);
  const [displayPhotoError, setDisplayPhotoError] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [isRight, setIsRight] = useState(false);

  const [modal, setModal] = useState(false);

  const toggleRightCanvas = () => {
    validation.resetForm();
    setIsRight(!isRight);
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      // setCategory(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  useEffect(() => {
    if (displayPhotoError && photoPreviews) {
      setDisplayPhotoError(false);
    }
  }, [photoPreviews]);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: categoryFieldsInitialValues(selectCategory),

    validationSchema: categoryFormFieldsValidation,
    onSubmit: async (values) => {
      if (!isEdit && !photos) {
        return;
      }
      if (isEdit) {
        const updateCategoryData = {
          id: values.id,
          name: values.name,
          active: values.activeStatus,
          image: photos,
        };
        // update category
        await dispatch(updateCategory(updateCategoryData));
        setSelectCategory();
        validation.resetForm();
        toggleRightCanvas();
        toggle();
      } else {
        const newCustomer = {
          name: values.name,
          active: values.activeStatus,
          image: photos,
        };
        // save new category
        await dispatch(addNewCategory(newCustomer));
        setSelectCategory();
        validation.resetForm();
        toggleRightCanvas();
      }
    },
  });

  // Delete Data
  const handleDeleteCustomer = async () => {
    if (categoryForDelete) {
      await dispatch(deleteCategory({ id: categoryForDelete.id }));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback(
    (arg) => {
      const category = arg;
      const modifiedCategory = { ...arg };
      (modifiedCategory['path'] =
        api.API_URL + '/public/categories_images/' + modifiedCategory.image),
        setPhotoPreviews(modifiedCategory.path);
      setSelectCategory({
        id: category.id,
        name: category.name,
        active: category.active,
        image: setPhotos(modifiedCategory.image),
      });

      setIsEdit(true);
      toggleRightCanvas();
      // toggle();
    },
    [toggle]
  );

  const handleFileChange = async (files) => {
    const newPhoto = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(newPhoto);
    reader.onloadend = () => {
      const newPreview = reader.result;
      setPhotos(newPhoto);
      setPhotoPreviews(newPreview);
      validation.setFieldValue('image', newPhoto);
      validation.enableReinitialize = false;
      setDisplayPhotoError(false);
    };
  };

  const handleRemoveImage = () => {
    setPhotos(null);
    setPhotoPreviews(null);
    validation.setFieldValue('image', null);
    setDisplayPhotoError(true);
  };

  const handleEditImage = () => {
    document.getElementById('file-input').click();
  };

  const handleFileInputChange = (event) => {
    handleFileChange(event.target.files);
  };

  // Delete Data
  const onClickDelete = (category) => {
    setCategoryForDelete(category);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (category) {
      dispatch(getAllCategoryData(userProfile));
    }
  }, [dispatch]);

  useEffect(() => {
    setCategory(categoryData);
  }, [categoryData]);

  // useEffect(() => {
  //   if (!isEmpty(categoryData)) {
  //     setCategory(categoryData);
  //     setIsEdit(false);
  //   }
  // }, [categoryData]);

  // Add Data
  const handleCustomerClicks = () => {
    setCategory('');
    setIsEdit(false);
    toggle();
  };

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

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll('.customerCheckBox:checked');
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
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

  const fields = categoryFormFields(statusOption);

  const renderFields = (fieldNames) => (
    <RenderFormSingleColumn
      fieldNames={fieldNames}
      fields={fields}
      validation={validation}
    />
  );

  const renderFieldsData = [renderFields(['name', 'activeStatus'])];

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
              <Row className="m-0" style={{ padding: '12px' }}>
                <Label className="form-label p-0">
                  Photos{' '}
                  <span
                    className="text-danger"
                    style={{ paddingLeft: '6px', fontSize: '10px' }}
                  >
                    Image field is required
                  </span>
                </Label>
                <div className="previewImageMainDiv">
                  {photoPreviews && (
                    <div>
                      <div className="image-preview">
                        <div className="position-relative d-inline-block me-3 mb-2">
                          <img
                            src={photoPreviews}
                            alt="Preview"
                            className="img-thumbnail"
                          />
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm position-absolute top-0 end-0 me-0"
                            onClick={() => handleEditImage()}
                            style={{ zIndex: 1 }}
                          >
                            <i className="ri-pencil-fill fs-10"></i>
                          </button>
                          {/* <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            onClick={() => handleRemoveImage()}
                          >
                            &times;
                          </button> */}
                          <input
                            type="file"
                            id={`file-input`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileInputChange(e)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {!photoPreviews && (
                    <Col md={2}>
                      <Dropzone
                        onDrop={(acceptedFiles) => {
                          handleFileChange(acceptedFiles);
                        }}
                      >
                        {({ getRootProps, getInputProps }) => (
                          <div
                            className="dropzone dz-clickable my-custom-dropzone"
                            {...getRootProps()}
                            style={{ width: '110px', height: '110px' }}
                          >
                            <div className="dz-message needsclick pt-1 m-1">
                              <div className="mb-1">
                                <i
                                  className="display-4 text-muted ri-upload-cloud-2-fill"
                                  style={{ fontSize: '20px' }}
                                />
                              </div>
                              <h6>Drop files here or click to upload.</h6>
                              <input {...getInputProps()} />
                            </div>
                          </div>
                        )}
                      </Dropzone>
                    </Col>
                  )}
                  {displayPhotoError && (
                    <Col md={12} className="text-danger">
                      Please upload at least one photo.
                    </Col>
                  )}
                </div>
              </Row>
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

  // Customers Column
  const columns = useMemo(
    () => categoryListTableFields(Status, handleCustomerClick, onClickDelete),
    [handleCustomerClick]
  );

  const addCategorybutton = (
    <button
      type="button"
      className="btn btn-success add-btn"
      id="create-btn"
      onClick={() => {
        validation.resetForm();
        setPhotoPreviews();
        setPhotos();
        setSelectCategory();
        setIsEdit(false);
        toggleRightCanvas();
      }}
    >
      <i className="ri-add-line align-bottom me-1"></i> Add Category
    </button>
  );

  document.title = 'Category | Velzon - React Admin & Dashboard Template';
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Category" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <div className="card-body pt-0">
                  <div>
                    {!loading ? (
                      <TableContainer
                        columns={columns}
                        data={category || []}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isGlobalFilter={true}
                        title={'Category List'}
                        SearchPlaceholder="Search for category..."
                        addContentButton={addCategorybutton}
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
        title={isEdit ? 'Update Category' : 'Create Category'}
        isOpen={isRight}
        direction={null}
        toggleFunction={toggleRightCanvas}
      />
    </React.Fragment>
  );
};

export default Categories;
