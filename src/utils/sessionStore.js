/* abstract */ 
class SessionStore {
    findSession(id) {}
    saveSession(id, session) {}
}
  
class InMemorySessionStore extends SessionStore {
    constructor() {
        super();
        this.sessions = new Map();
    }

    findSession(id) {
        return this.sessions.get(id);
    }

    saveSession(id, session) {
        this.sessions.set(id, session);
    }
}

const SESSION_TTL = 7 * 24 * 60 * 60;
const mapSession = ([userId, scoketId, connected]) =>
  userId ? { userId, scoketId, connected: connected === "true" } : undefined;

class RedisSessionStore extends SessionStore {
    constructor(redisClient) {
        super();
        this.redisClient = redisClient;
    }

    findSession(id) {
        return this.redisClient
            .hmget(`session:${id}`, "userId", "scoketId", "connected")
            .then(mapSession);
    }

    saveSession(id, { userId, socketId, connected }) {
        this.redisClient
            .multi()
            .hset(
                `session:${id}`,
                "userId",
                userId,
                "socketId",
                socketId,
                "connected",
                connected
            )
            .expire(`session:${id}`, SESSION_TTL)
            .exec();
    }
}

module.exports = { 
    InMemorySessionStore,
    RedisSessionStore
};
