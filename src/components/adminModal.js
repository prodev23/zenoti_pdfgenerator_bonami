import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Button, Row, Col, Form, FormGroup, FormControl, FormLabel, Modal, ModalBody, ModalTitle } from 'react-bootstrap';
import Select from 'react-select';

const defaultData = {
  title: "",
  description: "",
  business_benefits: "",
  vertical: null,
  area: null,
  country: null,
  differentiator: null,
};

const AdminModal = ({
  verticalOption,
  areaOption,
  regionOption,
  adminModal,
  deleteAdminModal,
  addProductFlag,
  deleteProductFlag,
  selectedRow,
  toggleAdminModal,
  toggleDeleteAdminModal,
  saveProduct,
  deleteProduct,
}) => {
  const { control, register, handleSubmit, setValue, reset, watch, errors } = useForm({ defaultValues: defaultData });
  const isEdit = selectedRow && selectedRow.isEdit ? true : false;


  useEffect(() => {
    let data = {};
    let verticals = null;
    let selectedCoutry = null;
    if (selectedRow && selectedRow.data) {
      data = { ...selectedRow.data };
    }
    else {
      verticals = verticalOption.map(v => v.value);
      selectedCoutry = regionOption;
      data.differentiator = "yes";
    }
    if (data.differentiator === null) {
      data.differentiator = "yes";
    }
    if (data.vertical) {
      verticals = data.vertical;
    }
    if (data.country) {
      selectedCoutry = regionOption.find(c => c.value === data.country);
    }
    if (data.differentiator !== undefined && data.differentiator !== null) {
      data.differentiator = data.differentiator ? "yes" : "no";
    }
    reset({
      title: data.title || "",
      description: data.description || "",
      business_benefits: data.business_benefits || "",
      vertical: verticals && verticals.map(v => ({ value: v, label: v })) || null,
      area: data.area ? { value: data.area, label: data.area } : null,
      country: selectedCoutry,
      differentiator: data.differentiator || null,
    })
  }, [selectedRow]);

  const handleSave = (data) => {
    const newData = { ...data };
    newData.vertical = newData.vertical.map(v => v.value);
    newData.area = newData.area && newData.area.value;
    if (isEdit) {
      newData.country = isEdit && newData.country ? newData.country.value : ""
    } else {
      newData.country = newData.country ? newData.country.map(c => c.value) : [];
    }
    if (newData.differentiator === "yes") {
      newData.differentiator = true;
    } else if (newData.differentiator === "no") {
      newData.differentiator = false;
    } else {
      newData.differentiator = null;
    }
    saveProduct(newData);
  }

  return <>
    <Modal size="lg" show={adminModal} centered onHide={() => toggleAdminModal(null)}>
      <Modal.Header closeButton>
        <ModalTitle className="px-4">{`${isEdit ? 'Edit' : 'Add'} Feature`}</ModalTitle>
      </Modal.Header>
      <ModalBody className="px-5">
        <Form onSubmit={handleSubmit(handleSave)}>
          <Row>
            <Col lg={6} md={12}>
              <FormGroup controlId="admin-title">
                <FormLabel className="text-secondary">Feature</FormLabel>
                <FormControl
                  placeholder="Enter Feature"
                  name="title"
                  ref={register({
                    required: "Feature is required",
                    maxLength: {
                      value: 150,
                    },
                  })}
                  onChange={e => {
                    if (e.target.value.length >= 150) {
                      const trimedValue = e.target.value.slice(0, 150);
                      setValue('title', trimedValue);
                    }
                  }}
                />
                {watch("title") && watch("title").length >= 100 && <p className="form-error text-muted">{(150 - watch("title").length)} characters left</p>}
                {errors.title && <p className="form-error">{errors.title.message}</p>}
              </FormGroup>
            </Col>
            <Col sm={12}>
              <FormGroup controlId="admin-description">
                <FormLabel className="text-secondary">Description</FormLabel>
                <FormControl
                  as="textarea"
                  placeholder="Enter Description"
                  name="description"
                  rows={5}
                  ref={register({
                    required: "Description is required",
                    maxLength: {
                      value: 800,
                    },
                  })}
                  onChange={e => {
                    if (e.target.value.length >= 800) {
                      const trimedValue = e.target.value.slice(0, 800);
                      setValue('description', trimedValue);
                    }
                  }}
                />
                {watch("description") && watch("description").length >= 750 && <p className="form-error text-muted">{(800 - watch("description").length)} characters left</p>}
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </FormGroup>
            </Col>
            <Col sm={12}>
              <FormGroup>
                <FormLabel className="text-secondary mb-0">Unique to Zenoti</FormLabel>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Yes"
                    name="differentiator"
                    ref={register}
                    value="yes"
                    defaultChecked={watch("differentiator") === true}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="No"
                    name="differentiator"
                    ref={register}
                    value="no"
                    defaultChecked={watch("differentiator") === false}
                  />
                  {errors.product_feature && <p className="form-error">{errors.product_feature.message}</p>}
                </div>
              </FormGroup>
            </Col>
            <Col sm={12}>
              <FormGroup controlId="admin-benefits">
                <FormLabel className="text-secondary">Business Impact</FormLabel>
                <FormControl
                  as="textarea"
                  placeholder="Enter Business Impact"
                  name="business_benefits"
                  rows={4}
                  ref={register({
                    maxLength: {
                      value: 300,
                    },
                  })}
                  onChange={e => {
                    if (e.target.value.length >= 300) {
                      const trimedValue = e.target.value.slice(0, 300);
                      setValue('business_benefits', trimedValue);
                    }
                  }}
                />{watch("business_benefits") && watch("business_benefits").length >= 250 && <p className="form-error text-muted">{(300 - watch("business_benefits").length)} characters left</p>}
                {errors.business_benefits && <p className="form-error">{errors.business_benefits.message}</p>}
              </FormGroup>
            </Col>
            <Col lg={6} md={12}>
              <FormGroup controlId="admin-area">
                <FormLabel className="text-secondary">Area</FormLabel>
                <Controller
                  as={Select}
                  control={control}
                  classNamePrefix="form-select"
                  name="area"
                  placeholder="Select area"
                  options={areaOption}
                  defaultValue={null}
                  isClearable
                  menuPlacement="auto"
                  rules={{
                    required: "Area is required"
                  }}
                />
                {errors.area && <p className="form-error">{errors.area.message}</p>}
              </FormGroup>
            </Col>
            <Col lg={6} md={12}>
              <FormGroup controlId="admin-vertical">
                <FormLabel className="text-secondary">Vertical</FormLabel>
                <Controller
                  control={control}
                  name="vertical"
                  rules={{
                    required: "Vertical is required"
                  }}
                  render={(controllerProps) => {
                    let verticalList = [...verticalOption];
                    if (!controllerProps.value || controllerProps.value.length !== verticalOption.length) {
                      verticalList = [{ label: "All", value: "all" }, ...verticalOption];
                    }
                    return (
                      <Select
                        classNamePrefix="form-select"
                        placeholder="Select Vertical"
                        options={verticalList}
                        defaultValue={null}
                        isClearable
                        isMulti
                        menuPlacement="auto"
                        value={controllerProps.value}
                        onChange={(value, { option }) => {
                          if (option && option.value === "all") {
                            control.setValue("vertical", verticalOption);
                          } else {
                            control.setValue("vertical", value);
                          }
                        }}
                        onMenuClose={() => {
                          if (Array.isArray(watch("vertical")) && watch("vertical").length === 0) {
                            control.setValue("vertical", null);
                          }
                        }}
                      />
                    )
                  }}
                />
                {errors.vertical && <p className="form-error">{errors.vertical.message}</p>}
              </FormGroup>
            </Col>
            <Col lg={6} md={12}>
              <FormGroup controlId="admin-country">
                <FormLabel className="text-secondary">Region {!isEdit && regionOption.length > 10 && <small>(Maximum 10 regions allowed)</small>}</FormLabel>
                <Controller
                  control={control}
                  name="country"
                  rules={{
                    required: "Region is required"
                  }}
                  render={(controllerProps) => {
                    let regionList = [...regionOption];
                    if (!isEdit && (!controllerProps.value || controllerProps.value.length !== regionOption.length)) {
                      regionList = [{ label: "All", value: "all" }, ...regionOption];
                    }
                    return (
                      <Select
                        classNamePrefix="form-select"
                        placeholder="Select region"
                        options={regionList}
                        isClearable
                        isMulti={!isEdit}
                        defaultValue={null}
                        value={controllerProps.value}
                        menuPlacement="auto"
                        onChange={(value, { option }) => {
                          if (option && option.value === "all") {
                            control.setValue("country", regionOption);
                          } else {
                            control.setValue("country", value);
                          }
                        }}
                        isOptionDisabled={() => {
                          return !isEdit && watch("country") ? watch("country").length >= 10 : false
                        }}
                        onMenuClose={() => {
                          if (!isEdit && Array.isArray(watch("country")) && watch("country").length === 0) {
                            control.setValue("country", null);
                          }
                        }}
                      />
                    )
                  }}
                />
                {!isEdit && regionOption.length > 10 && watch("country") && <p className="form-error text-muted">{watch("country").length >= 5 ? `${10 - watch("country").length} selections left` : ""}</p>}
                {errors.country && <p className="form-error">{errors.country.message}</p>}
              </FormGroup>
            </Col>
          </Row>
          <div className="button-container">
            <Button variant="primary" type="submit" className="mx-2" disabled={addProductFlag}>{isEdit ? 'Save' : 'Add'}</Button>
            <Button variant="secondary" type="button" className="mx-2" onClick={() => toggleAdminModal(null)}>Cancel</Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
    <Modal show={deleteAdminModal} onHide={() => toggleDeleteAdminModal(null)}>
      <Modal.Header closeButton>
        <ModalTitle>Delete Feature</ModalTitle>
      </Modal.Header>
      <ModalBody>
        <p>Are you sure you want to delete this feature?</p>
        <div className="button-container">
          <Button variant="primary" type="button" className="mx-2" onClick={() => deleteProduct()} disabled={deleteProductFlag}>Delete</Button>
          <Button variant="secondary" type="button" className="mx-2" onClick={() => toggleDeleteAdminModal(null)}>Cancel</Button>
        </div>
      </ModalBody>
    </Modal>
  </>
}

export default AdminModal;