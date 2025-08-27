const { Post, User, Reply, PostVote, sequelize } = require('../models');

async function createPost(userId, postData) {
    const { judul, isi } = postData;
    if (!judul || !isi) throw new Error('Judul dan isi tidak boleh kosong.');
    return await Post.create({ judul, isi, userId });
}

async function findAllPosts() {
    return await Post.findAll({
        include: [{ model: User, attributes: ['id', 'nama'] }],
        attributes: {
            include: [
                [sequelize.literal('(SELECT COUNT(*) FROM post_votes WHERE post_votes.postId = Post.id AND post_votes.vote_type = "like")'), 'likes'],
                [sequelize.literal('(SELECT COUNT(*) FROM post_votes WHERE post_votes.postId = Post.id AND post_votes.vote_type = "dislike")'), 'dislikes']
            ]
        },
        order: [['created_at', 'DESC']]
    });
}

async function getRepliesRecursive(replyIds) {
    if (replyIds.length === 0) return [];
    const replies = await Reply.findAll({
        where: { id: replyIds },
        include: [
            { model: User, attributes: ['id', 'nama'] },
            { model: Reply, as: 'children', attributes: ['id'] } 
        ]
    });
    
    for (const reply of replies) {
        const childrenIds = reply.children.map(child => child.id);
        reply.dataValues.children = await getRepliesRecursive(childrenIds);
    }
    return replies;
}

async function findPostById(postId) {
    const post = await Post.findByPk(postId, {
        include: [{ model: User, attributes: ['id', 'nama'] }]
    });
    if (!post) return null;

    const topLevelReplies = await Reply.findAll({
        where: { postId, parentId: null },
        include: [
            { model: User, attributes: ['id', 'nama'] },
            { model: Reply, as: 'children', attributes: ['id'] }
        ]
    });

    for (const reply of topLevelReplies) {
        const childrenIds = reply.children.map(child => child.id);
        reply.dataValues.children = await getRepliesRecursive(childrenIds);
    }
    
    post.dataValues.replies = topLevelReplies;
    return post;
}

async function updatePost(userId, postId, postData) {
    const post = await Post.findOne({ where: { id: postId, userId } });
    if (!post) throw new Error('Post tidak ditemukan atau Anda tidak memiliki akses.');
    await post.update(postData);
    return post;
}

async function deletePost(userId, postId) {
    const post = await Post.findOne({ where: { id: postId, userId } });
    if (!post) throw new Error('Post tidak ditemukan atau Anda tidak memiliki akses.');
    await post.destroy();
}

async function votePost(userId, postId, voteType) {
    if (!['like', 'dislike'].includes(voteType)) throw new Error('Vote type tidak valid.');

    const existingVote = await PostVote.findOne({ where: { userId, postId } });

    if (existingVote) {
        if (existingVote.vote_type === voteType) {
            await existingVote.destroy();
            return { message: 'Vote dibatalkan.' };
        } else {
            existingVote.vote_type = voteType;
            await existingVote.save();
            return { message: 'Vote diubah.', data: existingVote };
        }
    } else {
        const newVote = await PostVote.create({ userId, postId, vote_type: voteType });
        return { message: 'Vote berhasil ditambahkan.', data: newVote };
    }
}

module.exports = { createPost, findAllPosts, findPostById, updatePost, deletePost, votePost };