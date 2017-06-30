import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { hideAlert } from '../../actions/alert';
import Alert from '../../components/Alert';
import { withRouter } from 'react-router';

type Props = {
  pathname: string,
  visible: boolean,
  timeout?: number,
  message: string,
  hideAlert: () => void,
}

class AlertContainer extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = this.props;
    const { pathname } = location.pathname;

    if (visible && pathname !== nextProps.pathname) {
      this.props.hideAlert();
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.visible !== this.props.visible) return true;
    return false;
  }

  props: Props

  handleClose = () => this.props.hideAlert();

  render() {
    const { visible, timeout, message } = this.props;

    return visible
      ? <Alert
        message={message}
        timeout={timeout}
        onClose={this.handleClose}
      />
      : null;
  }
}

export default withRouter(connect(
  (state) => ({
    message: state.alert.message,
    visible: state.alert.visible,
    timeout: state.alert.timeout,
  }),
  { hideAlert }
)(AlertContainer));