import React, { Component } from 'react';

import '../SignupForm.css';
import { signup, isValidEmail } from '../../api';

// required 3
// isValidEmail
// passwords the same

// async validate email

// submit

const handleErrors = (errors, field) =>
  errors.filter(e => e.field === field).map(e => (
    <p key={e.error} className="error">
      {e.error}
    </p>
  ));

class SignupForm extends Component {
  state = {
    errors: [],
    isSubmitting: false,
  };

  onSubmit = event => {
    event.preventDefault();
    const data = {
      email: event.target.email.value,
      password: event.target.password.value,
      passwordConfirm: event.target.passwordConfirm.value,
    };

    const errors = [];

    if (!data.email) errors.push({ field: 'email', error: 'Missing email' });
    if (!data.password)
      errors.push({ field: 'password', error: 'Missing password' });
    if (!data.passwordConfirm)
      errors.push({
        field: 'passwordConfirm',
        error: 'Missing password confirmation',
      });

    if (errors.length) return this.setState({ errors });

    if (!data.email.includes('@'))
      errors.push({ field: 'email', error: 'Incorrect email' });

    if (data.password !== data.passwordConfirm)
      errors.push({
        field: 'passwordConfirm',
        error: "Passwords doesn't match",
      });

    if (errors.length) return this.setState({ errors });
    this.setState({ isSubmitting: true });
    signup(data).then(
      r => this.setState({ errors: [], isSubmitting: false }),
      e =>
        this.setState({ errors: e.response.data.errors, isSubmitting: false })
    );
  };

  validateEmail = event => {
    const { value } = event.target;

    isValidEmail(value).then(
      r => this.setState({ errors: [] }),
      e => this.setState({ errors: [{ field: 'email', error: 'Email taken' }] })
    );
  };

  render() {
    return (
      <form className="form" onSubmit={this.onSubmit}>
        <label>
          Email:
          <div>
            <input type="text" name="email" onBlur={this.validateEmail} />
            {handleErrors(this.state.errors, 'email')}
          </div>
        </label>
        <label>
          Password:
          <div>
            <input type="password" name="password" />
            {handleErrors(this.state.errors, 'password')}
          </div>
        </label>
        <label>
          Password confirmation:
          <div>
            <input type="password" name="passwordConfirm" />
            {handleErrors(this.state.errors, 'passwordConfirm')}
          </div>
        </label>

        <button type="submit" disabled={this.state.isSubmitting}>
          Submit
        </button>
      </form>
    );
  }
}

export default SignupForm;
