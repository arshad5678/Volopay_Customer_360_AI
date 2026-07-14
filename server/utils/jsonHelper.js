import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data directory is located at server/data
const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Reusable helper to load and parse JSON files from the data directory
 * @param {string} filename Name of the file, e.g. 'crm.json'
 * @returns {Promise<any>} Parsed JSON content or empty array/object on failure
 */
export const loadJSON = async (filename) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading JSON file ${filename}:`, error.message);
    // Return empty array by default unless it's a specific object file
    if (filename.includes('slack') || filename.includes('usage')) {
      return [];
    }
    return [];
  }
};

/**
 * Helper to calculate health status classification based on health score
 * @param {number|null} healthScore
 * @returns {string} Status classification ("Good", "Average", "Critical")
 */
export const calculateHealthStatus = (healthScore) => {
  if (healthScore === null || healthScore === undefined) return 'Average';
  if (healthScore >= 80) return 'Good';
  if (healthScore >= 50) return 'Average';
  return 'Critical';
};

/**
 * Merges customer datasets using customerId
 * @param {string} customerId
 * @returns {Promise<object|null>} unified customer object or null if customer doesn't exist
 */
export const mergeCustomerData = async (customerId) => {
  try {
    const [crm, support, emails, slack, usage] = await Promise.all([
      loadJSON('crm.json'),
      loadJSON('support.json'),
      loadJSON('emails.json'),
      loadJSON('slack.json'),
      loadJSON('usage.json')
    ]);

    // Find core CRM details
    const customerCrm = crm.find(c => c.customerId === customerId);
    if (!customerCrm) return null;

    // Filter list items
    const customerSupport = support.filter(s => s.customerId === customerId);
    const customerEmails = emails.filter(e => e.customerId === customerId);

    // Find unique single object datasets
    const customerSlack = slack.find(s => s.customerId === customerId) || {
      customerId,
      internalNotes: "No internal notes recorded.",
      salesUpdates: "No sales updates recorded.",
      customerFeedback: "No customer feedback recorded."
    };

    const customerUsage = usage.find(u => u.customerId === customerId) || {
      customerId,
      activeUsers: 0,
      lastLogin: null,
      healthScore: null,
      featureUsage: {}
    };

    return {
      crm: customerCrm,
      support: customerSupport,
      emails: customerEmails,
      slack: customerSlack,
      usage: customerUsage
    };
  } catch (error) {
    console.error(`Error merging customer data for ID ${customerId}:`, error);
    throw error;
  }
};
