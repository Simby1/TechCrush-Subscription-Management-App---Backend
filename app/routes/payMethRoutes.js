import express from 'express';
import {
  createPaymentMethod,
  getPaymentMethods,
  findPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} from '../controllers/payMethController.js';

const paymentMethodRoutes = express.Router(); 

// Create a new payment method
paymentMethodRoutes.post('/', async (req, res) => {
  const paymentData = req.body; 
  try {
    const newPaymentMethod = await createPaymentMethod(paymentData); 
    res.status(201).json(newPaymentMethod); 
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

// Get all payment methods
paymentMethodRoutes.get('/', async (req, res) => {
  try {
    const paymentMethods = await getPaymentMethods(); 
    res.status(200).json(paymentMethods); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

// Find a payment method by ID
paymentMethodRoutes.get('/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const foundPaymentMethod = await findPaymentMethod(id); 
    if (foundPaymentMethod) {
      res.status(200).json(foundPaymentMethod); 
    } else {
      res.status(404).json({ error: "Payment method not found" }); 
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

// Update a payment method by ID
paymentMethodRoutes.put('/:id', async (req, res) => {
  const { id } = req.params; 
  const updates = req.body; 
  try {
    const result = await updatePaymentMethod(id, updates); 
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Payment method updated successfully' }); 
    } else {
      res.status(404).json({ error: "Payment method not found" }); 
    }
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

// Delete a payment method by ID
paymentMethodRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const result = await deletePaymentMethod(id); 
    if (result.deletedCount > 0) {
      res.status(200).json({ message: 'Payment method deleted successfully' }); 
    } else {
      res.status(404).json({ error: "Payment method not found" }); 
    }
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

export default paymentMethodRoutes; 