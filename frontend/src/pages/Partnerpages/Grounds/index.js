import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Card,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  OffcanvasBody,
  Row,
} from 'reactstrap';

// Formik
import { useFormik } from 'formik';

import './grounds.css';

//Import Breadcrumb
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DeleteModal from '../../../Components/Common/DeleteModal';

import {
  addNewGround,
  addNewImage,
  deleteGround,
  deleteImage,
  getAllCategoryData,
  getAllCountries,
  getAllGroundsData,
  getCitiesOfState,
  getGroundBookingData,
  getGroundSlotData,
  getGroundSlotForBookingData,
  getStatesOfCountry,
  updateGround,
  updateGroundSlotData,
} from '../../../slices/thunks';

//redux
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '../../../Components/Common/TableContainer';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import { createSelector } from 'reselect';
import SimpleBar from 'simplebar-react';
import Loader from '../../../Components/Common/Loader';
import OffCanvas from '../../../Components/Common/OffCanvas';
import { useProfile } from '../../../Components/Hooks/UserHooks';
import { api } from '../../../config';
import BookingList from '../GroundBookings';
import AvailableTimeSlotForBooking from './availableSlots';
import {
  groundFieldsInitialValues,
  groundsFormFields,
  groundsFormFieldsValidation,
} from './formsFields';
import groundTableFields from './tableFields';
import TimeSlot from './timeSlot';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const Grounds = () => {
  const { userProfile } = useProfile();
  const dispatch = useDispatch();
  const [selectGround, setSelectGround] = useState();
  const [selectedGround, setSelectedGround] = useState();
  const [editorHtml, setEditorHtml] = useState();
  const [groundForDelete, setGroundForDelete] = useState();
  const [ground, setGround] = useState([]);
  const [category, setCategory] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [groundSlotData, setGroundSlotData] = useState([]);
  const [groundBookingsData, setGroundBookingsData] = useState([]);
  const [isDisplayBookings, setIsDisplayBookings] = useState(false);
  const [groundSlotDataForBooking, setGroundSlotDataForBooking] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editSlot, setEditSlot] = useState(false);
  const [isSlotDisplayForBooking, setIsSlotDisplayForBooking] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [modal, setModal] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [displayPhotoError, setDisplayPhotoError] = useState(false);
  const [marker, setMarker] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyD2HFmxVeKbp8VhsBP54Zr624AUWFy581E',
  });

  const selectLayoutState = (state) => ({
    category: state.Category,
    grounds: state.Grounds,
  });

  const groundsProperties = createSelector(
    selectLayoutState,
    ({ grounds, category }) => ({
      categoryData: category.categoryData,
      groundsData: grounds.groundsData,
      error: grounds.error,
      loading: grounds.loading,
      addEditLoading: grounds.addEditLoading,
      countriesList: grounds.countriesList,
      stateList: grounds.stateList,
      citiesList: grounds.citiesList,
    })
  );

  const {
    categoryData,
    groundsData,
    error,
    loading,
    addEditLoading,
    countriesList,
    stateList,
    citiesList,
  } = useSelector(groundsProperties);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          validation.setFieldValue('latitude', position.coords.latitude);
          validation.setFieldValue('longitude', position.coords.longitude);
          setMarker({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.error("Error getting user's location");
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getAllCategoryData(userProfile));
      await dispatch(getAllGroundsData());
      await dispatch(getAllCountries());
      setIsDataLoading(false);
    };
    fetchData();
  }, [dispatch, userProfile]);

  useEffect(() => {
    setGround(groundsData);
    setCategory(categoryData);
  }, [groundsData, categoryData]);

  useEffect(() => {
    if (displayPhotoError && photoPreviews.length >= 2) {
      setDisplayPhotoError(false);
    }
  }, [photoPreviews]);

  const onMapClick = useCallback((event) => {
    setMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    validation.setFieldValue('latitude', event.latLng.lat());
    validation.setFieldValue('longitude', event.latLng.lng());
  }, []);

  const toggleRightCanvas = () => {
    validation.resetForm();
    setIsRight(!isRight);

    if (isRight) {
      setEditSlot(false);
      setIsEdit(false);
      setIsSlotDisplayForBooking(false);
      setIsDisplayBookings(false);
    }
  };

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  const closeEverything = () => {
    setIsDisplayBookings(false);
    setIsEdit(false);
    setEditSlot(false);
    setIsSlotDisplayForBooking(false);
    setDeleteModal(false);
    setIsRight(false);
    setModal(false);
    setDisplayPhotoError(false);
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: groundFieldsInitialValues(selectGround),
    validationSchema: groundsFormFieldsValidation,

    onSubmit: async (values) => {
      if (!isEdit && (photos.length === 0 || photos.length < 2)) {
        return;
      }
      const groundData = {
        name: values.name || '',
        email: values.email || '',
        details: values.details || '',
        mobile_number: values.mobile_number || '',
        cat_id: values.cat_id || '',
        user_id: userProfile.id || '',
        active: values.active === 'true',
        address: values.address || '',
        latitude: values.latitude || '',
        longitude: values.longitude || '',
        photos: photos || [],
        youtube_link: values.youtube_link || '',
        whatsapp_number: values.whatsapp_number || '',
        twitter: values.twitter || '',
        instagram: values.instagram || '',
        facebook: values.facebook || '',
        website: values.website || '',
        person_name: values.person_name || '',
        country_id: values.country_id || '',
        state_id: values.state_id || '',
      };
      if (values && values.city_id) {
        groundData['city_id'] = values.city_id;
      }
      let result;
      if (isEdit) {
        delete groundData.photos;
        groundData.id = selectGround.id;
        result = await dispatch(updateGround(groundData));
      } else {
        result = await dispatch(addNewGround(groundData));
      }
      if (!result) {
        return;
      }
      setSelectGround();
      validation.resetForm();
      toggleRightCanvas();
      toggle();
    },
  });
  const handleDeleteCustomer = async () => {
    if (groundForDelete) {
      await dispatch(deleteGround({ id: groundForDelete.id }));
      setDeleteModal(false);
    }
  };

  const handleCustomerClick = useCallback(
    (arg) => {
      const ground = arg;
      const modifiedGround = { ...arg };
      const previewImg = [];

      if (modifiedGround.photos && modifiedGround.photos.length) {
        modifiedGround.photos = modifiedGround.photos.map((img) => ({
          ...img,
          path: api.API_URL + '/public/ground_images/' + img.path,
        }));
        modifiedGround.photos.map((img) => previewImg.push(img.path));
      }
      dispatch(getStatesOfCountry(ground.country_id));
      dispatch(getCitiesOfState(ground.state_id));
      setEditorHtml(ground.details);
      setPhotoPreviews(previewImg);
      setSelectGround({
        id: ground.id,
        name: ground.name,
        email: ground.email,
        details: editorHtml,
        mobile_number: ground.mobile_number,
        cat_id: ground.cat_id,
        active: ground.active,
        photos: setPhotos(modifiedGround.photos),
        address: ground.address,
        latitude: ground.latitude,
        longitude: ground.longitude,
        youtube_link: ground.youtube_link,
        whatsapp_number: ground.whatsapp_number,
        twitter: ground.twitter,
        instagram: ground.instagram,
        facebook: ground.facebook,
        website: ground.website,
        person_name: ground.person_name,
        country_id: ground.country_id,
        state_id: ground.state_id,
        city_id: ground.city_id,
      });
      if (ground.latitude !== '' && ground.longitude !== '') {
        setMarker({
          lat: Number(ground.latitude),
          lng: Number(ground.longitude),
        });
      }
      setEditSlot(false);
      setIsEdit(true);
      toggleRightCanvas();
    },
    [toggle]
  );

  const onClickDelete = (ground) => {
    setGroundForDelete(ground);
    setDeleteModal(true);
  };

  const handleCustomerClicks = () => {
    setGround('');
    setCategory('');
    setEditorHtml();
    setIsEdit(false);
    toggle();
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

  const editTimeSlot = (ground) => {
    if (ground) {
      setSelectedGround(ground.id);
      dispatch(getGroundSlotData({ ground_id: ground.id })).then((data) => {
        setGroundSlotData(data);
        setEditSlot(true);
        toggleRightCanvas();
      });
    }
  };

  const displyBookings = (ground) => {
    if (ground) {
      setSelectedGround(ground.id);
      dispatch(getGroundBookingData({ ground_id: ground.id })).then((data) => {
        setGroundBookingsData(data);
        setIsDisplayBookings(true);
        toggleRightCanvas();
      });
    }
  };
  const bookSlot = (ground) => {
    if (ground) {
      setSelectedGround(ground.id);
      // dispatch(
      //   getGroundSlotForBookingData({
      //     ground_id: ground.id,
      //     date: moment().format('YYYY/MM/DD'),
      //   })
      // ).then((data) => {
      //   setGroundSlotDataForBooking(data);
      //   setIsSlotDisplayForBooking(true);
      //   toggleRightCanvas();
      // });
      setIsSlotDisplayForBooking(true);
      toggleRightCanvas();
    }
  };

  const getDifferentDateSlots = (date) => {
    if (ground) {
      dispatch(
        getGroundSlotForBookingData({
          ground_id: selectedGround,
          date: moment(date).format('YYYY/MM/DD'),
        })
      ).then((data) => {
        setGroundSlotDataForBooking(data);
      });
    }
  };
  const updateSlots = (slots) => {
    dispatch(updateGroundSlotData(slots)).then(() => {
      setGroundSlotData([]);
      setEditSlot(false);
      toggleRightCanvas();
    });
  };

  const handleFileChange = async (files, indexToUpdate = null) => {
    const newPhotos = Array.from(files);
    const updatedPhotoList = photos ? [...photos] : [];
    let updatedPhotos;

    if (isEdit && indexToUpdate === null) {
      const newImagePath = await dispatch(
        addNewImage({
          ground_id: selectGround?.id,
          photos: files,
        })
      );
      updatedPhotoList.push(newImagePath);
      updatedPhotos = updatedPhotoList;
    }

    const newPreviews = await Promise.all(
      newPhotos.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      })
    );

    if (indexToUpdate !== null) {
      const newImagePath = await dispatch(
        addNewImage(
          {
            ground_id: updatedPhotoList[indexToUpdate].ground_id,
            id: updatedPhotoList[indexToUpdate].id,
            photos: newPhotos,
          },
          indexToUpdate
        )
      );
      updatedPhotoList[indexToUpdate].path = newImagePath.path;
      updatedPhotos = updatedPhotoList;
    } else {
      updatedPhotos = [...updatedPhotoList, ...newPhotos];
    }
    setPhotos(updatedPhotos);

    const resolvedPhotos = await updatedPhotos;

    validation.setFieldValue('photos', resolvedPhotos);
    validation.enableReinitialize = false;

    setPhotoPreviews((prevPreviews) => {
      let updatedPreviews;
      if (indexToUpdate !== null) {
        updatedPreviews = prevPreviews.map((preview, index) =>
          index === indexToUpdate ? newPreviews[0] : preview
        );
      } else {
        updatedPreviews = [...prevPreviews, ...newPreviews];
      }
      return updatedPreviews;
    });
  };

  const handleRemoveImage = (index) => {
    const currentPhotos = [...photos];

    const updatedPhotos = currentPhotos.filter((img, i) => i !== index);

    if (isEdit && photos[index]) {
      dispatch(
        deleteImage({ id: photos[index].id, ground_id: selectGround?.id })
      );
    }

    validation.setFieldValue('photos', updatedPhotos);
    setPhotos(updatedPhotos);

    setPhotoPreviews((prevPreviews) =>
      prevPreviews.filter((img, i) => i !== index)
    );
  };
  const handleEditImage = (index) => {
    document.getElementById(`file-input-${index}`).click();
  };

  const handleFileInputChange = (event, index) => {
    handleFileChange(event.target.files, index);
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    await dispatch(getStatesOfCountry(countryId));
    validation.handleChange(e);
    validation.setFieldValue('country_id', countryId);
    validation.setFieldValue('state_id', '');
    validation.setFieldValue('city_id', '');
  };
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    await dispatch(getCitiesOfState(stateId));
    validation.handleChange(e);
    validation.setFieldValue('state_id', stateId);
    validation.setFieldValue('city_id', '');
  };

  const createGround = () => {
    const categoryOptions = categoryData.map((cat) => ({
      label: cat.name,
      value: cat.id,
    }));
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

    const fields = groundsFormFields(
      countriesList,
      stateList,
      citiesList,
      statusOption,
      categoryOptions
    );

    const toolbarOptions = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
      ],
    };

    const fieldsFor6 = [
      'details',
      'address',
      'latitude',
      'longitude',
      'status',
      'category',
      'ground name',
      'email',
      'person name',
      'mobile number',
    ];

    const renderFields = (fieldNames) => {
      return (
        <>
          {fieldNames.map((name, index) => {
            const field = fields.find((field) => field.name === name);
            return (
              <Col
                md={fieldsFor6.includes(field.label.toLowerCase()) ? 6 : 4}
                key={index}
              >
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
                        field.name === 'country_id'
                          ? handleCountryChange
                          : field.name === 'state_id'
                            ? handleStateChange
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
                      <option value="">Select {field.label}</option>
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
                  ) : field.name === 'details' ? (
                    <>
                      <ReactQuill
                        name="details"
                        id={`${field.name}-field`}
                        theme="snow"
                        value={editorHtml}
                        onChange={(e) => {
                          if (e === '<p><br></p>') {
                            validation.setFieldValue('details', '');
                            setEditorHtml('');
                          } else {
                            validation.setFieldValue('details', e);
                            setEditorHtml(e);
                          }
                          // validation.setFieldTouched('details', true);
                        }}
                        modules={toolbarOptions}
                        invalid={
                          validation.touched[field.name] &&
                          validation.errors[field.name]
                            ? true
                            : false
                        }
                      />
                      {validation.touched.details &&
                        validation.errors.details && (
                          <div className="invalid-feedback d-block">
                            {validation.errors.details}
                          </div>
                        )}
                    </>
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

    const renderFieldsData = [
      renderFields(['name', 'email']),
      renderFields(['person_name', 'mobile_number']),
      renderFields(['details', 'address']),
      renderFields(['latitude', 'longitude']),
      renderFields(['country_id', 'state_id', 'city_id']),
      renderFields(['active', 'cat_id']),
      renderFields(['whatsapp_number', 'youtube_link', 'twitter']),
      renderFields(['instagram', 'facebook', 'website']),
    ];

    return (
      <React.Fragment>
        <Form className="tablelist-form" onSubmit={validation.handleSubmit}>
          <OffcanvasBody
            className="overflow-auto p-2"
            style={{ maxHeight: '87vh', minHeight: '87vh' }}
          >
            <SimpleBar style={{ height: '100%' }}>
              {renderFieldsData.length &&
                renderFieldsData.map((renderFields) => (
                  <Row className="m-0">{renderFields}</Row>
                ))}

              <Row className="p-3 m-0">
                <Label className="p-0 form-label">
                  Photos{' '}
                  <span
                    className="text-danger"
                    style={{ paddingLeft: '6px', fontSize: '10px' }}
                  >
                    Min 2 and Max 5
                  </span>
                </Label>
                <div className="previewImageMainDiv">
                  {photoPreviews.length > 0 &&
                    photoPreviews.map((preview, index) => (
                      <div key={index}>
                        <div className="image-preview">
                          <div
                            key={index}
                            className="position-relative d-inline-block me-3 mb-2"
                          >
                            <img
                              src={preview}
                              alt="Preview"
                              className="img-thumbnail"
                            />
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm position-absolute top-0 end-0 me-4"
                              onClick={() => handleEditImage(index)}
                              style={{ zIndex: 1 }}
                            >
                              <i className="ri-pencil-fill fs-10"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0"
                              onClick={() => handleRemoveImage(index)}
                            >
                              &times;
                            </button>
                            <input
                              type="file"
                              id={`file-input-${index}`}
                              style={{ display: 'none' }}
                              onChange={(e) => handleFileInputChange(e, index)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  {photoPreviews.length <= 4 && (
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
                      Please upload at least two photos.
                    </Col>
                  )}
                  <Col md={12} className="mt-3 mb-3">
                    <Label className="form-label mb-2">
                      Find your lat long
                    </Label>
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      zoom={8}
                      center={center}
                      onClick={onMapClick}
                      options={{ scrollwheel: false }}
                    >
                      {marker && (
                        <Marker
                          position={{ lat: marker.lat, lng: marker.lng }}
                        />
                      )}
                    </GoogleMap>
                  </Col>
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
              Close
            </button>
            <button
              type="submit"
              className={`btn btn-success position-relative d-flex justify-content-center ${
                addEditLoading && 'opacity-75'
              }`}
              onClick={() => {
                if (photoPreviews.length <= 1) {
                  setDisplayPhotoError(true);
                }
              }}
            >
              {addEditLoading && (
                <span className="position-absolute loader-wrapper">
                  <Loader error={null} />
                </span>
              )}
              {!!isEdit ? 'Update' : 'Add Ground'}
            </button>
          </div>
        </Form>
      </React.Fragment>
    );
  };

  const columns = useMemo(
    () =>
      groundTableFields(
        category,
        Status,
        handleCustomerClick,
        onClickDelete,
        editTimeSlot,
        displyBookings,
        bookSlot
      ),
    [handleCustomerClick, category]
  );

  const addGroundbutton = (
    <button
      type="button"
      className="btn btn-success add-btn"
      id="create-btn"
      onClick={() => {
        setPhotos([]);
        setPhotoPreviews([]);
        validation.resetForm();
        setSelectGround();
        setEditorHtml('');
        setIsEdit(false);
        setEditSlot(false);
        toggleRightCanvas();
      }}
    >
      <i className="ri-add-line align-bottom me-1"></i> Add Ground
    </button>
  );

  document.title = 'Ground | Velzon - React Admin & Dashboard Template';
  return (
    <React.Fragment>
      {!isDisplayBookings && (
        <>
          <div className="page-content">
            <DeleteModal
              show={deleteModal}
              onDeleteClick={handleDeleteCustomer}
              onCloseClick={() => setDeleteModal(false)}
            />
            <Container fluid>
              <BreadCrumb title="Ground" />
              <Row>
                <Col lg={12}>
                  <Card id="customerList">
                    <div className="card-body pt-0">
                      <div>
                        {isDataLoading ? (
                          <Loader error={error} />
                        ) : (
                          <TableContainer
                            key={ground.length}
                            columns={columns}
                            data={ground || []}
                            isAddUserList={false}
                            customPageSize={8}
                            className="custom-header-css"
                            handleCustomerClick={handleCustomerClicks}
                            SearchPlaceholder="Search for ground..."
                            isGlobalFilter={true}
                            title={'Grounds List'}
                            addContentButton={addGroundbutton}
                            divClass="table-responsive table-card"
                            tableClass="align-middle table-nowrap"
                            theadClass="table-light text-muted"
                          />
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
              editSlot ? (
                <TimeSlot
                  data={groundSlotData}
                  toggleRightCanvas={toggleRightCanvas}
                  updateSlots={updateSlots}
                  selectedGround={selectedGround}
                  addEditLoading={addEditLoading}
                />
              ) : isSlotDisplayForBooking ? (
                <AvailableTimeSlotForBooking
                  data={groundSlotDataForBooking}
                  getDifferentDateSlots={getDifferentDateSlots}
                  toggleRightCanvas={toggleRightCanvas}
                  selectedGround={selectedGround}
                />
              ) : (
                createGround()
              )
            }
            title={
              editSlot
                ? 'UpdateSlots'
                : isEdit
                  ? 'Update Ground'
                  : isSlotDisplayForBooking
                    ? 'Book slot'
                    : 'Create Ground'
            }
            isOpen={isRight}
            direction={null}
            toggleFunction={toggleRightCanvas}
            className="groundOffCanvas"
          />
        </>
      )}
      {isDisplayBookings && (
        <BookingList
          backToGround={closeEverything}
          bookingData={groundBookingsData}
        />
      )}
    </React.Fragment>
  );
};

export default Grounds;
