const ApiError = require('../utils/ApiError');
const { Comment } = require('../models');

class CommentService {
    async getCategories(num) {
        let comments;

        if (num) {
            comments = await Comment.find().limit(num);
        } else {
            comments = await Comment.find();
        }

        return comments;
    }

    async getCommentsBySender(senderId) {
        return await Comment.find({ sender: senderId });
    }

    async getCommentsByReceiver(receiverId) {
        return await Comment.find({ receiver: receiverId });
    }

    async createComment(comment) {
        return await Comment.create(comment);
    }

    async getCommentById(id) {
        return await Comment.findById(id);
    }

    async updateComment(id, updateBody) {
        const comment = await Comment.findById(id).lean();

        if (!comment) {
            throw new ApiError(404, 'Comment not found');
        }

        return await Comment.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deleteComment(id) {
        const comment = await Comment.findById(id);

        if (!comment) {
            throw new ApiError(404, 'Comment not found');
        }

        await comment.remove();
    }
}


module.exports = new CommentService;
