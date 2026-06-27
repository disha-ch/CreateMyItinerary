import React, { useState, useEffect } from 'react';
import { DayPlan, ItineraryActivity } from '../types';
import { Plus, Trash2, Check, Clock, Calendar, Sparkles, Map, Compass, RotateCcw } from 'lucide-react';

interface ItineraryPlannerProps {
  preselectedDestination: string;
}

export default function ItineraryPlanner({ preselectedDestination }: ItineraryPlannerProps) {
  const [destination, setDestination] = useState(preselectedDestination || 'Tokyo');
  const [duration, setDuration] = useState<number>(4);
  const [travelStyle, setTravelStyle] = useState<'Adventure' | 'Cultural' | 'Relaxed' | 'Foodie'>('Cultural');
  const [activeDay, setActiveDay] = useState<number>(1);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [newActivityText, setNewActivityText] = useState('');
  const [newActivityTime, setNewActivityTime] = useState('10:00');

  // Trigger regeneration whenever preselected destination changes from the explorer
  useEffect(() => {
    if (preselectedDestination) {
      setDestination(preselectedDestination);
      generateDefaultPlan(preselectedDestination, duration, travelStyle);
    }
  }, [preselectedDestination]);

  // Handle generation of default activity template
  const generateDefaultPlan = (dest: string, daysCount: number, style: string) => {
    const templates: Record<string, string[]> = {
      Adventure: [
        'Sunrise scenic hike to the highest panoramic point',
        'Ziplining or bike rental and off-road trail exploring',
        'Local outdoor gear shopping and bouldering session',
        'Guided kayak, canoe, or paddle boarding excursion',
        'Sunset ridge walk or canyon exploration with a group'
      ],
      Cultural: [
        'Guided historical walking tour of monuments and plazas',
        'Calligraphy, pottery, or traditional arts workshop',
        'Visit to the national history museum or art gallery',
        'Attend a local theater, live performance, or musical show',
        'Wander through ancient side alleys and old preservation districts'
      ],
      Relaxed: [
        'Late breakfast at a highly rated botanical cafe',
        'Scented herbal massage or mineral bath house session',
        'Stroll through a famous flower park or lake garden',
        'Afternoon book reading, sketching, or coffee testing',
        'Scenic sunset cruise or gourmet harborside dinner'
      ],
      Foodie: [
        'Morning street food tour with local market tasting',
        'Hands-on culinary class with an executive chef',
        'Visit to an organic farm, spice market, or tea grower',
        'Multi-course tasting menu or traditional banquet experience',
        'Night-time cocktail crafting bar or dessert crawl'
      ]
    };

    const styleActivities = templates[style as keyof typeof templates] || templates['Cultural'];

    const newPlans: DayPlan[] = Array.from({ length: daysCount }, (_, i) => {
      const dayNum = i + 1;
      const themeWord = style === 'Adventure' ? 'Thrills' : style === 'Foodie' ? 'Flavors' : style === 'Relaxed' ? 'Serenity' : 'Heritage';
      
      const activities: ItineraryActivity[] = [
        {
          id: `act-${dayNum}-1`,
          time: '09:00 AM',
          activity: `${styleActivities[0]} in ${dest}`,
          completed: false
        },
        {
          id: `act-${dayNum}-2`,
          time: '01:30 PM',
          activity: `${styleActivities[1]} followed by a local lunch`,
          completed: false
        },
        {
          id: `act-${dayNum}-3`,
          time: '06:00 PM',
          activity: `Experience ${styleActivities[2]} and sunset photos`,
          completed: false
        }
      ];

      return {
        dayNumber: dayNum,
        theme: `Day ${dayNum} - Local ${themeWord}`,
        activities
      };
    });

    setDayPlans(newPlans);
    setActiveDay(1);
  };

  // Run initial template load
  useEffect(() => {
    generateDefaultPlan(destination, duration, travelStyle);
  }, []);

  const handleRegenerate = () => {
    generateDefaultPlan(destination, duration, travelStyle);
  };

  const toggleActivityComplete = (dayNum: number, activityId: string) => {
    setDayPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.dayNumber === dayNum) {
          return {
            ...plan,
            activities: plan.activities.map(act =>
              act.id === activityId ? { ...act, completed: !act.completed } : act
            )
          };
        }
        return plan;
      })
    );
  };

  const deleteActivity = (dayNum: number, activityId: string) => {
    setDayPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.dayNumber === dayNum) {
          return {
            ...plan,
            activities: plan.activities.filter(act => act.id !== activityId)
          };
        }
        return plan;
      })
    );
  };

  const addCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;

    // Convert 24h format to 12h readable string
    let timeLabel = newActivityTime;
    try {
      const [hoursStr, minutesStr] = newActivityTime.split(':');
      const hours = parseInt(hoursStr, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      timeLabel = `${displayHours}:${minutesStr} ${ampm}`;
    } catch {
      // fallback
    }

    const newActivity: ItineraryActivity = {
      id: `custom-act-${Date.now()}`,
      time: timeLabel,
      activity: newActivityText.trim(),
      completed: false
    };

    setDayPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.dayNumber === activeDay) {
          // Sort activities by time roughly or just append
          return {
            ...plan,
            activities: [...plan.activities, newActivity]
          };
        }
        return plan;
      })
    );

    setNewActivityText('');
  };

  const currentPlan = dayPlans.find(p => p.dayNumber === activeDay);

  // Calculate overall progress across entire itinerary
  const totalActivities = dayPlans.reduce((sum, p) => sum + p.activities.length, 0);
  const completedActivities = dayPlans.reduce((sum, p) => sum + p.activities.filter(a => a.completed).length, 0);
  const progressPercent = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;

  return (
    <div id="itinerary-planner" className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/50 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-brand-50 px-3 py-1 rounded-full text-brand-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Tool</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 mb-4">
            Custom Day-by-Day Schedule Builder
          </h2>
          <p className="text-lg text-slate-600">
            Tailor your travel timeline dynamically. Configure parameters, generate templates, and insert custom activities seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Panel (Left) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-display font-black text-slate-900 mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-600" />
                <span>Configure Parameters</span>
              </h3>

              <div className="space-y-4">
                {/* Destination Input */}
                <div>
                  <label htmlFor="destination-input" className="block text-slate-400 text-[10px] uppercase font-black mb-2 tracking-widest">
                    Where are you traveling?
                  </label>
                  <input
                    id="destination-input"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Kyoto, Banff, Paris"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-xs font-medium bg-slate-50"
                  />
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="duration-slider" className="block text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      Trip Duration
                    </label>
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100 font-mono">
                      {duration} {duration === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <input
                    id="duration-slider"
                    type="range"
                    min="1"
                    max="7"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-1">
                    <span>1 Day</span>
                    <span>3 Days</span>
                    <span>5 Days</span>
                    <span>7 Days</span>
                  </div>
                </div>

                {/* Travel Style Selector */}
                <div>
                  <label className="block text-slate-400 text-[10px] uppercase font-black mb-2 tracking-widest">
                    Travel Vibe & Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Adventure', 'Cultural', 'Relaxed', 'Foodie'] as const).map(style => (
                      <button
                        id={`style-${style.toLowerCase()}-btn`}
                        key={style}
                        type="button"
                        onClick={() => setTravelStyle(style)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          travelStyle === style
                            ? 'bg-brand-50 border-brand-300 text-brand-800 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100">
              <button
                id="generate-plan-btn"
                onClick={handleRegenerate}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Generate New Template</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Note: Generating a template resets custom additions for these days.
              </p>
            </div>
          </div>

          {/* Timeline View (Right) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              {/* Day Tab Selectors */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex flex-wrap gap-1.5">
                  {dayPlans.map(p => (
                    <button
                      id={`day-tab-${p.dayNumber}`}
                      key={p.dayNumber}
                      onClick={() => setActiveDay(p.dayNumber)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeDay === p.dayNumber
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-500/15'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Day {p.dayNumber}
                    </button>
                  ))}
                </div>

                {/* Completion Progress Mini bar */}
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Trip Progress</p>
                    <p className="text-xs font-bold text-slate-700 font-mono">{completedActivities}/{totalActivities} Completed</p>
                  </div>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Day Detail Header */}
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-display font-bold text-slate-900">
                    {currentPlan?.theme}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Map className="w-3.5 h-3.5 text-brand-500" />
                    <span>Personalized route in {destination}</span>
                  </p>
                </div>
              </div>

              {/* Active Day Activities List */}
              <div className="space-y-3 mb-8 min-h-[220px]">
                {currentPlan && currentPlan.activities.length > 0 ? (
                   currentPlan.activities.map((act) => (
                    <div
                      id={`itinerary-item-${act.id}`}
                      key={act.id}
                      className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all ${
                        act.completed
                          ? 'bg-slate-50 border-slate-200 opacity-70'
                          : 'bg-white border-slate-200 hover:shadow-xs hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          id={`toggle-act-${act.id}`}
                          onClick={() => toggleActivityComplete(activeDay, act.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                            act.completed
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-brand-500'
                          }`}
                        >
                          {act.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono mb-0.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-brand-500" />
                            <span>{act.time}</span>
                          </div>
                          <p className={`text-xs font-semibold ${act.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {act.activity}
                          </p>
                        </div>
                      </div>
                      <button
                        id={`delete-act-${act.id}`}
                        onClick={() => deleteActivity(activeDay, act.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                    <Calendar className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs font-medium">No activities scheduled for Day {activeDay}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Use the field below to customize this day.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Custom Activity Form */}
            <form onSubmit={addCustomActivity} className="border-t border-slate-100 pt-5 mt-auto">
              <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2.5">
                + Append Custom Event to Day {activeDay}
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-32">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    id="new-activity-time-input"
                    type="time"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-medium bg-slate-50/50"
                  />
                </div>
                <div className="relative flex-1">
                  <input
                    id="new-activity-text-input"
                    type="text"
                    value={newActivityText}
                    onChange={(e) => setNewActivityText(e.target.value)}
                    placeholder="e.g. Evening sushi dinner at Sukiyabashi, Photo at overlook..."
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs font-medium bg-slate-50/50"
                  />
                </div>
                <button
                  id="add-activity-btn"
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-5 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
