import {default as handleNotifications} from './notification';

export default (io, socket) => {
    handleNotifications(io, socket);
};
