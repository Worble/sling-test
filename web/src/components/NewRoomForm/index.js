// @flow
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Errors from '../Errors';
import Input from '../Input';

type Props = {
  handleSubmit: () => void,
  onSubmit: () => void,
  submitting: boolean,
  errors: any,
}

class NewRoomForm extends Component {
  props: Props

  handleSubmit = data => this.props.onSubmit(data);

  render() {
    const { errors, handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleSubmit)}>
          <Field
            name="name"
            type="text"
            placeholder="Name"
            component={Input}
            className="form-control"
          />
          <Errors name="name" errors={errors} />
          <Field
            name="topic"
            type="text"
            placeholder="Topic"
            component={Input}
            className="form-control"
          />
          <Errors name="topic" errors={errors} />
            <button type="submit" className="btn btn-block btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Submit'}
            </button>
      </form>
    );
  }
}

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  }
  return errors;
};

export default reduxForm({
  form: 'newRoom',
  validate,
})(NewRoomForm);