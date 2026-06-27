import React, { useState } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { Destination } from '../types';
import { Search, MapPin, Star, Calendar, DollarSign, Compass, CheckCircle, ArrowRight } from 'lucide-react';

interface DestinationExplorerProps {
  onSelectDestination: (destName: string) => void;
}

export default function DestinationExplorer({ onSelectDestination }: DestinationExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedDest, setSelectedDest] = useState<Destination>(DESTINATIONS[0]);
  const [checkedSights, setCheckedSights] = useState<Record<string, boolean>>({});

  // Extract all unique tags
  const allTags = ['All', ...Array.from(new Set(DESTINATIONS.flatMap(d => d.tags)))];

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || dest.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const toggleSight = (sight: string) => {
    setCheckedSights(prev => ({
      ...prev,
      [sight]: !prev[sight]
    }));
  };

  return (
    <div id="destination-explorer" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      
      {/* Header section with clean bento hierarchy */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-brand-600 text-xs font-bold tracking-widest uppercase bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-100">
          Curated Discovery
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight text-slate-900 mt-4 mb-4">
          Interactive Destination Guide
        </h2>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
          Unlock handpicked destinations, local advisory checklists, and seasonal details. Select any card to configure your custom itinerary instantly.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-xs border border-slate-200">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="search-destination-input"
            type="text"
            placeholder="Search city, country, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-xs placeholder:text-slate-400 bg-slate-50 font-medium"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {allTags.map(tag => (
            <button
              id={`tag-${tag.toLowerCase()}-btn`}
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTag === tag
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Destination List (Left/Bottom) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[750px] overflow-y-auto pr-2">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map(dest => {
              const isSelected = selectedDest.id === dest.id;
              return (
                <div
                  id={`dest-card-${dest.id}`}
                  key={dest.id}
                  onClick={() => {
                    setSelectedDest(dest);
                    // Scroll details into view on small screens
                    if (window.innerWidth < 1024) {
                      document.getElementById('dest-detail-card')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-600 ring-2 ring-brand-500/10 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {dest.rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                      <MapPin className="w-3 h-3 text-brand-600" />
                      <span>{dest.country}</span>
                    </div>
                    <h3 className="font-display font-black text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mt-1 mb-4 flex-grow leading-relaxed font-medium">
                      {dest.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-auto">
                      <div className="flex gap-1">
                        {dest.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-brand-50 text-brand-700 text-[9px] px-2 py-0.5 rounded-md font-bold tracking-wide uppercase border border-brand-100/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-xs font-bold text-slate-700">
                        <DollarSign className="w-3 h-3 text-emerald-600 -mr-0.5" />
                        <span className="text-[10px] text-slate-400 font-normal mr-1">Cost:</span>
                        <span className={dest.budgetLevel === 'High' ? 'text-rose-600' : dest.budgetLevel === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}>
                          {dest.budgetLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
              <Compass className="w-12 h-12 mx-auto text-slate-300 mb-3 animate-spin duration-10000" />
              <p className="font-bold text-slate-800 text-sm">No destinations found</p>
              <p className="text-xs text-slate-500 mt-1">Try another keyword or filter tag.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
                className="mt-4 text-xs text-brand-600 font-bold underline hover:text-brand-700 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Selected Destination Detailed Panel (Right) */}
        <div id="dest-detail-card" className="lg:col-span-5 bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xs relative lg:sticky lg:top-24">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-black tracking-widest block mb-1">
                Active Guide
              </span>
              <h3 className="text-2xl font-display font-black text-slate-900 leading-tight">
                {selectedDest.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{selectedDest.country}</p>
            </div>
            <button
              id={`load-planner-${selectedDest.id}`}
              onClick={() => onSelectDestination(selectedDest.name)}
              className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-brand-500/10 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Plan This</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
            {selectedDest.description}
          </p>

          <div className="space-y-4 mb-6">
            {/* Best Time to Go */}
            <div className="flex items-start gap-3 bg-amber-50/70 p-4 rounded-2xl border border-amber-100">
              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Recommended Travel Season</h4>
                <p className="text-xs text-amber-800 mt-1 font-bold">{selectedDest.bestTime}</p>
              </div>
            </div>

            {/* Must See Sights (Interactive checkboxes) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  MUST-SEE LANDMARKS
                </h4>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {selectedDest.mustSee.filter(s => checkedSights[s]).length} / {selectedDest.mustSee.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDest.mustSee.map(sight => {
                  const isChecked = checkedSights[sight] || false;
                  return (
                    <button
                      id={`sight-chk-${sight.replace(/\s+/g, '-').toLowerCase()}`}
                      key={sight}
                      onClick={() => toggleSight(sight)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isChecked
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isChecked ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`} />
                      <span className={`line-clamp-1 ${isChecked ? 'line-through text-slate-400' : ''}`}>{sight}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Day by Day Suggested Highlights */}
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              SUGGESTED 3-DAY ROUTINE
            </h4>
            <div className="space-y-4">
              {selectedDest.suggestedItinerary.map((dayPlan) => (
                <div key={dayPlan.day} className="flex gap-3 relative group">
                  {/* Stepper Timeline Bar */}
                  {dayPlan.day < selectedDest.suggestedItinerary.length && (
                    <div className="absolute left-[13px] top-6 bottom-[-20px] w-0.5 bg-slate-100 group-hover:bg-brand-100 transition-colors" />
                  )}
                  {/* Stepper Node */}
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-50 text-brand-700 text-xs font-black shrink-0 border border-brand-100 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all font-mono">
                    {dayPlan.day}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {dayPlan.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-medium">
                      {dayPlan.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
