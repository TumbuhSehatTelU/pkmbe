const PostService = require('../service/post.service');

async function createPost(req, res) {
    try {
        const post = await PostService.createPost(req.user.id, req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function getAllPosts(req, res) {
    try {
        const posts = await PostService.findAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPostById(req, res) {
    try {
        const post = await PostService.findPostById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post tidak ditemukan.' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updatePost(req, res) {
    try {
        const post = await PostService.updatePost(req.user.id, req.params.id, req.body);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deletePost(req, res) {
    try {
        await PostService.deletePost(req.user.id, req.params.id);
        res.status(200).json({ message: 'Post berhasil dihapus.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function votePost(req, res) {
    try {
        const { vote_type } = req.body; // 'like' or 'dislike'
        const result = await PostService.votePost(req.user.id, req.params.id, vote_type);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, votePost };