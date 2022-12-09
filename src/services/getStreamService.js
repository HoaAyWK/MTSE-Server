const { connect } = require('getstream');
const { StreamChat} = require('stream-chat')

const ApiError = require('../utils/ApiError');

const API_KEY = process.env.STEAM_API_KEY;
const API_SECRET = process.env.STREAM_API_SECRET;
const APP_ID = process.env.APP_ID;

class GetStreamSerivce {
    getStreamToken(userId) {
        try {
            const serverClient = connect(API_KEY, API_SECRET, APP_ID);
            const streamToken = serverClient.createUserToken(userId);

            return streamToken;
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    }

    async updateUserName(userId, name) {
        try {
            const clientChat = StreamChat.getInstance(API_KEY);
            await clientChat.upsertUser({ id: userId, name });
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    }
}

module.exports = new GetStreamSerivce;
