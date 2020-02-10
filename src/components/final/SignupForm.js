import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';

import '../SignupForm.css';
import { signup, validateEmail } from '../../api';

// required 3
// isValidEmail
// passwords the same

// async validate email

// submit

const required = value => (!value ? 'Missing value' : '');
const isValidEmail = value => (!value.includes('@') ? 'Incorrect email' : '');
const matchPasswords = (passwordConfirm, { password }) =>
  passwordConfirm !== password ? "Password doesn't match" : '';

const asyncValidateEmail = email => {
  return validateEmail(email).then(
    r => {},
    e => {
      return 'Email taken';
    }
  );
};

const composeValidators = (...validators) => (...rest) =>
  validators.reduce(
    (error, validator) => error || validator(...rest),
    undefined
  );

const mapErrors = errors =>
  errors.reduce(
    (acc, e) => {
      acc[e.field] = e.error;
      return acc;
    },
    { _error: 'Form invalid' }
  );

function renderInputWithError({
  input,
  type,
  label,
  meta: { error, submitError, touched },
}) {
  return (
    <label>
      {label}:
      <div>
        <input {...input} type={type} />
        {touched &&
          (error || submitError) && (
            <p className="error">{error || submitError}</p>
          )}
      </div>
    </label>
  );
}

class SignupForm extends Component {
  onSubmit = values => {
    return signup(values).then(
      r => {},
      e => {
        return mapErrors(e.response.data.errors);
      }
    );
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        {({ handleSubmit, submitting, valid }) => (
          <form className="form" onSubmit={handleSubmit}>
            <Field
              render={renderInputWithError}
              type="text"
              name="email"
              label="Email"
              validate={composeValidators(
                required,
                isValidEmail
                // asyncValidateEmail
              )}
            />
            <Field
              render={renderInputWithError}
              type="password"
              name="password"
              label="Password"
              validate={required}
            />
            <Field
              render={renderInputWithError}
              type="password"
              name="passwordConfirm"
              label="Password confirmation"
              validate={composeValidators(required, matchPasswords)}
            />

            <button type="submit" disabled={submitting || !valid}>
              Submit
            </button>
          </form>
        )}
      </Form>
    );
  }
}

export default SignupForm;
