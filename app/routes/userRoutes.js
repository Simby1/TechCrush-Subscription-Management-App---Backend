import express from 'express';
import {
  createUser ,
  getUsers,
  findUser ,
  updateUser ,
  deleteUser 
} from '../controllers/userController.js'; 

const userRoutes = express.Router(); 

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user. (**Please note that storing passwords in plain text is not recommended.**)
 *               firstName:
 *                 type: string
 *                 description: The first name of the user.
 *               lastName:
 *                 type: string
 *                 description: The last name of the  user.
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful user creation.
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: An error message describing the problem with the request.
 */

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