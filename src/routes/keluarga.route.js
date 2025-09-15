const express = require('express');
const router = express.Router();
const KeluargaController = require('../controllers/keluarga.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Lindungi rute ini, hanya user yang login yang bisa mengakses
router.get('/detail', authMiddleware.authenticateToken, KeluargaController.getDetailKeluarga);

module.exports = router;