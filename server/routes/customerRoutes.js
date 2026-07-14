import { Router } from 'express';
import { getCustomersList, getCustomerById, analyzeCustomer } from '../controllers/customerController.js';

const router = Router();

// Route to fetch sidebar list of customers
router.get('/customers', getCustomersList);

// Route to fetch merged single customer profile details
router.get('/customer/:id', getCustomerById);

// Route to run account assessments and generate AI insights
router.post('/customer/:id/analyze', analyzeCustomer);

export default router;
