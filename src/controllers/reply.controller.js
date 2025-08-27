const ReplyService = require('../service/reply.service');

async function createReplyForPost(req, res) {
    try {
        const reply = await ReplyService.createReply(req.user.id, {
            postId: req.params.postId,
            isi: req.body.isi
        });
        res.status(201).json(reply);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function createReplyForReply(req, res) {
    try {
        const reply = await ReplyService.createNestedReply(req.user.id, req.params.replyId, req.body);
        res.status(201).json(reply);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateReply(req, res) {
    try {
        const reply = await ReplyService.updateReply(req.user.id, req.params.id, req.body);
        res.status(200).json(reply);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteReply(req, res) {
    try {
        await ReplyService.deleteReply(req.user.id, req.params.id);
        res.status(200).json({ message: 'Balasan berhasil dihapus.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { createReplyForPost, createReplyForReply, updateReply, deleteReply };