import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

let openai = null;
if (apiKey) {
  openai = new OpenAI({ apiKey });
} else {
  console.warn("WARNING: OPENAI_API_KEY is not defined. Falling back to Mock AI Insights Engine.");
}

/**
 * Generate Smart Fallback Mock Insights based on customer metrics
 * Returns camelCase properties matching the detailed CSM specifications.
 */
export const generateMockInsights = (data) => {
  const health = data.usage?.healthScore ?? 75;
  const crmInfo = data.crm || {};
  const companyName = crmInfo.company || 'Customer';
  const owner = crmInfo.accountOwner || 'CSM';
  const plan = crmInfo.subscriptionPlan || 'Growth';

  const hasCriticalTicket = data.support?.some(t => t.priority === 'Critical' && t.status !== 'Resolved');
  const hasHighTicket = data.support?.some(t => t.priority === 'High' && t.status !== 'Resolved');
  const hasNegativeSentiment = data.emails?.some(e => e.sentiment === 'Negative');

  let executiveSummary = '';
  let risks = [];
  let opportunities = [];
  let nextBestAction = {};

  if (health < 50 || hasCriticalTicket || (hasHighTicket && hasNegativeSentiment)) {
    // Critical High Risk
    executiveSummary = `${companyName} exhibits critical risk factors. The product usage health score is at ${health}/100, which reflects low seat adoption. Combined with outstanding support queries, there is an immediate churn risk. Communication sentiment is negative, reflecting frustration. Renewal readiness is poor, but resolving core engineering bottlenecks could unlock moderate expansion potential.`;
    
    risks = [
      { severity: "High", explanation: "Active critical support tickets are blocking user dashboards." },
      { severity: "High", explanation: `Low customer health score of ${health}/100 indicates dwindling product adoption.` },
      { severity: "Medium", explanation: "Client is questioning the value of their subscription tier in recent email updates." }
    ];

    opportunities = [
      { title: "Custom Training & Re-onboarding", expectedImpact: "Boost seat adoption by 30% and clear workflow blockages." },
      { title: "EBR Alignment", expectedImpact: "Secure account stakeholders and align on a renewal remediation path." }
    ];

    nextBestAction = {
      primaryAction: `Coordinate a priority triage sync with ${owner} and the engineering team to resolve open support issues.`,
      expectedOutcome: "Unblock core technical workflows and restore customer trust.",
      suggestedTimeline: "Within 24 hours"
    };
  } else if (health >= 85) {
    // High Engagement / Expansion Opportunity
    executiveSummary = `${companyName} shows outstanding account engagement. The product usage health index is at ${health}/100, reflecting full seat utilization and high feature adoption. There are no outstanding critical support issues, and communication sentiment is very positive. The account is highly renewal-ready, presenting strong opportunities for custom subscription expansions.`;

    risks = [
      { severity: "Medium", explanation: "Dependency on a single technical champion inside the client team." },
      { severity: "Low", explanation: "Approaching API request limit caps due to high integration syncing." }
    ];

    opportunities = [
      { title: "Enterprise Tier Upgrade", expectedImpact: "Increase ARR by 25% and unlock custom compliance features." },
      { title: "Case Study Co-Marketing", expectedImpact: "Build cross-brand marketing assets and capture success logs." }
    ];

    nextBestAction = {
      primaryAction: `Contact primary advocate at ${companyName} to schedule an expansion discussion and introduce Enterprise tier features.`,
      expectedOutcome: "Draft expansion proposal and secure co-marketing consent.",
      suggestedTimeline: "This week"
    };
  } else {
    // Stable Health
    executiveSummary = `${companyName} remains in a stable and healthy condition. Feature adoption metrics are holding steady at ${health}/100 with consistent usage log levels. Support issues are resolved within standard SLA timelines, and email threads indicate a neutral/healthy relationship. The account is on track for standard renewal with moderate expansion potential.`;

    risks = [
      { severity: "Low", explanation: "Limited adoption of secondary integration modules." },
      { severity: "Low", explanation: "Slight delays in scheduling quarterly divisional updates." }
    ];

    opportunities = [
      { title: "Feature Adoption Webinar", expectedImpact: "Drive usage of advanced analytics templates by 15%." },
      { title: "Quarterly CSM Review", expectedImpact: "Reinforce value realization and discuss renewal roadmap." }
    ];

    nextBestAction = {
      primaryAction: `Send a bi-weekly check-in email offering a template configuration session.`,
      expectedOutcome: "Schedule quarterly review call and identify growth areas.",
      suggestedTimeline: "Next 3 business days"
    };
  }

  return { executiveSummary, risks, opportunities, nextBestAction };
};

/**
 * Generate AI Insights from OpenAI or fall back to mock data
 * @param {object} customerData unified customer object
 * @returns {Promise<object>} refined properties
 */
export const generateInsights = async (customerData) => {
  if (!openai) {
    // Simulate delay for realistic frontend loading states
    await new Promise(resolve => setTimeout(resolve, 1500));
    return generateMockInsights(customerData);
  }

  try {
    const crm = customerData.crm || {};
    const support = customerData.support || [];
    const emails = customerData.emails || [];
    const slack = customerData.slack || {};
    const usage = customerData.usage || {};

    const ticketString = support.length > 0
      ? support.map(t => `- [${t.priority} Priority] ${t.issue} (Status: ${t.status})`).join('\n')
      : 'No active tickets.';

    const emailString = emails.length > 0
      ? emails.map(e => `- Subject: "${e.subject}" | Summary: ${e.summary} (Sentiment: ${e.sentiment})`).join('\n')
      : 'No email logs.';

    const slackString = `Internal Notes: ${slack.internalNotes}\nSales Updates: ${slack.salesUpdates}\nCustomer Feedback: ${slack.customerFeedback}`;
    const featureUsageString = Object.entries(usage.featureUsage || {})
      .map(([key, val]) => `${key}: ${val}%`).join(', ') || 'N/A';

    const prompt = `You are a Customer Success Manager analyzing account health.
Unified Customer Data:
- Name: ${crm.customerName}
- Company: ${crm.company}
- Industry: ${crm.industry}
- Subscription Plan: ${crm.subscriptionPlan} (MRR: $${crm.mrr})
- Account Owner: ${crm.accountOwner}

Product Telemetry:
- Active Users: ${usage.activeUsers}
- Last Login: ${usage.lastLogin || 'Never'}
- Health Score: ${usage.healthScore || 'N/A'}
- Feature Usage: ${featureUsageString}

Support tickets:
${ticketString}

Emails log:
${emailString}

Slack comments:
${slackString}

Assess this customer relationship.
Return a valid JSON object ONLY. Do NOT put the response in a markdown code block. Match this schema exactly:
{
  "executiveSummary": "A business-oriented executive summary detailing overall customer health, product adoption, support history, communication sentiment, renewal readiness, and expansion potential.",
  "risks": [
    {
      "severity": "High" | "Medium" | "Low",
      "explanation": "Short explanation of the risk."
    }
  ],
  "opportunities": [
    {
      "title": "Opportunity title.",
      "expectedImpact": "Expected business impact."
    }
  ],
  "nextBestAction": {
    "primaryAction": "Primary action statement.",
    "expectedOutcome": "Expected outcome.",
    "suggestedTimeline": "Suggested timeline."
  }
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an elite Customer Success AI. You return valid JSON objects matching the user requested schema exactly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI API call failed, generating mock fallback insights:", error);
    return generateMockInsights(customerData);
  }
};
