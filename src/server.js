require('dotenv').config();
const http = require('http');
const { v4: uuidv4 } = require('uuid');
// const Redis = require("ioredis");


// const redisClient = new Redis();
const app = require('./app');
const { connectDatabase } = require('./config/database');
const { RedisMessageStore, InMemoryMessageStore } = require('./utils/messageStore');
const { RedisSessionStore, InMemorySessionStore } = require('./utils/sessionStore');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const origin = "http://localhost:3000";

// const sessionStore = new RedisSessionStore(redisClient);
// const messageStore = new RedisMessageStore(redisClient);

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

const io = require("socket.io")(server, {
    cors: {
        origin
    }
});

connectDatabase();

io.use(async (socket, next) => {
    const sessionId = socket.handshake.auth.sessionId;

    if (sessionId) {
        const session = await sessionStore.findSession(sessionId);

        if (session) {
            socket.sessionId = sessionId;
            socket.userId = session.userId;
            socket.socketId = session.socketId;
        }

        return next();
    }

    const userId = socket.handshake.auth.userId;

    if (!userId) {
        return next(new Error('invalid userId'));
    }

    socket.userId = userId;
    socket.sessionId = uuidv4();
    socket.socketId = uuidv4();
    next();
});

io.on('connection', async (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    sessionStore.saveSession(socket.sessionId, {
        socketId: socket.socketId,
        userId: socket.userId,
        connected: true
    });

    socket.emit("session", {
        sessionId: socket.sessionId,
        socketId: socket.socketId
    });
    console.log(socket.userId);
    socket.join(socket.userId);

    const [notifications, newMessages] = await Promise.all([
        messageStore.findMessagesForUser(socket.userId),
        messageStore.countNewMessageForUser(socket.userId),
    ]);

    socket.emit('notifications', { notifications, newMessages });
    console.log(notifications);

    socket.on('apply job', ({ freelancerId, username, avatar, jobId, jobName, to }) => {
        console.log('freelancer apply job');

        const message = { freelancerId, username, avatar, jobId, jobName, applyDate: new Date(), isRead: false, to };
        console.log(to);
        socket.to(to).emit('apply job', message);

        messageStore.saveMessage(message);
    });

    socket.on('mark all as read', async () => {
        await messageStore.markAllUserMessagesAsRead(socket.userId);
    });

    socket.on('disconnect', async () => {
        console.log('🔥: A user disconnected');
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;

        if (isDisconnected) {
            socket.broadcast.emit("user disconnected", socket.userId);
            // update the connection status of the session
            sessionStore.saveSession(socket.sessionId, {
                userId: socket.userId,
                socketId: socket.socketId,
                connected: false,
            });
        }
    });
});

server.listen(PORT, () => 
    console.log(`http://localhost:${PORT}`)
);

module.exports = app