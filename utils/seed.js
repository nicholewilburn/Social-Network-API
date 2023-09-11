const mongoose = require('mongoose');
const faker = require('faker');
const { User, Thought } = require('../models');

// Set up Mongoose connection
mongoose.connect('mongodb://localhost/socialDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to seed users
const seedUsers = async (userCount) => {
  try {
    await User.deleteMany(); // Clear existing users

    for (let i = 0; i < userCount; i++) {
      const username = faker.internet.userName();
      const email = faker.internet.email();

      await User.create({ username, email });
    }

    console.log(`Seeded ${userCount} users`);
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

// Function to seed thoughts
const seedThoughts = async (thoughtCount) => {
  try {
    await Thought.deleteMany(); // Clear existing thoughts

    const users = await User.find(); // Get all users

    for (let i = 0; i < thoughtCount; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const thoughtText = faker.lorem.sentence();

      await Thought.create({
        thoughtText,
        username: randomUser.username,
        userId: randomUser._id,
      });
    }

    console.log(`Seeded ${thoughtCount} thoughts`);
  } catch (err) {
    console.error('Error seeding thoughts:', err);
  }
};

// Seed data
const seedData = async () => {
  try {
    await seedUsers(10); // Seed 10 users
    await seedThoughts(20); // Seed 20 thoughts

    // Disconnect from the database when done
    mongoose.disconnect();

    console.log('Database seeding complete.');
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

seedData(); // Start the seeding process