/* abstract */ 
class MessageStore {
    saveMessage(message) {}
    findMessagesForUser(userID) {}
    countNewMessageForUser(userID) {}
}
  
class InMemoryMessageStore extends MessageStore {
    constructor() {
        super();
        this.messages = [];
    }
  
    saveMessage(message) {
        this.messages.push(message);
    }
  
    findMessagesForUser(userID) {
        return this.messages.filter(
            ({ to }) =>  to === userID
        );
    }

    countNewMessageForUser(userID) {
        return this.messages.filter(({ to, isRead }) => to === userID && !isRead).length;
    }

    markAllUserMessagesAsRead(userID) {
        this.messages.forEach(message => {
            if (message.to === userID) {
                message.isRead = true;
            }
        })
    }
}

const CONVERSATION_TTL = 7 * 24 * 60 * 60;

class RedisMessageStore extends MessageStore {
    constructor(redisClient) {
        super();
        this.redisClient = redisClient;
    }

    saveMessage(message) {
        const value = JSON.stringify(message);

        this.redisClient
            .multi()
            .rpush(`messages:${message.to}`, value)
            .expire(`messages:${message.to}`, CONVERSATION_TTL)
            .exec();
    }

    findMessagesForUser(userID) {
        return this.redisClient
            .lrange(`messages:${userID}`, 0, -1)
            .then((results) => {
                return results.map((result) => JSON.parse(result));
            }
        );
    }

    async countNewMessageForUser(userId) {
        const messages = await this.redisClient
            .lrange(`messages:${userId}`, 0, -1)
            .then((results) => {
                return results.map((result) => JSON.parse(result));
            }
        );

        const num  = messages.filter(({ isRead }) => !isRead).length;

        return num;
    }

    async markAllUserMessagesAsRead(userId) {
        const messages = await this.redisClient
            .lrange(`messages:${userId}`, 0, -1)
            .then((results) => {
                return results.map((result) => JSON.parse(result));
            }
        
        );

        const num  = messages.filter(({ isRead }) => !isRead).length;
        
        if (num > 0) {
            messages.forEach(async (message) => {
                await this.redisClient.lpop(`messages:${userId}`);
            })
    
            messages.forEach((message) => {
                let value = JSON.stringify({ ...message, isRead: true });
                this.redisClient.multi()
                    .rpush(`messages:${message.to}`, value)
                    .expire(`messages:${message.to}`, CONVERSATION_TTL)
                    .exec();
            });
        }
    }
}

module.exports = {
    InMemoryMessageStore,
    RedisMessageStore
};
