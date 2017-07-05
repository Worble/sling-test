// @flow
import React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  roomSidebar: {
    color: '#ab9ba9',
    background: '#4d394b',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
  },

  header: {
    padding: '20px 15px',
    marginBottom: '10px',
    width: '220px',
  },

  roomName: {
    marginBottom: '0',
    fontSize: '22px',
    lineHeight: '1',
    color: '#fff',
  },

  userList: {
    paddingLeft: '15px',
    listStyle: 'none',
  },

  username: {
    position: 'relative',
    paddingLeft: '20px',
    fontSize: '14px',
    fontWeight: '300',
    ':after': {
      position: 'absolute',
      top: '7px',
      left: '0',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'rgb(64,151,141)',
      content: '""',
    },
  },

  listHeading: {
    marginLeft: '15px',
    marginBottom: '5px',
    fontSize: '13px',
    textTransform: 'uppercase',
  },

  leaveRoomButton:{
    margin: '10px',
    borderColor: '#819090',
    backgroundColor: '#261c25',
    color: '#b9b6b9',
  }
});

type User = {
  id: number,
  username: string,
}

type Props = {
  room: {
    name: string,
    subject: string,
  },
  currentUser: {
    username: string,
  },
  presentUsers: Array<User>,
  handleRoomLeave: () => void,
}

const RoomSidebar = ({ room, currentUser, presentUsers, handleRoomLeave, router }: Props) =>
  <div className={css(styles.roomSidebar)}>
    <div className={css(styles.header)}>
      <h2 className={css(styles.roomName)}>{room.name}</h2>
      <div style={{ fontSize: '13px' }}>change this to room owner eventually</div>
    </div>
    <div className={css(styles.listHeading)}>Active Users</div>
    <ul className={css(styles.userList)}>
      {presentUsers.map(user =>
        <li key={user.id} className={css(styles.username)}>{user.username}</li>
      )}
    </ul>
    <div style={{ flex: '1' }} />
    <button
      onClick={() => handleRoomLeave(room.id)}
      className={css(styles.leaveRoomButton)}
    >
      <div>
        <span>Leave Room</span>
      </div>
    </button>
  </div>;

RoomSidebar.contextTypes = {
  router: React.PropTypes.shape({
    history: React.PropTypes.object.isRequired,
  }),
};

export default RoomSidebar;