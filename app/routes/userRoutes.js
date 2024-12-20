import express from 'express';
import {
  createUser ,
  getUsers,
  findUser ,
  updateUser ,
  deleteUser 
} from '../controllers/userController.js'; 

const userRoutes = express.Router(); 

// Create a new user
userRoutes.post('/', async (req, res) => {
  const userData = req.body;
  try {
    await createUser (userData);
    res.status(201).json({message: "User created"});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
userRoutes.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Find a user 
userRoutes.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const foundUser = await findUser (username);
    if (foundUser) {
        res.status(200).json(foundUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// Update a user
userRoutes.put('/:username', async (req, res) => {
  const { username } = req.params;
  const updates = req.body;
  try {
    await updateUser (username, updates);
    res.status(200).json({ message: 'User  updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user
userRoutes.delete('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    await deleteUser (username);
    res.status(200).json({ message: 'User  deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default userRoutes; 