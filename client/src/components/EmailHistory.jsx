import React from 'react';
import { Mail, Smile, Meh, Frown, Inbox } from 'lucide-react';

export default function EmailHistory({ emails = [] }) {
  const getSentimentBadge = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return {
          label: 'Positive',
          classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-250 dark:border-emerald-800/60',
          icon: <Smile size={12} className="text-emerald-500" />
        };
      case 'negative':
        return {
          label: 'Negative',
          classes: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-250 dark:border-rose-800/60',
          icon: <Frown size={12} className="text-rose-500" />
        };
      case 'neutral':
      default:
        return {
          label: 'Neutral',
          classes: 'bg-zinc-50 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60',
          icon: <Meh size={12} className="text-zinc-400" />
        };
    }
  };

  const positiveCount = emails.filter(e => e.sentiment?.toLowerCase() === 'positive').length;
  const neutralCount = emails.filter(e => e.sentiment?.toLowerCase() === 'neutral').length;
  const negativeCount = emails.filter(e => e.sentiment?.toLowerCase() === 'negative').length;

  return (
    <div className="glass-card p-8 hover:shadow-md transition-shadow duration-300">
      <div className="mb-6">
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Email Communication
        </span>
        <h3 className="text-[20px] font-bold tracking-tight mt-2 text-zinc-950 dark:text-white flex items-center gap-3">
          Conversations Log
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-zinc-100 dark:bg-darkBg-750 text-zinc-600 dark:text-zinc-400">
            {emails.length} threads
          </span>
        </h3>
      </div>

      {/* Sentiment Counters Row */}
      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-zinc-50 dark:bg-darkBg-900/30 rounded-xl border border-zinc-200 dark:border-darkBg-750">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">Positive</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">{positiveCount}</span>
        </div>
        <div className="text-center border-x border-zinc-200 dark:border-darkBg-750">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">Neutral</span>
          <span className="text-xl font-extrabold text-zinc-600 dark:text-zinc-400 mt-1 block">{neutralCount}</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">Negative</span>
          <span className="text-xl font-extrabold text-rose-600 dark:text-rose-455 mt-1 block">{negativeCount}</span>
        </div>
      </div>

      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-400 dark:text-zinc-500 border border-dashed border-zinc-200 dark:border-darkBg-750 rounded-xl">
          <Inbox size={32} className="mb-3 text-zinc-300 dark:text-zinc-755" />
          <p className="text-base font-semibold">No emails recorded</p>
          <p className="text-sm text-zinc-550 mt-1">No communication log found for this customer.</p>
        </div>
      ) : (
        <div className="relative border-l border-zinc-250 dark:border-darkBg-750 ml-3.5 pl-6 space-y-6 max-h-[340px] overflow-y-auto pr-1">
          {emails.map((email, idx) => {
            const sentiment = getSentimentBadge(email.sentiment);
            return (
              <div key={idx} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[33px] top-1 p-1 bg-white dark:bg-darkBg-850 rounded-full border border-zinc-200 dark:border-darkBg-750 text-zinc-400 dark:text-zinc-500 group-hover:border-brand-500 group-hover:text-brand-500 transition-colors">
                  <Mail size={12} />
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-brand-500 transition-colors">
                    {email.subject || '-'}
                  </h4>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm text-zinc-400 dark:text-zinc-500">
                      {email.date ? new Date(email.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border flex items-center gap-1.5 ${sentiment.classes}`}>
                      {sentiment.icon}
                      {sentiment.label || '-'}
                    </span>
                  </div>
                </div>

                <p className="text-base text-zinc-700 dark:text-zinc-305 mt-3 leading-relaxed bg-zinc-50 dark:bg-darkBg-900/40 p-4 rounded-lg border border-zinc-150 dark:border-darkBg-800">
                  {email.summary || '-'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
