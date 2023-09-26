const router = require('express').Router();
const userRoutes = require('./api/userRoutes');
const thoughtRoutes = require('./api/thoughtRoutes');

// Prefix all API routes with '/api'
router.use('/api', userRoutes);
router.use('/api', thoughtRoutes);

module.exports = router;