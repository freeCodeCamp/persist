const handleNotifications = (socket) => {

    socket.on('subscribe', (data) => {
        socket.join(data.room);
    });
    socket.on('unsubscribe', (data) => {
        socket.leave(data.room);
    });
    
};

export default handleNotifications;
