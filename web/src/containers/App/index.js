// @flow
import React, { Component } from 'react';
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
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  content: {
    height: '100%',   
    overflow: 'hidden',  /*makes the body non-scrollable (we will add scrolling to the sidebar and main content containers)*/
    margin: '0px',  /*removes default style*/
    display: 'flex',  /*enables flex content for its children*/
    boxSizing: 'border-box',
    width: '100%',
  },

  column: {
    height: '100%',  /*allows both columns to span the full height of the browser window*/
    display: 'flex',
    flexDirection: 'column',  /*places the left and right headers above the bottom content*/
    flexGrow: '1',  /*ensures that the container will take up the full height of the parent container*/
    overflowY: 'auto',  /*adds scroll to this container*/
  },

  left: {
    flexShrink: '0',  /*makes sure that content is not cut off in a smaller browser window*/
  },

  right: {
    width: '100%',
  },
});

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

  handleLogout = () => this.props.logout();

  props: Props

  render() {
    const { isAuthenticated, willAuthenticate, currentUserRooms } = this.props;
    const authProps = { isAuthenticated, willAuthenticate };

    return (
      <BrowserRouter>
          <div className={css(styles.content)}>
            <Alert pathname={location.pathname} />
            <div className={css(styles.column, styles.left)}>
              {isAuthenticated &&
                <Sidebar
                  rooms={currentUserRooms}
                  onLogoutClick={this.handleLogout}
                />
              }
            </div>
            <div className={css(styles.column, styles.right)}>
            <Switch>
              <MatchAuthenticated exact path="/" component={Home} {...authProps}/>
              <RedirectAuthenticated path="/login" component={Login} {...authProps}/>
              <RedirectAuthenticated path="/signup" component={Signup} {...authProps} />
              <MatchAuthenticated path="/r/:id" component={Room} {...authProps} />
              <Route component={NotFound} />
            </Switch>
            </div>
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
