import React from 'react';
import { Activity, Clock, Users } from 'lucide-react';

export default function ProductUsage({ usage }) {
  const { 
    activeUsers = null, 
    lastLogin = null, 
    healthScore = null, 
    featureUsage = null 
  } = usage || {};

  const getHealthColor = (score) => {
    if (score === null || score === undefined) return 'text-zinc-400 stroke-zinc-200';
    if (score >= 90) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 70) return 'text-teal-500 stroke-teal-500';
    if (score >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getHealthBg = (score) => {
    if (score === null || score === undefined) return 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200';
    if (score >= 90) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
    if (score >= 70) return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25';
    if (score >= 50) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/25';
  };

  const getHealthLabel = (score) => {
    if (score === null || score === undefined) return 'No data available';
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return 'No data available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'No data available';
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'No data available';
    }
  };

  // SVG parameters for circular health ring
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const scoreForRing = healthScore ?? 0;
  const strokeDashoffset = circumference - (scoreForRing / 100) * circumference;

  return (
    <div className="glass-card p-8 hover:shadow-md transition-shadow duration-300">
      <div className="mb-8">
        <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Product Metrics
        </span>
        <h3 className="text-[20px] font-bold tracking-tight mt-2 text-zinc-950 dark:text-white">
          Product Usage & Engagement
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Health Score Circular Dial */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-darkBg-900/40 rounded-xl border border-zinc-200 dark:border-darkBg-750 min-h-[220px]">
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
            Customer Health Index
          </span>
          <div className="relative flex items-center justify-center w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-zinc-200 dark:stroke-darkBg-750"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Foreground score ring */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className={`health-ring transition-all duration-300 ${getHealthColor(healthScore)}`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-zinc-950 dark:text-white leading-none">
                {healthScore !== null && healthScore !== undefined ? healthScore : 0}
              </span>
              <span className="text-xs text-zinc-450 dark:text-zinc-500 mt-1">/ 100</span>
            </div>
          </div>
          <span className={`mt-4 px-3.5 py-1 rounded-full text-xs font-bold border ${getHealthBg(healthScore)}`}>
            {getHealthLabel(healthScore)}
          </span>
        </div>

        {/* Usage Stats (Active Users, Last Login) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Users */}
          <div className="p-6 bg-zinc-50 dark:bg-darkBg-900/40 rounded-xl border border-zinc-200 dark:border-darkBg-750 min-h-[140px] flex flex-col justify-center shadow-sm hover:border-zinc-350 dark:hover:border-darkBg-700 transition-colors duration-200">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
              <Users size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Active Seats</span>
            </div>
            <p className="text-[56px] font-black tracking-tight text-zinc-800 dark:text-white leading-none mt-3.5">
              {activeUsers !== undefined && activeUsers !== null ? activeUsers.toLocaleString() : 'No data available'}
            </p>
          </div>

          {/* Last Login */}
          <div className="p-6 bg-zinc-50 dark:bg-darkBg-900/40 rounded-xl border border-zinc-200 dark:border-darkBg-750 min-h-[140px] flex flex-col justify-center shadow-sm hover:border-zinc-350 dark:hover:border-darkBg-700 transition-colors duration-200">
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
              <Clock size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Last Activity</span>
            </div>
            <p className="text-lg font-extrabold text-zinc-800 dark:text-white mt-4">
              {formatLastLogin(lastLogin)}
            </p>
            <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1">Automated telemetry capture</p>
          </div>
        </div>

        {/* Feature Usage breakdown */}
        <div className="lg:col-span-4 p-6 bg-zinc-50 dark:bg-darkBg-900/40 rounded-xl border border-zinc-200 dark:border-darkBg-750 min-h-[300px] flex flex-col justify-center hover:border-zinc-350 dark:hover:border-darkBg-700 transition-colors duration-200">
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 mb-5">
            <Activity size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Feature Adoption</span>
          </div>
          <div className="space-y-4">
            {featureUsage && Object.keys(featureUsage).length > 0 ? (
              Object.entries(featureUsage).map(([feature, pct]) => {
                const percentage = pct ?? 0;
                return (
                  <div key={feature}>
                    <div className="flex justify-between text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      <span>{feature}</span>
                      <span className="font-extrabold text-zinc-850 dark:text-zinc-100">{percentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 dark:bg-darkBg-750 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percentage >= 90 ? 'bg-emerald-500' : percentage >= 70 ? 'bg-teal-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-zinc-450 dark:text-zinc-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
