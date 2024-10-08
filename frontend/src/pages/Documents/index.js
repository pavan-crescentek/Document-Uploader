import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  OffcanvasBody,
  Row,
} from 'reactstrap';

// Formik
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

import './documents.css';

//Import Breadcrumb
import BreadCrumb from '../../Components/Common/BreadCrumb';
import DeleteModal from '../../Components/Common/DeleteModal';

import {
  addNewDocument,
  deleteDocument,
  getAllDocumentData,
  updateDocument,
} from '../../slices/thunks';

//redux
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '../../Components/Common/TableContainer';

import Dropzone from 'react-dropzone';
import { createSelector } from 'reselect';
import SimpleBar from 'simplebar-react';
import FileViewerComponent from '../../Components/Common/FileViewer';
import Loader from '../../Components/Common/Loader';
import OffCanvas from '../../Components/Common/OffCanvas';
import { sectionSubsection } from '../../Components/constants/sectionSubsection';
import { useProfile } from '../../Components/Hooks/UserHooks';
import {
  documentFieldsInitialValues,
  documentFormFields,
  documentFormFieldsValidation,
} from './formsFields';
import documentsListTableFields from './tableFields';
import fileIcon from '../../assets/images/file.png';
import pdfIcon from '../../assets/images/pdf.png';

