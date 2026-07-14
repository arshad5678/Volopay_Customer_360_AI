import { loadJSON, mergeCustomerData } from '../utils/jsonHelper.js';
import { generateInsights } from '../services/aiService.js';

/**
 * Controller to fetch all customers for the sidebar ledger list
 * GET /api/customers
 */
export const getCustomersList = async (req, res) => {
  try {
    const [crmData, usageData] = await Promise.all([
      loadJSON('crm.json'),
      loadJSON('usage.json')
    ]);

    const customers = crmData.map(c => {
      const usage = usageData.find(u => u.customerId === c.customerId) || {};
      return {
        customerId: c.customerId,
        customerName: c.customerName,
        company: c.company,
        industry: c.industry,
        healthScore: usage.healthScore ?? null,
        plan: c.subscriptionPlan,
        status: c.status,
        mrr: c.mrr
      };
    });

    return res.status(200).json(customers);
  } catch (error) {
    console.error("Error in getCustomersList controller:", error);
    return res.status(500).json({ error: "Internal server error while fetching customer directory ledger." });
  }
};

/**
 * Controller to fetch single customer details merged across files
 * GET /api/customer/:id
 */
export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Customer ID parameter is required." });
  }

  try {
    const mergedData = await mergeCustomerData(id);
    if (!mergedData) {
      return res.status(404).json({ error: `Customer with ID ${id} not found.` });
    }

    return res.status(200).json(mergedData);
  } catch (error) {
    console.error(`Error in getCustomerById controller for ID ${id}:`, error);
    return res.status(500).json({ error: "Internal server error while aggregating customer profile metrics." });
  }
};

/**
 * Controller to generate AI CS Assessment & Insights
 * POST /api/customer/:id/analyze
 */
export const analyzeCustomer = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Customer ID parameter is required for evaluation." });
  }

  try {
    const mergedData = await mergeCustomerData(id);
    if (!mergedData) {
      return res.status(404).json({ error: `Customer with ID ${id} not found.` });
    }

    const insights = await generateInsights(mergedData);
    return res.status(200).json(insights);
  } catch (error) {
    console.error(`Error in analyzeCustomer controller for ID ${id}:`, error);
    return res.status(500).json({ error: "Internal server error while evaluating customer account telemetry." });
  }
};
