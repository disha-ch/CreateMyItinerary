import React, { useState, useEffect } from 'react';
import DestinationExplorer from './components/DestinationExplorer';
import ItineraryPlanner from './components/ItineraryPlanner';
import PackingList from './components/PackingList';
import BudgetCalculator from './components/BudgetCalculator';
import TravelChat from './components/TravelChat';
import { Compass, Calendar, Backpack, Wallet, Plane, Heart, ArrowRight, Star, Globe, ShieldCheck, ExternalLink, Database, RefreshCw, Trash2 } from 'lucide-react';

export default function App() {
  const [selectedDestination, setSelectedDestination] = useState('Kyoto');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('travel_session_id') || 'my-user-1';
  });
  const [apiUrl, setApiUrl] = useState(() => {
    return localStorage.getItem('travel_api_url') || 'https://f3ec4cf8-cb70-4943-aa5e-dc56483cac21-00-2vu9a6m4p5sgw.sisko.replit.dev';
  });
  const [apiHealth, setApiHealth] = useState<'online' | 'offline' | 'checking'>('checking');

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('travel_session_id', sessionId);
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem('travel_api_url', apiUrl);
  }, [apiUrl]);

  const checkApiHealth = async () => {
    setApiHealth('checking');
    try {
      const res = await fetch(`${apiUrl}/api/healthz`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'ok') {
          setApiHealth('online');
          return;
        }
      }
      setApiHealth('offline');
    } catch (err) {
      console.error("API Healthcheck failed:", err);
      setApiHealth('offline');
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, [apiUrl]);

  const handleSelectDestinationForPlanning = (destName: string) => {
    setSelectedDestination(destName);
    // Smoothly scroll down to the planner section
    const plannerSec = document.getElementById('itinerary-planner');
    if (plannerSec) {
      plannerSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-brand-100 selection:text-brand-900">
      
      {/* Floating Island Header */}
      <header className="sticky top-0 z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-200/80 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Plane className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">CreateMyItinerary</span>
              <span className="text-[9px] text-slate-400 font-bold block font-mono tracking-widest uppercase">Travel System</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              id="nav-link-explore"
              onClick={() => scrollToSection('destination-explorer')}
              className="text-slate-600 hover:text-brand-600 transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer"
            >
              Explore
            </button>
            <button
              id="nav-link-planner"
              onClick={() => scrollToSection('itinerary-planner')}
              className="text-slate-600 hover:text-brand-600 transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer"
            >
              Itinerary
            </button>
            <button
              id="nav-link-packing"
              onClick={() => scrollToSection('packing-checklist')}
              className="text-slate-600 hover:text-brand-600 transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer"
            >
              Gear
            </button>
            <button
              id="nav-link-budget"
              onClick={() => scrollToSection('budget-estimator')}
              className="text-slate-600 hover:text-brand-600 transition-colors font-semibold text-xs uppercase tracking-wider cursor-pointer"
            >
              Budget
            </button>
          </nav>

          {/* CTA Header Button */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-500">
              Region: Global
            </div>
            <button
              id="header-cta-btn"
              onClick={() => scrollToSection('destination-explorer')}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-brand-500/15 active:scale-95 cursor-pointer"
            >
              Plan Journey
            </button>
          </div>
        </div>
      </header>

      {/* Hero Bento Grid Section */}
      <section id="hero" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Main Featured Interactive Bento Card (Col span 2, row span 2) */}
          <div className="md:col-span-2 md:row-span-2 rounded-[2rem] bg-brand-600 relative overflow-hidden group shadow-lg shadow-brand-200/50 flex flex-col justify-between p-8 min-h-[420px] transition-all hover:shadow-xl hover:shadow-brand-300/60">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/40 to-transparent z-0" />
            
            {/* Ambient image background */}
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"
              alt="Adventure roadmap background"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Header part */}
            <div className="z-10 relative">
              <span className="px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] text-white uppercase tracking-widest font-black">
                Next Adventure
              </span>
            </div>

            {/* Bottom part */}
            <div className="z-10 relative mt-auto space-y-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white leading-[1.08] tracking-tight">
                  Master the Art of<br />Travel Planning.
                </h1>
                <p className="text-brand-100 text-sm mt-3 max-w-md leading-relaxed font-medium">
                  Eliminate travel anxiety. Discover curated seasonal schedules, track packing weights, and allocate budgets interactively in one sleek dashboard.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  id="hero-primary-cta"
                  onClick={() => scrollToSection('destination-explorer')}
                  className="flex items-center gap-1.5 bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Explore Destinations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="hero-secondary-cta"
                  onClick={() => scrollToSection('itinerary-planner')}
                  className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all border border-white/20 active:scale-95 cursor-pointer"
                >
                  <span>Custom Schedule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Flight Status Style Card */}
          <div className="rounded-[2rem] bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold text-lg">
                ✈
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Confirmed Plan</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Departure Route</p>
              <p className="text-2xl font-bold text-slate-900 tracking-tight font-display">NRT → {selectedDestination || 'Kyoto'}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Active destination chosen below. Pick from the curated list or change it anytime.
              </p>
            </div>
          </div>

          {/* Bento Card 3: Weather Forecast Card */}
          <div className="rounded-[2rem] bg-white border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:border-slate-300 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold text-lg">
                🌤
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Seasonal Tip</span>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Forecast Advisory</p>
              <p className="text-2xl font-bold text-slate-900 tracking-tight font-display">Perfect Season</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Temperate weather, excellent for walking tours & temple scenery.
              </p>
            </div>
          </div>

          {/* Bento Card 4: Progress Indicator Tracker */}
          <div className="md:col-span-2 rounded-[2rem] bg-slate-900 text-white p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
              <Compass className="w-48 h-48 -mr-12 -mt-12 text-white" />
            </div>
            
            <div className="flex-1 space-y-3 z-10">
              <span className="text-[10px] font-extrabold text-brand-400 uppercase tracking-widest block font-mono">Real-time status</span>
              <h3 className="text-white font-bold text-lg font-display tracking-tight leading-tight">
                Smart Itinerary Checklist Progress
              </h3>
              <p className="text-xs text-slate-400 leading-normal max-w-sm font-medium">
                As you check off landmarks, customized itinerary items, or packing gear below, your unified dashboard progress remains secure and updated instantly.
              </p>
            </div>
            <div className="w-full sm:w-28 h-28 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-white/40 text-[10px] uppercase font-bold text-center leading-normal shrink-0 z-10 bg-white/5">
              <span>Interactive</span>
              <span className="text-brand-400 text-lg my-1 font-bold">100%</span>
              <span>Client-Side</span>
            </div>
          </div>

          {/* Bento Card 5: Cultural Tip Card */}
          <div className="rounded-[2rem] bg-indigo-50 border border-indigo-100 p-6 shadow-xs flex flex-col justify-center items-center text-center">
            <div className="text-3xl mb-2">🏮</div>
            <h4 className="text-sm font-bold text-indigo-900 mb-1 font-display">Cultural Protocol</h4>
            <p className="text-[11px] text-indigo-700 leading-relaxed italic font-medium">
              A bow signifies respect and greeting in Japan. Tipping is not expected or standard in local restaurants.
            </p>
          </div>

          {/* Bento Card 6: API Connection Badge */}
          <div className="rounded-[2rem] bg-indigo-50 border border-indigo-100 p-6 shadow-sm flex flex-col justify-between transition-all hover:border-indigo-200">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-indigo-100/50 rounded-xl flex items-center justify-center text-indigo-700 font-bold text-lg">
                🔌
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                apiHealth === 'online' ? 'text-emerald-600' : apiHealth === 'checking' ? 'text-amber-600' : 'text-rose-600'
              }`}>
                {apiHealth === 'online' ? '🟢 API Online' : apiHealth === 'checking' ? '⚙️ Connecting...' : '🔴 API Offline'}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-indigo-400 text-[10px] uppercase font-bold tracking-wider mb-1">Replit AI Connection</p>
              <p className="text-base sm:text-lg font-bold text-indigo-950 tracking-tight font-display mb-1 flex items-center gap-1.5 flex-wrap">
                Session: <code className="font-mono bg-indigo-100/80 px-1.5 py-0.5 rounded text-xs text-indigo-800">{sessionId}</code>
              </p>
              <p className="text-[11px] text-indigo-700 leading-normal font-medium mb-3">
                Wired directly to the live Replit travel API. Conversation history and session control are synchronized in real-time.
              </p>
              
              {/* Quick Actions inside the Bento Card */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-indigo-200/45 mt-2">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  Open Chat
                </button>
                <a
                  href={`${apiUrl}/api/docs/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 hover:bg-white text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1"
                >
                  <span>API Docs</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href={`${apiUrl}/api/help/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/80 hover:bg-white text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1"
                >
                  <span>Help</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Feature Content Grid */}
      <main className="flex-grow">
        
        {/* Module 1: Destination Explorer */}
        <DestinationExplorer onSelectDestination={handleSelectDestinationForPlanning} />

        {/* Module 2: Itinerary Builder */}
        <ItineraryPlanner preselectedDestination={selectedDestination} />

        {/* Module 3: Packing Gear Checker */}
        <PackingList />

        {/* Module 4: Budget Calculator */}
        <BudgetCalculator />

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-850">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-600 text-white p-2 rounded-xl">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="font-display font-extrabold text-base text-white tracking-tight">Voyage Guide</span>
              <span className="text-[9px] text-slate-400 font-bold block font-mono">Precision One-Page Travel Planner</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-right font-medium">
            &copy; {new Date().getFullYear()} Voyage Guide. Clean, modern, client-first interfaces. Built with React, Tailwind, and Lucide Icons.
          </p>
        </div>
      </footer>

      {/* Floating Travel AI Chat Assistant */}
      <TravelChat
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        sessionId={sessionId}
        setSessionId={setSessionId}
        apiHealth={apiHealth}
        setApiHealth={setApiHealth}
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        onRefreshHealth={checkApiHealth}
      />

    </div>
  );
}
