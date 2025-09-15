const express = require('express');
const router = express.Router();
const KeluargaController = require('../controllers/keluarga.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/detail', authMiddleware.authenticateToken, KeluargaController.getDetailKeluarga);

module.exports = router;