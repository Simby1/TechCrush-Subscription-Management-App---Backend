import express from 'express';
import {
  createPlan,
  getPlans,
  findPlan,
  updatePlan,
  deletePlan
} from '../controllers/planController.js'; 

const planRoutes = express.Router(); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Plan:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the subscription plan.
 *         description:
 *           type: string
 *           description: Description of the plan.
 *         price:
 *           type: number
 *           description: Price of the plan.
 *         interval:
 *           type: string
 *           enum: ["monthly", "yearly"]
 *           description: Billing interval for the plan.
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of features included in the plan.
 *         trialDays:
 *           type: number
 *           description: Number of trial days for the plan.
 */

// Create a new plan
/**
 * @swagger
 * /api/v1/plans/createPlan:
 *   post:
 *     summary: Create a new plan
 *     tags: [Plans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       201:
 *         description: Plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 plan:
 *                   $ref: '#/components/schemas/Plan'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

planRoutes.route("/createPlan").post( async (req, res) => {
  const planData = req.body;
  try {
    const newPlan = await createPlan(planData); 
    res.status(201).json(newPlan); 
  } catch (error) {
    res.status(400).json({ error: error.message }); 
  }
});

// Get all plans
/**
 * @swagger
 * /api/v1/plans/retrievePlans:
 *   get:
 *     summary: Retrieve all plans
 *     tags: [Plans]
 *     responses:
 *       200:
 *         description: A list of plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

planRoutes.route("/retrievePlans").get( async (req, res) => {
  try {
    const plans = await getPlans(); 
    res.status(200).json(plans); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

// Find a plan by ID
/**
 * @swagger
 * /api/v1/plans/findPlan/{id}:
 *   get:
 *     summary: Find a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plan to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

planRoutes.route("/findPlan/:id").get( async (req, res) => {
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
/**
 * @swagger
 * /api/v1/plans/updatePlan/{id}:
 *   put:
 *     summary: Update a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plan to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: Plan updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

planRoutes.route("/updatePlan/:id").put( async (req, res) => {
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
/**
 * @swagger
 * /api/v1/plans/deletePlan/{id}:
 *   delete:
 *     summary: Delete a plan by ID
 *     tags: [Plans]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the plan to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Plan not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

planRoutes.route("/deletePlan/:id").delete( async (req, res) => {
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