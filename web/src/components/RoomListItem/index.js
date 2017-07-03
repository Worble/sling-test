
import React from 'react';

type Props = {
  room: {
    id: number,
    name: string,
  },
  currentUserRoomIds: Array,
  onRoomJoin: () => void,
  onRoomLeave: () => void,
}

const RoomListItem = ({ room, currentUserRoomIds, onRoomJoin, onRoomLeave }: Props) => {
  const isJoined = currentUserRoomIds.includes(room.id);

  return (
    <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
      <span style={{ marginRight: '8px' }}>{room.name}</span>
      {!isJoined &&
      <button
        onClick={() => onRoomJoin(room.id)}
        className="btn btn-sm"
        disabled={isJoined}
      >
        {isJoined ? 'Joined' : 'Join'}
      </button>
      }
      {isJoined &&
      <button
        onClick={() => onRoomLeave(room.id)}
        className="btn btn-sm"
        disabled={!isJoined}
      >
        {isJoined ? 'Leave' : 'Not Joined'}
      </button>
      }
    </div>
  );
};

export default RoomListItem;