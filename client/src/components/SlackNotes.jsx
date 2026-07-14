import React from 'react';
import { FileText, HeartHandshake, Quote } from 'lucide-react';

export default function SlackNotes({ notes }) {
  if (!notes) {
    return (
      <div className="glass-card p-8 hover:shadow-md transition-shadow duration-300">
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Slack Integration
        </span>
        <h3 className="text-[20px] font-bold tracking-tight mt-2 text-zinc-950 dark:text-white">
          Internal Logs
        </h3>
        <p className="text-base text-zinc-450 dark:text-zinc-500 mt-4">No data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-8 hover:shadow-md transition-shadow duration-300">
      <div className="mb-6">
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Slack Integration
        </span>
        <h3 className="text-[20px] font-bold tracking-tight mt-2 text-zinc-950 dark:text-white flex items-center gap-3">
          Internal Logs & Activity
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#4A154B]/10 dark:bg-[#4A154B]/30 text-[#4A154B] dark:text-[#E01E5A] border border-[#4A154B]/20">
            Slack Active
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Internal Notes */}
        <div className="bg-zinc-50 dark:bg-darkBg-900/40 p-6 rounded-xl border border-zinc-200 dark:border-darkBg-850 flex flex-col justify-between shadow-sm min-h-[180px] hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold text-sm uppercase tracking-wider mb-4 flex-wrap">
              <FileText size={16} className="text-[#36C5F0] flex-shrink-0" />
              <span>Internal Notes</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 ml-auto">
                Customer Success
              </span>
            </div>
            <p className="text-base text-zinc-650 dark:text-zinc-300 leading-relaxed">
              {notes.internalNotes || "-"}
            </p>
          </div>
          <div className="mt-6 text-xs text-zinc-400 dark:text-zinc-500 text-right">
            Updated by Account Owner
          </div>
        </div>

        {/* Sales Updates */}
        <div className="bg-zinc-50 dark:bg-darkBg-900/40 p-6 rounded-xl border border-zinc-200 dark:border-darkBg-850 flex flex-col justify-between shadow-sm min-h-[180px] hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold text-sm uppercase tracking-wider mb-4 flex-wrap">
              <HeartHandshake size={16} className="text-[#ECB22E] flex-shrink-0" />
              <span>Sales Updates</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 ml-auto">
                Sales
              </span>
            </div>
            <p className="text-base text-zinc-650 dark:text-zinc-300 leading-relaxed">
              {notes.salesUpdates || "-"}
            </p>
          </div>
          <div className="mt-6 text-xs text-zinc-400 dark:text-zinc-500 text-right">
            Synced with Salesforce
          </div>
        </div>

        {/* Customer Feedback */}
        <div className="bg-zinc-50 dark:bg-darkBg-900/40 p-6 rounded-xl border border-zinc-200 dark:border-darkBg-850 flex flex-col justify-between shadow-sm min-h-[180px] hover:border-zinc-300 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div>
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-bold text-sm uppercase tracking-wider mb-4 flex-wrap">
              <Quote size={16} className="text-[#2EB67D] flex-shrink-0" />
              <span>Direct Feedback</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/20 ml-auto">
                Engineering
              </span>
            </div>
            <p className="text-base text-zinc-650 dark:text-zinc-300 leading-relaxed italic">
              {notes.customerFeedback ? `"${notes.customerFeedback}"` : "-"}
            </p>
          </div>
          <div className="mt-6 text-xs text-zinc-400 dark:text-zinc-500 text-right">
            Logged from slack-feed
          </div>
        </div>
      </div>
    </div>
  );
}
