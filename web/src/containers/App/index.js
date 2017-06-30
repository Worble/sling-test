// @flow
import React, { Component, PropTypes } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticate, unauthenticate, logout } from '../../actions/session';
import Home from '../Home';
import NotFound from '../../components/NotFound';
import Login from '../Login';
import Signup from '../Signup';
import MatchAuthenticated from '../../components/MatchAuthenticated';
import RedirectAuthenticated from '../../components/RedirectAuthenticated';
import Sidebar from '../../components/Sidebar';
import Room from '../Room';
import Alert from '../Alert';

type Props = {
  authenticate: () => void,
  unauthenticate: () => void,
  isAuthenticated: boolean,
  willAuthenticate: boolean,
  logout: () => void,
  currentUserRooms: Array,
}

class App extends Component {
  componentDidMount() {
    const token = localStorage.getItem('token');

    if (token) {
      this.props.authenticate();
    } else {
      this.props.unauthenticate();
    }
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  handleLogout = router => this.props.logout(router);

  props: Props

  render() {
    const { isAuthenticated, willAuthenticate, currentUserRooms } = this.props;
    const authProps = { isAuthenticated, willAuthenticate };

    return (
      <BrowserRouter>
          <div style={{ display: 'flex', flex: '1' }}>
            <Alert pathname={location.pathname} />
            {isAuthenticated &&
              <Sidebar
                rooms={currentUserRooms}
                onLogoutClick={this.handleLogout}
              />
            }
            <Switch>
              <MatchAuthenticated exact path="/" component={Home} {...authProps}/>
              <RedirectAuthenticated path="/login" component={Login} {...authProps}/>
              <RedirectAuthenticated path="/signup" component={Signup} {...authProps} />
              <MatchAuthenticated path="/r/:id" component={Room} {...authProps} />
              <Route component={NotFound} />
            </Switch>
          </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  state => ({
    isAuthenticated: state.session.isAuthenticated,
    willAuthenticate: state.session.willAuthenticate,
    currentUserRooms: state.rooms.currentUserRooms,
  }),
  { authenticate, unauthenticate, logout }
)(App);
