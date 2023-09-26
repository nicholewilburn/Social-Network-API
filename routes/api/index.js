const router = require('express').Router();
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// Prefix user routes with '/users'
router.use('/users', userRoutes);

// Prefix thought routes with '/thoughts'
router.use('/thoughts', thoughtRoutes);

module.exports = router;