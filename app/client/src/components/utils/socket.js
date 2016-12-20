import io from 'socket.io-client';
const socket = io(`${process.env.ROOT_SCHEME}://${process.env.ROOT_HOST}`);
export default socket;
