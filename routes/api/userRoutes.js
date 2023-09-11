const router = require('express').Router();
const { User } = require('../models');

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get a single user by _id and populate thought and friend data
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to create a new user
router.post('/users', async (req, res) => {
  // example data
//     {
//     "username": "lernantino",
//     "email": "lernantino@gmail.com"
//   }
    try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to update a user by _id
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to remove a user by _id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // BONUS: Remove user's associated thoughts
    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    res.json({ message: 'User and associated thoughts deleted' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to add a new friend to a user's friend list
router.post('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);
    if (!user || !friend) {
      res.status(404).json({ message: 'User or friend not found' });
      return;
    }
    user.friends.push(req.params.friendId);
    await user.save();
    res.json({ message: 'Friend added' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to remove a friend from a user's friend list
router.delete('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.friends.pull(req.params.friendId);
    await user.save();
    res.json({ message: 'Friend removed' });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;