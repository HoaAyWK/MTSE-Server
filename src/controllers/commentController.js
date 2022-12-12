const commentService = require('../services/commentService')

const userService = require('../services/userService')
const accountService = require('../services/accountService');
const employerService = require('../services/employerService');
const freelancerService = require('../services/freelancerService');
const { ROLES } = require('../constants/constants');
const ApiError = require('../utils/ApiError');


class CommentController{
    async createComment(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const user = await userService.getUserById(req.userId)

            if (user == null) {
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            req.body.sender = req.userId

            const receiver = await userService.getUserById(req.body.receiver)

            if (receiver == null){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const commentsReceiver = await commentService.getCommentsByReceiver(req.body.receiver)

            const numComments = commentsReceiver.length

            const newStar = ((receiver.stars * numComments) + req.body.star) / (numComments + 1)


            const newComment = await commentService.createComment(req.body)

            await userService.changeStar(req.body.receiver, newStar, numComments + 1)

            return res.status(200).json({
                success: true,
                messgae: "Create Comment Successfully",
                comment: newComment
            })




        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }


    async getMyComments(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const postedComments = await commentService.getCommentsBySender(req.userId)
            const isPostedComments = await commentService.getCommentsByReceiver(req.userId)

            for (var i =0; i<postedComments.length; i++){
                var user = await userService.getUserById(postedComments[i].receiver)
                postedComments[i].receiver = user
            }

            for (var i =0; i<isPostedComments.length; i++){
                var user = await userService.getUserById(isPostedComments[i].sender)
                isPostedComments[i].sender = user
            }

            return res.status(200).json({
                postedComments,
                isPostedComments
            })
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }


    async editComment(req, res){
        try{
            if(!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            if (!req.query.id){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Comment"
                })
            }

            const comment = await commentService.getCommentById(req.query.id)

            if (!comment){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Comment"
                })
            }

            if (comment.sender != req.userId){
                return res.status(400).json({
                    success: false,
                    message: "You are not Owner of Comment"
                })
            }

            const {star} = req.body

            const comments = await commentService.getCommentsByReceiver(comment.receiver)

            const receiver = await userService.getUserById(comment.receiver)

            if (!receiver){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Receiver"
                })
            }

            const oldStar = comment.star

            const newStar = ((receiver.stars)*(comments.length) - oldStar + star) / (comments.length)

            await userService.changeStar(receiver.id, newStar)

            await commentService.editComment(comment.id, req.body)

            return res.status(200).json({
                success: true,
                message: "Edit Comment Successfully"
            })

        }   
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }

    async getCommentsOfObject(req, res){
        try{
            const {id} = req.query
            if (!id){
                return res.status(400).json({
                    success: false,
                    message: "Unknow"
                })
            }
            const postedComments = await commentService.getCommentsBySender(id)
            const isPostedComments = await commentService.getCommentsByReceiver(id)

            for (var i =0; i<postedComments.length; i++){
                var user = await userService.getUserById(postedComments[i].receiver)
                postedComments[i].receiver = user
            }

            for (var i =0; i<isPostedComments.length; i++){
                var user = await userService.getUserById(isPostedComments[i].sender)
                isPostedComments[i].sender = user
            }

            return res.status(200).json({
                postedComments,
                isPostedComments
            })

        }
        catch(error){

        }
    }

    async getCommentedForReceiver(req, res, next) {
        try {    
            let comments = await commentService.getCommentsByReceiver(req.query.receiver);
            const receiAccount = await accountService.getAccountByUserId(req.query.receiver);
            
            if (receiAccount.role === ROLES.FREELANCER) {
                for (let com in comments) {
                    const employer = await employerService.getByUserIdAndLean(comments[com].sender._id);
                    if (!employer) {
                        comments[com] = null;
                    } else {
                        comments[com].sender['employer'] = employer;
                    }
                }
            } else if (receiAccount.role === ROLES.EMPLOYER) {
                for (let com in comments) {
                    const freelancer = await freelancerService.getByUserIdAndLean(comments[com].sender._id);
                    if (!freelancer) {
                        comments[com] = null;
                    } else {
                        comments[com].sender['freelancer'] = freelancer;
                    }
                }
            }

            comments = comments.filter(c => c !== null);

            res.status(200).json({
                success: true,
                comments
            });
        } catch (error) {
            next(error);
        }
    }

    async getCommentsForSender(req, res, next) {
        try {
            let comments = await commentService.getCommentsBySender(req.query.sender);
            const senderAccount = await accountService.getAccountByUserId(req.query.sender);

            if (!senderAccount) {
                throw new ApiError(400, 'Account not found');
            }

            if (senderAccount.role === ROLES.FREELANCER) {
                for (let com in comments) {
                    const employer = await employerService.getByUserIdAndLean(comments[com].receiver._id);
                    if (!employer) {
                        comments[com] = null;
                    } else {
                        comments[com].employer = employer;
                    }
                }
            } else if (senderAccount.role === ROLES.EMPLOYER) {
                for (let com in comments) {
                    const freelancer = await freelancerService.getByUserIdAndLean(comments[com].receiver._id);   
                    if (!freelancer) {
                        comments[com] = null;
                    } else {
                        comments[com].freelancer = freelancer;
                    }
                }
            }

            comments = comments.filter(c => c !== null);

            res.status(200).json({
                success: true,
                comments
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommentController