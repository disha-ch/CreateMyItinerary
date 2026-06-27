import React, { useState } from 'react';
import { BudgetCategory } from '../types';
import { Wallet, DollarSign, PiggyBank, Flame, Lightbulb, TrendingUp } from 'lucide-react';

export default function BudgetCalculator() {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: 'flights', label: 'Flights & Transit', amount: 800, color: '#3b82f6' }, // Blue
    { id: 'lodging', label: 'Lodging & Hotels', amount: 1200, color: '#10b981' }, // Emerald
    { id: 'food', label: 'Dining & Food', amount: 450, color: '#f59e0b' },     // Amber
    { id: 'activities', label: 'Tours & Activities', amount: 350, color: '#8b5cf6' }, // Violet
    { id: 'insurance', label: 'Travel Insurance', amount: 100, color: '#ec4899' },  // Pink
    { id: 'shopping', label: 'Shopping & Gifts', amount: 200, color: '#06b6d4' }   // Cyan
  ]);

  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const totalBudget = categories.reduce((sum, cat) => sum + cat.amount, 0);

  const handleAmountChange = (id: string, val: string) => {
    const numeric = parseFloat(val);
    const amount = isNaN(numeric) || numeric < 0 ? 0 : numeric;
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, amount } : cat))
    );
  };

  // Find the highest expense category
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  const highestCategory = sortedCategories[0]?.amount > 0 ? sortedCategories[0] : null;

  // Render smart contextual tip based on largest cost
  const getContextualTip = (catId: string) => {
    switch (catId) {
      case 'flights':
        return {
          title: 'Optimize Flight Costs',
          tip: 'Use flight trackers (Google Flights, Hopper) and set alerts 3-5 months ahead. Try flying on mid-week days (Tuesday/Wednesday) or look into alternative nearby budget airports.'
        };
      case 'lodging':
        return {
          title: 'Reduce Accommodation Fees',
          tip: 'Consider booking apartments (Airbnb) with kitchens to cook basic breakfasts, or look into highly rated boutique hostels with private rooms. Splitting rooms with group travelers reduces costs exponentially.'
        };
      case 'food':
        return {
          title: 'Dine Like a Local',
          tip: 'Avoid tourist-trap cafes directly facing major plazas. Walk 2-3 blocks into residential side streets for authentic menus. Food halls, bakery lunches, and night markets offer incredible culinary quality for a fraction of restaurant costs.'
        };
      case 'activities':
        return {
          title: 'Smart Activity Bundles',
          tip: 'Investigate if the city offers an all-inclusive multi-day pass (like Klook, Go City pass) which bundles entry tickets. Check for free museum entry days (often first Sundays) and complimentary local walking tours.'
        };
      case 'shopping':
        return {
          title: 'Souvenir Strategy',
          tip: 'Skip airport gift shops! Purchase local snacks, coffee beans, and unique crafts directly from neighborhood supermarkets or local flea markets. They are authentic and usually 50% cheaper.'
        };
      default:
        return {
          title: 'Stay Prepared',
          tip: 'Always set aside 10% of your total estimated cash in a dedicated, high-yield digital pocket or mobile wallet as an emergency backup cushion.'
        };
    }
  };

  const activeTip = highestCategory ? getContextualTip(highestCategory.id) : getContextualTip('default');

  // Math for SVG Circle Donut Chart
  const radius = 60;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div id="budget-estimator" className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/50 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-brand-50 px-3 py-1 rounded-full text-brand-700 text-xs font-bold mb-3">
            <Wallet className="w-3.5 h-3.5" />
            <span>Interactive Cost Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 mb-4">
            Interactive Travel Budget Allocator
          </h2>
          <p className="text-lg text-slate-600">
            Dynamically adjust individual category allocations to instantly visualize cash distribution and unlock smart, money-saving tips.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-display font-black text-slate-900 mb-5 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-600" />
                <span>Adjust Allocations (USD)</span>
              </h3>

              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="relative">
                    <label htmlFor={`budget-input-${cat.id}`} className="flex justify-between text-slate-400 text-[10px] uppercase font-black mb-1.5 tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.label}
                      </span>
                      <span className="text-slate-400 font-mono font-bold">
                        {totalBudget > 0 ? Math.round((cat.amount / totalBudget) * 100) : 0}%
                      </span>
                    </label>
                    <div className="relative rounded-xl shadow-xs">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-xs font-semibold">$</span>
                      </div>
                      <input
                        id={`budget-input-${cat.id}`}
                        type="number"
                        min="0"
                        value={cat.amount === 0 ? '' : cat.amount}
                        onChange={(e) => handleAmountChange(cat.id, e.target.value)}
                        placeholder="0"
                        className="block w-full pl-8 pr-12 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-xs font-bold font-mono text-slate-800 bg-slate-50"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-slate-400 text-[10px] font-bold uppercase font-mono">USD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 bg-brand-50/50 -mx-6 -mb-6 p-6 rounded-b-[1.9rem]">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-brand-950 uppercase tracking-widest block mb-1">Total Planned Cost</span>
                  <span className="text-3xl font-display font-black text-slate-900 font-mono">
                    ${totalBudget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="bg-brand-600 text-white p-2.5 rounded-xl shadow-xs shadow-brand-500/10">
                  <PiggyBank className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Visualization & Smart Insights (Right) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* Chart SVG (Left of card) */}
            <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-1/2">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* Base Circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth={strokeWidth}
                  />

                  {/* Category Slices */}
                  {categories.map((cat) => {
                    const pct = totalBudget > 0 ? cat.amount / totalBudget : 0;
                    if (pct === 0) return null;

                    const strokeDasharray = `${pct * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedPercent * circumference;
                    accumulatedPercent += pct;

                    const isHovered = activeSegment === cat.id;

                    return (
                      <circle
                        id={`donut-slice-${cat.id}`}
                        key={cat.id}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        onMouseEnter={() => setActiveSegment(cat.id)}
                        onMouseLeave={() => setActiveSegment(null)}
                        className="transition-all duration-300 cursor-pointer"
                        style={{ transformOrigin: '80px 80px' }}
                      />
                    );
                  })}
                </svg>

                {/* Center Text inside Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {activeSegment ? (
                    (() => {
                      const activeCat = categories.find(c => c.id === activeSegment);
                      const activePct = activeCat && totalBudget > 0 ? Math.round((activeCat.amount / totalBudget) * 100) : 0;
                      return (
                        <div className="px-3 fade-in-up">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block leading-tight">
                            {activeCat?.label}
                          </span>
                          <span className="text-xl font-extrabold text-slate-800 font-mono">
                            ${activeCat?.amount.toLocaleString()}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 block">
                            {activePct}% of total
                          </span>
                        </div>
                      );
                    })()
                  ) : (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Budget Breakdown</span>
                      <span className="text-xs text-slate-500">Hover sectors for detail</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mini Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-6 max-w-xs">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setActiveSegment(cat.id)}
                    onMouseLeave={() => setActiveSegment(null)}
                    className={`flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer transition-opacity ${
                      activeSegment && activeSegment !== cat.id ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-600">{cat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Contextual Budget Recommendation (Right of card) */}
            <div className="flex-1 w-full self-start">
              <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>AI Financial Advisor Suggestion</span>
              </h4>

              {highestCategory && highestCategory.amount > 0 ? (
                <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100/40">
                  <div className="flex items-start gap-3">
                    <div className="bg-brand-100 text-brand-700 p-2 rounded-lg shrink-0">
                      <Flame className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h5 className="text-sm font-extrabold text-slate-900 font-display">
                        {activeTip.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Matched since your largest expense is <span className="text-brand-600 font-bold font-mono">{highestCategory.label}</span> (${highestCategory.amount.toLocaleString()})
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 mt-4 leading-relaxed font-medium">
                    {activeTip.tip}
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center py-8">
                  <PiggyBank className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h5 className="text-xs font-bold text-slate-700">No expenses logged yet</h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Input dollar amounts in the left sidebar to generate smart cost-reduction suggestions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
