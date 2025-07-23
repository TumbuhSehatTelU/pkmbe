const express = require('express');
const router = express.Router();
const RekomendasiController = require('../controllers/rekomendasi.controller');

router.post('/rekomendasi', RekomendasiController.getRekomendasi);

module.exports = router;