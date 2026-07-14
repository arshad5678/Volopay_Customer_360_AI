import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Building2, 
  BrainCircuit, 
  Sparkles, 
  ChevronRight,
  Database,
  RefreshCw,
  Users,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import CRMDetails from './components/CRMDetails';
import SupportTickets from './components/SupportTickets';
import EmailHistory from './components/EmailHistory';
import SlackNotes from './components/SlackNotes';
import ProductUsage from './components/ProductUsage';
import AiInsights from './components/AiInsights';
import { getCustomers, getCustomerById, analyzeCustomer, API_BASE_URL } from './services/api';

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cache for generated AI insights so they are preserved while switching customers
  const [aiInsightsCache, setAiInsightsCache] = useState({});
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const [isListLoading, setIsListLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // Error handling states
  const [listError, setListError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Sync dark mode class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Load initial customer list
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Load details whenever selected customer changes
  useEffect(() => {
    if (selectedCustomerId) {
      fetchCustomerDetails(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const fetchCustomers = async () => {
    setIsListLoading(true);
    setListError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
      if (data.length > 0 && !selectedCustomerId) {
        setSelectedCustomerId(data[0].customerId);
      }
    } catch (error) {
      console.error('Failed to load customers list:', error);
      setListError(`Failed to fetch from API: ${API_BASE_URL}. If the backend is starting up, it may take 30-50s to wake up. Please retry.`);
    } finally {
      setIsListLoading(false);
    }
  };

  const fetchCustomerDetails = async (id) => {
    setIsDetailsLoading(true);
    setDetailsError(null);
    try {
      const data = await getCustomerById(id);
      setCustomerDetails(data);
    } catch (error) {
      console.error(`Failed to load details for customer ${id}:`, error);
      setDetailsError("Unable to load latest customer profile details. Previous data remains visible.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

const generateClientFallbackInsights = (data) => {
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

  const handleGenerateAiSummary = async () => {
    if (!customerDetails || !customerDetails.crm) return;
    const id = customerDetails.crm.customerId;
    setIsAiLoading(true);
    setAiError(null);
    const startTime = Date.now();
    try {
      const data = await analyzeCustomer(id);
      
      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsed));
      }
      
      setAiInsightsCache(prev => ({
        ...prev,
        [id]: {
          ...data,
          isFallback: false
        }
      }));
    } catch (error) {
      console.error('Failed to generate AI insights, applying intelligent fallback:', error);
      
      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsed));
      }
      
      const fallbackData = generateClientFallbackInsights(customerDetails);
      setAiInsightsCache(prev => ({
        ...prev,
        [id]: {
          ...fallbackData,
          isFallback: true
        }
      }));
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filters customers based on search text
  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.customerName?.toLowerCase().includes(query) ||
      customer.company?.toLowerCase().includes(query) ||
      customer.industry?.toLowerCase().includes(query) ||
      customer.accountOwner?.toLowerCase().includes(query)
    );
  });

  const getHealthPillColor = (score) => {
    if (score === null || score === undefined) return 'bg-zinc-100 text-zinc-600 dark:bg-darkBg-750 dark:text-zinc-400';
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
    if (score >= 50) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-darkBg-950 font-sans text-zinc-950 dark:text-zinc-100 flex flex-col transition-colors duration-200">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-darkBg-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-darkBg-750 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20 flex items-center justify-center">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h1 className="text-[36px] font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
              Volopay Customer 360 AI
              <span className="text-sm font-bold uppercase tracking-wider bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300 px-3 py-1 rounded-md border border-brand-300 dark:border-brand-800">
                Growth Squad
              </span>
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-1">Enterprise Client Intelligence Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Refresh Button */}
          <button
            onClick={fetchCustomers}
            title="Reload Client Data"
            className="p-2 rounded-lg border border-zinc-200 dark:border-darkBg-750 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-darkBg-750 transition-colors cursor-pointer"
          >
            <RefreshCw size={16} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-lg border border-zinc-200 dark:border-darkBg-750 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-darkBg-750 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun size={16} className="text-amber-450" /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] w-full mx-auto">
        
        {/* Left Sidebar (Customer Nav) */}
        <aside className="w-full lg:w-96 border-r border-zinc-200 dark:border-darkBg-750 bg-white dark:bg-darkBg-800 flex flex-col flex-shrink-0 lg:max-h-[calc(100vh-73px)]">
          {/* Search Section */}
          <div className="p-5 border-b border-zinc-200 dark:border-darkBg-750 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-zinc-400 dark:text-zinc-500" size={16} />
              <input
                type="text"
                placeholder="Search name, company, industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-zinc-200 dark:border-darkBg-750 bg-zinc-50 dark:bg-darkBg-900 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 dark:text-zinc-150"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <span>Customer Ledger</span>
              <span>{filteredCustomers.length} of {customers.length}</span>
            </div>
          </div>

          {/* List Loader / Client List */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-darkBg-750">
            {listError ? (
              <div className="p-6 text-center text-rose-500">
                <AlertTriangle size={24} className="mx-auto mb-2 text-rose-400" />
                <p className="text-sm font-semibold">{listError}</p>
                <button 
                  onClick={fetchCustomers}
                  className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white rounded-lg flex items-center gap-1.5 mx-auto cursor-pointer shadow-sm active:scale-95 transition-all"
                >
                  <RefreshCw size={12} />
                  Retry Load
                </button>
              </div>
            ) : isListLoading ? (
              // Sidebar Skeleton list
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-zinc-200 dark:bg-darkBg-750 rounded w-[60%]" />
                    <div className="h-3 bg-zinc-200 dark:bg-darkBg-750 rounded w-10" />
                  </div>
                  <div className="h-3 bg-zinc-200 dark:bg-darkBg-750 rounded w-[45%]" />
                </div>
              ))
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 dark:text-zinc-500">
                <p className="text-xs font-semibold">No customers found</p>
                <p className="text-[11px] mt-1 text-zinc-500">Try adjusting your filters</p>
              </div>
            ) : (
              filteredCustomers.map((customer) => {
                const isActive = customer.customerId === selectedCustomerId;
                return (
                  <button
                    key={customer.customerId}
                    onClick={() => setSelectedCustomerId(customer.customerId)}
                    className={`w-full text-left p-5 transition-colors duration-150 flex items-start justify-between gap-3 border-l-4 cursor-pointer ${
                      isActive
                        ? 'border-brand-500 bg-zinc-50 dark:bg-darkBg-850 text-zinc-950 dark:text-white'
                        : 'border-transparent hover:bg-zinc-50 dark:hover:bg-darkBg-800/40 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="min-w-0">
                      <h4 className={`text-base font-bold truncate leading-tight ${isActive ? 'text-brand-600 dark:text-brand-300 font-extrabold' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {customer.customerName}
                      </h4>
                      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1 truncate">
                        {customer.company} • {customer.industry}
                      </p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          customer.status?.toLowerCase() === 'active' 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                            : 'bg-zinc-100 text-zinc-600 dark:bg-darkBg-750 dark:text-zinc-400'
                        }`}>
                          {customer.status}
                        </span>
                        <span className="text-sm text-zinc-400 dark:text-zinc-500">
                          {customer.mrr !== undefined && customer.mrr !== null ? `$${customer.mrr.toLocaleString()}/mo` : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Health score badge */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getHealthPillColor(customer.healthScore)}`}>
                        {customer.healthScore ?? 'N/A'}
                      </span>
                      <ChevronRight size={14} className={`text-zinc-450 transition-transform ${isActive ? 'translate-x-0.5 text-brand-500' : ''}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Content Area (Selected Customer Dashboard) */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto lg:max-h-[calc(100vh-73px)]">
          {/* Top KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-darkBg-800 rounded-xl border border-zinc-200 dark:border-darkBg-750 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                <Users size={22} />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
                  {customers.length || 0}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-bold uppercase tracking-wider">Total Customers</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-550 mt-0.5">Registered accounts</p>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-darkBg-800 rounded-xl border border-zinc-200 dark:border-darkBg-750 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <ShieldCheck size={22} />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
                  {customers.filter(c => (c.healthScore ?? 0) >= 80).length || 0}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-bold uppercase tracking-wider">Healthy Accounts</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-550 mt-0.5">Health score ≥ 80</p>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-darkBg-800 rounded-xl border border-zinc-200 dark:border-darkBg-750 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-455">
                <AlertTriangle size={22} />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
                  {customers.filter(c => c.healthScore !== null && c.healthScore !== undefined && c.healthScore < 50).length || 0}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-bold uppercase tracking-wider">At Risk Accounts</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-550 mt-0.5">Health score &lt; 50</p>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-darkBg-800 rounded-xl border border-zinc-200 dark:border-darkBg-750 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                <Sparkles size={22} />
              </div>
              <div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white leading-none">
                  {customers.filter(c => c.plan?.toLowerCase() !== 'enterprise' && (c.healthScore ?? 0) >= 80).length || 0}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-bold uppercase tracking-wider">Expansion Opps</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-550 mt-0.5">Non-Enterprise ≥ 80 health</p>
              </div>
            </div>
          </div>
          {detailsError && (
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900/60 p-4 rounded-xl flex items-center justify-between text-rose-800 dark:text-rose-455">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={18} />
                <span className="text-sm font-semibold">{detailsError}</span>
              </div>
              <button 
                onClick={() => fetchCustomerDetails(selectedCustomerId)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw size={12} />
                Retry Sync
              </button>
            </div>
          )}

          {isDetailsLoading ? (
            // Full Page loading state
            <div className="space-y-8">
              <div className="h-32 bg-zinc-100 dark:bg-darkBg-800/40 border border-zinc-200 dark:border-darkBg-750 rounded-xl animate-pulse" />
              <div className="h-48 bg-zinc-100 dark:bg-darkBg-800/40 border border-zinc-200 dark:border-darkBg-750 rounded-xl animate-pulse" />
              <div className="h-40 bg-zinc-100 dark:bg-darkBg-800/40 border border-zinc-200 dark:border-darkBg-750 rounded-xl animate-pulse" />
            </div>
          ) : customerDetails && customerDetails.crm ? (
            <>
              {/* AI Insights Card (Takes top priority slot) */}
              <AiInsights 
                insights={aiInsightsCache[customerDetails.crm.customerId]} 
                onGenerate={handleGenerateAiSummary} 
                isLoading={isAiLoading} 
                error={aiError}
                customerId={customerDetails.crm.customerId}
              />

              {/* CRM Card */}
              <CRMDetails customer={customerDetails.crm} />

              {/* Product usage */}
              <ProductUsage usage={customerDetails.usage} />

              {/* Grid for Support & Emails */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <SupportTickets tickets={customerDetails.support} />
                <EmailHistory emails={customerDetails.emails} />
              </div>

              {/* Slack notes */}
              <SlackNotes notes={customerDetails.slack} />
            </>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center text-zinc-400 dark:text-zinc-500">
              <Database size={48} className="mb-4 text-zinc-300 dark:text-zinc-700" />
              <h3 className="text-lg font-bold">No Customer Selected</h3>
              <p className="text-xs text-zinc-500 mt-1">Please pick a customer from the sidebar ledger to display details.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
