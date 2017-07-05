// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { connectToChannel, leaveChannel, createMessage, loadOlderMessages } from '../../actions/room';
import { leaveRoom } from '../../actions/rooms';
import MessageList from '../../components/MessageList';
import MessageForm from '../../components/MessageForm';
import RoomNavbar from '../../components/RoomNavbar';
import RoomSidebar from '../../components/RoomSidebar';

type MessageType = {
  id: number,
}

type Props = {
  socket: any,
  channel: any,
  room: Object,
  match: {
    params: {
      id: number,
    }
  },
  connectToChannel: () => void,
  leaveChannel: () => void,
  createMessage: () => void,
  messages: Array<MessageType>,
  presentUsers: Array,
  currentUser: Object,
  loadingOlderMessages: boolean,
  pagination: {
    total_pages: number,
    total_entries: number,
    page_size: number,
    page_number: number,
  },
  loadOlderMessages: () => void,
  leaveRoom: () => void,
}

class Room extends Component {
  componentDidMount() {
    this.props.connectToChannel(this.props.socket, this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      this.props.leaveChannel(this.props.channel);
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
    if (!this.props.socket && nextProps.socket) {
      this.props.connectToChannel(nextProps.socket, nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.leaveChannel(this.props.channel);
  }

  props: Props

  handleLoadMore = () =>
    this.props.loadOlderMessages(
      this.props.match.params.id,
      { last_seen_id: this.props.messages[0].id }
    )

  handleMessageCreate = (data) => {
    this.props.createMessage(this.props.channel, data);
  }

  handleRoomLeave = roomId => this.props.leaveRoom(roomId, this.context.router);

  render() {

    const moreMessages = this.props.pagination.total_pages > this.props.pagination.page_number;

    return (
      <div style={{ display: 'flex', height: '100vh' }}>
        <RoomSidebar
          room={this.props.room}
          currentUser={this.props.currentUser}
          presentUsers={this.props.presentUsers}
          handleRoomLeave={this.handleRoomLeave}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <RoomNavbar room={this.props.room} />
          <MessageList
            moreMessages={moreMessages}
            messages={this.props.messages}
            onLoadMore={this.handleLoadMore}
            ref={(c) => { this.messageList = c; }}
            loadingOlderMessages={this.props.loadingOlderMessages} />
          <MessageForm onSubmit={this.handleMessageCreate} />
        </div>
      </div>
    );
  }
}

Room.contextTypes = {
  router: React.PropTypes.shape({
    history: React.PropTypes.object.isRequired,
  }),
};

export default connect(
  (state) => ({
    room: state.room.currentRoom,
    socket: state.session.socket,
    channel: state.room.channel,
    messages: state.room.messages,
    presentUsers: state.room.presentUsers,
    currentUser: state.session.currentUser,
    pagination: state.room.pagination,
    loadingOlderMessages: state.room.loadingOlderMessages,
  }),
  { connectToChannel, leaveChannel, createMessage, loadOlderMessages, leaveRoom }
)(Room);