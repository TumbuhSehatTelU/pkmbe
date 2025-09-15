const express = require('express');
const router = express.Router();
const MakananController = require('../controllers/makanan.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Lindungi semua rute, hanya user terautentikasi yang bisa mengelola data makanan
router.use(authMiddleware.authenticateToken);

router.post('/', MakananController.createMakanan);
router.get('/', MakananController.getAllMakanan);
router.get('/:id', MakananController.getMakananById);
router.put('/:id', MakananController.updateMakanan);
router.delete('/:id', MakananController.deleteMakanan);

module.exports = router;