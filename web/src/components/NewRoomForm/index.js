// @flow
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Errors from '../Errors';
import Input from '../Input';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  createRoomButton: {
    verticalAlign: 'top',
  },
});

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
        <div className="input-group">
          <Field
            name="name"
            type="text"
            placeholder="Name"
            component={Input}
            className="form-control"
          />
          <Errors name="name" errors={errors} />
          <div className={`input-group-btn ${css(styles.createRoomButton)}`}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Submit'}
            </button>
          </div>
        </div>
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