const Documents = () => {
  const { userProfile } = useProfile();
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Document;
  const documentProperties = createSelector(selectLayoutState, (cate) => ({
    documentData: cate.documentData,
    error: cate.error,
    loading: cate.loading,
    addEditLoading: cate.addEditLoading,
  }));
  // Inside your component
  const { documentData, error, loading, addEditLoading } =
    useSelector(documentProperties);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState();
  const [singleFileUrl, setSingleFileUrl] = useState('');
  const [singleFileType, setSingleFileType] = useState('');

  const [documents, setDocuments] = useState([]);
  const [allSections, setAllSections] = useState([]);
  const [allSubSections, setAllSubSections] = useState([]);
  const [photos, setPhotos] = useState();
  const [photoPreviews, setPhotoPreviews] = useState();
  const [photoPreviewsFileName, setPhotoPreviewsFileName] = useState('');
  const [fileTypeForIcon, setFileTypeForIcon] = useState('');
  const [fileError, setFileError] = useState('');
  const [documentForDelete, setDocumentForDelete] = useState();

  // Delete Document
  const [deleteModal, setDeleteModal] = useState(false);
  const [displayPhotoError, setDisplayPhotoError] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [modal_center, setmodal_center] = useState(false);

  const [modal, setModal] = useState(false);

  const toggleRightCanvas = () => {
    validation.resetForm();
    setIsRight(!isRight);
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      // setDocuments(null);
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

    initialValues: documentFieldsInitialValues(selectedDocument),

    validationSchema: documentFormFieldsValidation,
    onSubmit: async (values) => {
      if (!isEdit && !photos) {
        return;
      }
      if (isEdit) {
        const updateDocumentData = {
          id: selectedDocument.id,
          metadata: values.metadata,
          section: values.section,
          subsection: values.subsection,
          doc: photos,
        };
        // update document
        const response = await dispatch(updateDocument(updateDocumentData));
        if (!response) {
          return;
        }
        setSelectedDocument();
        validation.resetForm();
        toggleRightCanvas();
        toggle();
      } else {
        const newCustomer = {
          metadata: values.metadata,
          section: values.section,
          subsection: values.subsection,
          doc: photos,
        };
        // save new document
        const response = await dispatch(addNewDocument(newCustomer));
        if (!response) {
          return;
        }
        setSelectedDocument();
        validation.resetForm();
        toggleRightCanvas();
      }
    },
  });

  // Delete Data
  const handleDeleteCustomer = async () => {
    if (documentForDelete) {
      await dispatch(deleteDocument({ id: documentForDelete._id }));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback(
    (arg) => {
      const document = arg;
      const modifiedDocument = { ...arg };
      const subSectionOptions =
        sectionSubsection
          .find((item) => item.section === modifiedDocument.section)
          ?.subsection.map((sub) => ({
            value: sub,
            label: sub,
          })) || [];
      setAllSubSections(subSectionOptions);

      setPhotoPreviews(modifiedDocument.readAbleFileUrl);
      setSelectedDocument({
        id: document._id,
        metadata: modifiedDocument.metadata,
        section: modifiedDocument.section,
        subsection: modifiedDocument.subsection,
        doc: setPhotos(modifiedDocument.readAbleFileUrl),
      });

      setIsEdit(true);
      toggleRightCanvas();
      // toggle();
    },
    [toggle]
  );

  const handleFileChange = async (files) => {
    const newPhoto = files[0];
    setFileError('');

    const maxSize = 100 * 1024 * 1024;
    if (newPhoto && newPhoto.size > maxSize) {
      setDisplayPhotoError(true);
      setFileError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
    const fileExtension = newPhoto?.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setDisplayPhotoError(true);
      setFileError(
        'Invalid file type, only PDF, JPEG, PNG, DOC and DOCX are allowed.'
      );
      return;
    }
    if (fileExtension === 'pdf') {
      setFileTypeForIcon('pdf');
    }
    if (fileExtension === 'doc' || fileExtension === 'docx') {
      setFileTypeForIcon('doc');
    }

    const reader = new FileReader();
    reader.readAsDataURL(newPhoto);
    reader.onloadend = () => {
      const newPreview = reader.result;
      setPhotoPreviewsFileName(newPhoto.name);
      setPhotos(newPhoto);
      setPhotoPreviews(newPreview);
      validation.setFieldValue('doc', newPhoto);
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
  const onClickDelete = (document) => {
    setDocumentForDelete(document);
    setDeleteModal(true);
  };

  useEffect(() => {
    if (documents) {
      dispatch(getAllDocumentData(userProfile));
    }
  }, [dispatch]);

  useEffect(() => {
    setDocuments(documentData);
  }, [documentData]);

  useEffect(() => {
    const sectionOptions = sectionSubsection.map((item) => ({
      value: item.section,
      label: item.section.toUpperCase(),
    }));
    setAllSections(sectionOptions);
  }, []);

  // Add Data
  const handleCustomerClicks = () => {
    setDocuments('');
    setIsEdit(false);
    toggle();
  };

  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById('checkBoxAll');
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteDocument(element.value));
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

  const handleCountryChange = async (e) => {
    const selectedSection = e.target.value;
    validation.handleChange(e);
    validation.setFieldValue('section', selectedSection);
    const subSectionOptions =
      sectionSubsection
        .find((item) => item.section === selectedSection)
        ?.subsection.map((sub) => ({
          value: sub,
          label: sub,
        })) || [];
    setAllSubSections(subSectionOptions);
    validation.setFieldValue('subsection', '');
  };

  const fields = documentFormFields(allSections, allSubSections);

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
                {field.type === 'select' ? (
                  <Input
                    name={field.name}
                    id={`${field.name}-field`}
                    className="form-control"
                    type={field.type}
                    onChange={
                      field.name === 'section'
                        ? handleCountryChange
                        : validation.handleChange
                    }
                    onBlur={validation.handleBlur}
                    value={validation.values[field.name] || ''}
                    invalid={
                      validation.touched[field.name] &&
                      validation.errors[field.name]
                        ? true
                        : false
                    }
                  >
                    <option value="">{field.placeholder}</option>
                    {Array.isArray(field.options) &&
                      field.options.map((option, idx) => (
                        <option key={idx} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </Input>
                ) : field.type === 'textarea' && field.name !== 'details' ? (
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
                    autoComplete="off"
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

  const renderFieldsData = [
    renderFields(['metadata', 'section', 'subsection']),
  ];

  const createDocument = () => {
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
                <Label className="form-label p-0">Choose your file </Label>
                <span style={{ padding: '0 0 10px 0', fontSize: '12px' }}>
                  Allowed file types: PDF, JPEG, PNG, DOC and DOCX
                </span>
                <div className="previewImageMainDiv">
                  {photoPreviews && (
                    <div>
                      <div className="image-preview">
                        <div className="position-relative d-inline-block me-3 mb-2">
                          <img
                            src={
                              fileTypeForIcon === 'pdf'
                                ? pdfIcon
                                : fileTypeForIcon === 'doc'
                                  ? fileIcon
                                  : photoPreviews
                            }
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
                          <input
                            type="file"
                            id={`file-input`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileInputChange(e)}
                          />
                        </div>
                      </div>
                      {photoPreviewsFileName}
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
                              <h6>
                                Drag and drop your <br /> file here or <br />
                                click to upload.
                              </h6>
                              <input {...getInputProps()} />
                            </div>
                          </div>
                        )}
                      </Dropzone>
                    </Col>
                  )}
                  {displayPhotoError && (
                    <Col md={12} className="text-danger">
                      {fileError}
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
              Cancel{' '}
            </button>

            <button
              type="submit"
              className={`btn btn-success position-relative d-flex justify-content-center ${addEditLoading && 'opacity-75'}`}
              onClick={() => {
                if (!photoPreviews) {
                  setDisplayPhotoError(true);
                  setFileError('Please upload file.');
                }
              }}
              disabled={addEditLoading}
            >
              {' '}
              {addEditLoading && (
                <span className="position-absolute loader-wrapper">
                  <Loader error={null} />
                </span>
              )}
              {!!isEdit ? 'Update' : 'Add document'}{' '}
            </button>
          </div>
        </Form>
      </React.Fragment>
    );
  };

  function tog_center(data) {
    if (data && data.readAbleFileUrl && data.mime_type) {
      setSingleFileUrl(data.readAbleFileUrl);
      setSingleFileType(data.mime_type);
    }
    setmodal_center(!modal_center);
  }
  // Customers Column
  const columns = useMemo(
    () =>
      documentsListTableFields(
        Status,
        handleCustomerClick,
        onClickDelete,
        tog_center
      ),
    [handleCustomerClick]
  );

  const addDocumentButton = (
    <button
      type="button"
      className="btn btn-success add-btn"
      id="create-btn"
      onClick={() => {
        validation.resetForm();
        setPhotoPreviews();
        setPhotos();
        setSelectedDocument();
        setIsEdit(false);
        setDisplayPhotoError(false);
        setFileError('');
        setFileTypeForIcon('');
        toggleRightCanvas();
      }}
    >
      <i className="ri-add-line align-bottom me-1"></i> Add document
    </button>
  );

  document.title = 'Documents | Documents Uploader';
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
          <BreadCrumb title="Documents" />
          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <div className="card-body pt-0">
                  <div>
                    {!loading ? (
                      <TableContainer
                        columns={columns}
                        data={documents || []}
                        isAddUserList={false}
                        // customPageSize={8}
                        className="custom-header-css"
                        handleCustomerClick={handleCustomerClicks}
                        isGlobalFilter={true}
                        title={'Documents list'}
                        SearchPlaceholder="Search for documents..."
                        addContentButton={addDocumentButton}
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
      <Modal
        size="xl"
        isOpen={modal_center}
        toggle={() => {
          tog_center();
        }}
        centered
        contentClassName="bg-transparent border-0 w-auto"
        className="d-flex justify-content-center"
      >
        <ModalHeader className="modal-title p-0" />

        <ModalBody className="text-center p-0">
          <FileViewerComponent
            mime_type={singleFileType}
            url={singleFileUrl}
            onClose={() => {
              tog_center();
            }}
          />
        </ModalBody>
      </Modal>
      <OffCanvas
        data={createDocument()}
        title={isEdit ? 'Update document' : 'Create document'}
        isOpen={isRight}
        direction={null}
        toggleFunction={toggleRightCanvas}
      />
    </React.Fragment>
  );
};

export default Documents;
