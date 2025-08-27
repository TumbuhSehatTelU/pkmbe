const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Lindungi semua rute
router.use(authMiddleware.authenticateToken);

router.post('/', PostController.createPost);
router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.put('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);
router.post('/:id/vote', PostController.votePost); 

module.exports = router;