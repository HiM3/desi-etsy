const express = require('express');
const { getAllApprovedArtisans, getArtisanById } = require('../controllers/artisanController');
const router = express.Router();

// Public: get all approved artisans with their products
router.get('/showcase', getAllApprovedArtisans);

// Optional: artisan profile detail
router.get('/:id', getArtisanById);

module.exports = router;
