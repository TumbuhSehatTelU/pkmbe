const { Reply, Post } = require('../models');

async function createReply(userId, replyData) {
    const { postId, isi } = replyData;
    if (!isi) throw new Error('Isi balasan tidak boleh kosong.');
    
    const post = await Post.findByPk(postId);
    if (!post) throw new Error('Post tidak ditemukan.');

    return await Reply.create({ isi, userId, postId });
}


async function createNestedReply(userId, parentId, replyData) {
    const { isi } = replyData;
    if (!isi) throw new Error('Isi balasan tidak boleh kosong.');
    
    const parentReply = await Reply.findByPk(parentId);
    if (!parentReply) throw new Error('Balasan induk tidak ditemukan.');

    return await Reply.create({
        isi,
        userId,
        postId: parentReply.postId, 
        parentId: parentReply.id
    });
}

async function updateReply(userId, replyId, replyData) {
    const reply = await Reply.findOne({ where: { id: replyId, userId } });
    if (!reply) throw new Error('Balasan tidak ditemukan atau Anda tidak memiliki akses.');
    
    await reply.update(replyData);
    return reply;
}

async function deleteReply(userId, replyId) {
    const reply = await Reply.findOne({ where: { id: replyId, userId } });
    if (!reply) throw new Error('Balasan tidak ditemukan atau Anda tidak memiliki akses.');

    await reply.destroy();
}

module.exports = {
    createReply,
    createNestedReply,
    updateReply,
    deleteReply
};