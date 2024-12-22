import express from 'express';
import {
  createPlan,
  getPlans,
  findPlan,
  updatePlan,
  deletePlan
} from '../controllers/planController.js'; 

const planRoutes = express.Router(); 

// Create a new plan
planRoutes.post('/', async (req, res) => {
  const planData = req.body;
  try {
    const newPlan = await createPlan(planData); 
    res.status(201).json(newPlan); 
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

// Get all plans
planRoutes.get('/', async (req, res) => {
  try {
    const plans = await getPlans(); 
    res.status(200).json(plans); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

// Find a plan by ID
planRoutes.get('/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const foundPlan = await findPlan(id); 
    if (foundPlan) {
      res.status(200).json(foundPlan); 
    } else {
      res.status(404).json({ error: "Plan not found" }); 
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

// Update a plan by ID
planRoutes.put('/:id', async (req, res) => {
  const { id } = req.params; 
  const updates = req.body; 
  try {
    const result = await updatePlan(id, updates); 
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Plan updated successfully' }); 
    } else {
      res.status(404).json({ error: "Plan not found" }); 
    }
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

// Delete a plan by ID
planRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await deletePlan(id); 
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Plan deleted successfully' }); 
    } else {
      res.status(404).json({ error: "Plan not found" }); 
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

export default planRoutes; 