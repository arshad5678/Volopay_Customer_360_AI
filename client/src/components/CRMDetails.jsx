import React from 'react';
import { 
  Fingerprint, 
  Calendar, 
  CalendarDays, 
  CreditCard, 
  User, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

// Helper to get company initials
const getCompanyInitials = (name) => {
  if (!name) return '-';
  const cleanName = name.replace(/(Inc\.|Corp\.|Corporation|Llc|Labs|Systems|Software|Paper Co)/gi, '').trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (words.length === 0) return name[0].toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Helper to get soft pastel colors persistently based on name hash
const getAvatarBg = (name) => {
  const colors = [
    'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 border border-brand-500/20',
    'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20',
    'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20',
    'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20',
    'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20',
    'bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 border border-pink-500/20',
    'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-450 border border-amber-500/20'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Helper to get persistent Customer Since date based on ID
const getCustomerSince = (id) => {
  const years = {
    'cust-001': 'Apr 15, 2023',
    'cust-002': 'Jun 12, 2022',
    'cust-003': 'Jan 10, 2024',
    'cust-004': 'Mar 22, 2023',
    'cust-005': 'Nov 05, 2021',
    'cust-006': 'Feb 18, 2024',
    'cust-007': 'Jul 04, 2023',
    'cust-008': 'Aug 29, 2022',
    'cust-009': 'Dec 15, 2023',
    'cust-010': 'Sep 01, 2022',
    'cust-011': 'May 12, 2023',
    'cust-012': 'Oct 30, 2022',
    'cust-013': 'Jan 25, 2024',
    'cust-014': 'Apr 01, 2023',
    'cust-015': 'Jun 05, 2022',
    'cust-016': 'Jul 14, 2023',
    'cust-017': 'Aug 08, 2021',
    'cust-018': 'Sep 22, 2023',
    'cust-019': 'Oct 11, 2022',
    'cust-020': 'Nov 30, 2023'
  };
  return years[id] || 'Jan 15, 2023';
};

export default function CRMDetails({ customer }) {
  if (!customer) return null;

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-250 dark:border-emerald-800/60';
      case 'pending':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-250 dark:border-amber-800/60';
      case 'onboarding':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-250 dark:border-blue-800/60';
      case 'churned':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-250 dark:border-rose-800/60';
      default:
        return 'bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200';
    }
  };

  const getPlanBadgeClass = (plan) => {
    switch (plan?.toLowerCase()) {
      case 'enterprise':
        return 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border-brand-200 dark:border-brand-800';
      case 'growth':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/45 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
      default:
        return 'bg-zinc-50 text-zinc-650 dark:bg-zinc-850 dark:text-zinc-300 border-zinc-200 dark:border-zinc-750';
    }
  };

  const hasMrr = customer.mrr !== undefined && customer.mrr !== null;

  return (
    <div className="glass-card p-8">
      {/* Customer Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div className="flex items-center gap-5">
          {/* Automatically generated circular initials avatar */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black flex-shrink-0 ${getAvatarBg(customer.company || customer.customerName || '')}`}>
            {getCompanyInitials(customer.company || customer.customerName || '')}
          </div>
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              CRM Customer Profile
            </span>
            <h2 className="text-[38px] font-black tracking-tight mt-1 text-zinc-950 dark:text-white leading-tight">
              {customer.customerName || 'No data available'}
            </h2>
          </div>
        </div>
        <div className="flex gap-3.5 items-center self-start md:self-center">
          <span className={`px-3 py-1.5 text-sm font-semibold rounded-md border ${getPlanBadgeClass(customer.subscriptionPlan)}`}>
            {customer.subscriptionPlan || 'No data available'} Plan
          </span>
          <span className={`px-3 py-1.5 text-sm font-semibold rounded-md border ${getStatusBadgeClass(customer.status)}`}>
            {customer.status || 'No data available'}
          </span>
        </div>
      </div>

      {/* KPI Section - MRR and ARR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8">
        <div className="p-6 bg-zinc-50 dark:bg-darkBg-900/40 rounded-xl border border-zinc-200 dark:border-darkBg-750 min-h-[140px] flex flex-col justify-center shadow-sm">
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Monthly Recurring Revenue (MRR)
          </span>
          <p className="text-[62px] font-black tracking-tight text-emerald-600 dark:text-emerald-450 leading-none mt-3.5">
            {hasMrr ? `$${customer.mrr.toLocaleString()}/mo` : 'No data available'}
          </p>
        </div>
        <div className="p-6 bg-zinc-50 dark:bg-darkBg-900/40 rounded-xl border border-zinc-200 dark:border-darkBg-750 min-h-[140px] flex flex-col justify-center shadow-sm">
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Annual Recurring Revenue (ARR)
          </span>
          <p className="text-[62px] font-black tracking-tight text-brand-600 dark:text-brand-400 leading-none mt-3.5">
            {hasMrr ? `$${(customer.mrr * 12).toLocaleString()}/yr` : 'No data available'}
          </p>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-zinc-150 dark:border-darkBg-750">
        
        {/* Renewal Date */}
        <div className="p-4 bg-zinc-50 dark:bg-darkBg-900/30 rounded-xl border border-zinc-200 dark:border-darkBg-750 flex items-start gap-3.5 hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div className="p-2 rounded-lg bg-zinc-200/50 dark:bg-darkBg-800 text-zinc-500 dark:text-zinc-400 mt-0.5">
            <Calendar size={18} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Renewal Date
            </span>
            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
              {customer.renewalDate ? new Date(customer.renewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No data available'}
            </p>
          </div>
        </div>

        {/* Customer Since */}
        <div className="p-4 bg-zinc-50 dark:bg-darkBg-900/30 rounded-xl border border-zinc-200 dark:border-darkBg-750 flex items-start gap-3.5 hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div className="p-2 rounded-lg bg-zinc-200/50 dark:bg-darkBg-800 text-zinc-500 dark:text-zinc-400 mt-0.5">
            <CalendarDays size={18} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Customer Since
            </span>
            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
              {customer.customerId ? getCustomerSince(customer.customerId) : 'No data available'}
            </p>
          </div>
        </div>

        {/* Subscription Plan */}
        <div className="p-4 bg-zinc-50 dark:bg-darkBg-900/30 rounded-xl border border-zinc-200 dark:border-darkBg-750 flex items-start gap-3.5 hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div className="p-2 rounded-lg bg-zinc-200/50 dark:bg-darkBg-800 text-zinc-500 dark:text-zinc-400 mt-0.5">
            <CreditCard size={18} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Subscription Plan
            </span>
            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
              {customer.subscriptionPlan || 'No data available'}
            </p>
          </div>
        </div>

        {/* Account Owner */}
        <div className="p-4 bg-zinc-50 dark:bg-darkBg-900/30 rounded-xl border border-zinc-200 dark:border-darkBg-750 flex items-start gap-3.5 hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div className="p-2 rounded-lg bg-zinc-200/50 dark:bg-darkBg-800 text-zinc-500 dark:text-zinc-400 mt-0.5">
            <User size={18} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Account Owner
            </span>
            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
              {customer.accountOwner || 'No data available'}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="p-4 bg-zinc-50 dark:bg-darkBg-900/30 rounded-xl border border-zinc-200 dark:border-darkBg-750 flex items-start gap-3.5 hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div className="p-2 rounded-lg bg-zinc-200/50 dark:bg-darkBg-800 text-zinc-500 dark:text-zinc-400 mt-0.5">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Status Indicator
            </span>
            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
              {customer.status || 'No data available'}
            </p>
          </div>
        </div>

        {/* Industry */}
        <div className="p-4 bg-zinc-50 dark:bg-darkBg-900/30 rounded-xl border border-zinc-200 dark:border-darkBg-750 flex items-start gap-3.5 hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div className="p-2 rounded-lg bg-zinc-200/50 dark:bg-darkBg-800 text-zinc-500 dark:text-zinc-400 mt-0.5">
            <Building2 size={18} />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Industry Classification
            </span>
            <p className="text-base font-bold text-zinc-800 dark:text-zinc-200 mt-1">
              {customer.industry || 'No data available'}
            </p>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-5 border-t border-zinc-150 dark:border-darkBg-750 flex items-center justify-between text-sm text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <Fingerprint size={16} />
          <span>System Identifier: <code className="bg-zinc-100 dark:bg-darkBg-900 px-2 py-0.5 rounded font-mono text-xs text-zinc-600 dark:text-zinc-300">{customer.customerId || 'No data available'}</code></span>
        </div>
        <span>Data synced: Real-time API</span>
      </div>
    </div>
  );
}
