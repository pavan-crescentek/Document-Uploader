import React from 'react';
import { Col, FormFeedback, FormGroup, Input, Label } from 'reactstrap';

const RenderFormSingleColumn = ({
  fieldNames,
  fields,
  validation,
  isEdit = null,
}) => {
  const passwordGenerator = () => {
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';

    const allCharacters =
      lowerCaseLetters + upperCaseLetters + numbers + specialCharacters;
    const passwordLength = Math.floor(Math.random() * 2) + 12;

    let password = '';
    password +=
      lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
    password +=
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password +=
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
    for (let i = 4; i < passwordLength; i++) {
      password +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    password = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    validation.setFieldValue('password', password);
  };

  return (
    fieldNames &&
    fieldNames.map((name, index) => {
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
            ) : field.type === 'textarea' ? (
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
            ) : field.type === 'password' ? (
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
            ) : field.type === 'email' ? (
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
                disabled={isEdit}
                autoComplete="off"
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
            {validation.touched[field.name] && validation.errors[field.name] ? (
              <FormFeedback type="invalid">
                {validation.errors[field.name]}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      );
    })
  );
};

export default RenderFormSingleColumn;
