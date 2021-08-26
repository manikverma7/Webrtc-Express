import IO from 'socket.io-client';
import Peer from 'react-native-peerjs';

import {ADD_STREAM, ADD_REMOTE_STREAM, MY_STREAM} from './types';

//Api Url
// 192.168.1.4

export const API_URI = `https://192.168.1.8:5000`;

//Socket Config
export const socket = IO(`${API_URI}`, {
  forceNew: true,
});

socket.on('connection', () => console.log('Connected client'));

// Peer Config
const peerServer = new Peer(undefined, {
  host: '192.168.1.8',
  secure: false,
  // port: 5000,
  path: '/mypeer',
});

peerServer.on('error', () => console.log('error in peer server'));

export const joinRoom = (stream) => async (dispatch) => {
  console.log(stream, 'In actions');
  const roomId = 'asfdasfsdfgsdgvsd';

  //Set My own Stream
  dispatch({type: MY_STREAM, payload: stream});

  //Open a connection to our server
  peerServer.on('open', (userId) => {
    console.log('open call');
    socket.emit('join-room', {userId, roomId});
  });

  socket.on('user-connected', (userId) => {
    console.log('new user added');
    connectToNewUser(userId, stream, dispatch);
  });

  //Recieve a call
  peerServer.on('call', (call) => {
    call.answer(stream);
    console.log('Call recieved');
    // streeam back the call

    call.on('stream', (stream) => {
      dispatch({type: ADD_STREAM, payload: stream});
    });
  });
};

function connectToNewUser(userId, stream, dispatch) {
  const call = peerServer.call(userId, stream);
}
