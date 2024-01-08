let onlineUser = [];

function joinRoom(socket, io) {
    socket.on("newUser", (data) => {
        console.log(data);

        if (data) {
            let userId = data;

            let userExsit = onlineUser.find((x) => x.userId == userId);

            if (!userExsit) {
                let arrayTab = [];
                arrayTab.push(socket.id);
                console.log(userId);
                onlineUser.push({ userId, userSocket: arrayTab });
            } else {
                userExsit.userSocket.push(socket.id);
            }
        }
        io.emit("onlineuser", onlineUser);
    });
}

function joinChat(socket, io) {
    socket.on("userJoinBid", (disId) => {
        console.log("disId",disId   );
        socket.join(disId.bid_id);
    });
}

function joinNotification(socket, io) {
    socket.on("join-notifs", (my_id) => {
        console.log("user join notifs" + my_id);
    });
}

function leaveChat(socket, io) {
    socket.on("leaveRoom", (roomName) => {
        socket.leave(roomName);
    });
}

function notification_user(socket, io) {
    socket.on("newnotif", async (data) => {
        const resData = data.notification.email;
        let arrF = onlineUser.find((user) => {
            return user.userId == resData;
        });

        if (arrF)
            arrF.userSocket.map((x) => {
                io.to(x).emit("getNotfi", { data: data.notification });
            });
    });
}

function sendMessage(socket, io) {
    
    socket.on("newBid", (data) => {
    
        io.to(data.roomId).emit("receiveBid", data);

    });

}





function sendNotification(socket, io) {

    socket.on("sendNotification", ({ notification }) => {
        let arrF = onlineUser.find((user) => {
            return user.userId == notification.id_receiver;
        });

        if (arrF)
            arrF.userSocket.map((x) => {
                io.to(x).emit("notification", notification);
            });
    });

}


  

module.exports = {
    joinRoom,
    notification_user,
    sendMessage,
    joinChat,
    leaveChat,
    joinNotification,
    sendNotification,

};
