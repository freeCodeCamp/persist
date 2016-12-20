import {default as handleNotifications} from './notification';

export default (socket) => {
    handleNotifications(socket);
};
