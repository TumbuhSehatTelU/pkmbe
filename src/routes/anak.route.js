const express = require('express');
const router = express.Router();
const AnakController = require('../controllers/anak.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Middleware ini akan melindungi SEMUA rute di bawahnya
router.use(authMiddleware.authenticateToken);

router.post('/', AnakController.createAnak);        
router.get('/', AnakController.getAllAnak);         
router.put('/:id', AnakController.updateAnak);      
router.delete('/:id', AnakController.deleteAnak);   

module.exports = router;