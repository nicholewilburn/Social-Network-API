const router = require('express').Router();
const { Thought, User } = require('../../models');

// Route to get all thoughts
router.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get a single thought by _id
router.get('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate('reactions');
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to create a new thought
// example data
// {
//     "thoughtText": "Here's a cool thought...",
//     "username": "lernantino",
//     "userId": "5edff358a0fcb779aa7b118b"
//   }
router.post('/thoughts', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);

    // Push the created thought's _id to the associated user's 'thoughts' array field
    const user = await User.findById(thought.userId);
    user.thoughts.push(thought._id);
    await user.save();

    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to update a thought by _id
router.put('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to remove a thought by _id
router.delete('/thoughts/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    // Remove the thought's _id from the associated user's 'thoughts' array field
    const user = await User.findById(thought.userId);
    user.thoughts.pull(thought._id);
    await user.save();

    res.json({ message: 'Thought deleted' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to create a reaction stored in a single thought's 'reactions' array field
router.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    thought.reactions.push(req.body);
    await thought.save();

    res.status(201).json({ message: 'Reaction created' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route to pull and remove a reaction by the reaction's 'reactionId' value
router.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    const reaction = thought.reactions.id(req.params.reactionId);
    if (!reaction) {
      res.status(404).json({ message: 'Reaction not found' });
      return;
    }

    reaction.remove();
    await thought.save();

    res.json({ message: 'Reaction removed' });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;