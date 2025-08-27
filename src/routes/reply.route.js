const express = require('express');
const router = express.Router();
const ReplyController = require('../controllers/reply.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.authenticateToken);

router.post('/post/:postId', ReplyController.createReplyForPost);
router.post('/reply/:replyId', ReplyController.createReplyForReply);

router.put('/:id', ReplyController.updateReply);
router.delete('/:id', ReplyController.deleteReply);

module.exports = router;