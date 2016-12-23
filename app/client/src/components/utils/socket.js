import io from 'socket.io-client';
const socket = io(window.location.origin);
export default socket;
