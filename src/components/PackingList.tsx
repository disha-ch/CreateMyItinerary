import React, { useState, useEffect } from 'react';
import { PackingItem } from '../types';
import { Plus, Trash2, CheckSquare, Square, Backpack, Sparkles, Check, RefreshCw } from 'lucide-react';

export default function PackingList() {
  const [packType, setPackType] = useState<'Beach' | 'Hiking' | 'Winter' | 'City'>('City');
  const [items, setItems] = useState<PackingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingItem['category']>('Essentials');

  const defaultPresets: Record<'Beach' | 'Hiking' | 'Winter' | 'City', PackingItem[]> = {
    City: [
      { id: '1', name: 'Passport & Visa copies', category: 'Essentials', checked: true },
      { id: '2', name: 'Credit card & Local currency', category: 'Essentials', checked: true },
      { id: '3', name: 'Comfortable walking sneakers', category: 'Clothing', checked: false },
      { id: '4', name: 'Versatile shirts & layers', category: 'Clothing', checked: false },
      { id: '5', name: 'Smartphone & Charger cables', category: 'Electronics', checked: true },
      { id: '6', name: 'Universal power adapter', category: 'Electronics', checked: false },
      { id: '7', name: 'Travel-size toothbrush & paste', category: 'Toiletries', checked: false },
      { id: '8', name: 'Hand sanitizer & Face masks', category: 'Toiletries', checked: false }
    ],
    Beach: [
      { id: 'b1', name: 'Passport & Travel Insurance', category: 'Essentials', checked: true },
      { id: 'b2', name: 'Swimsuit & Board shorts', category: 'Clothing', checked: false },
      { id: 'b3', name: 'Sunglasses & Sunhat', category: 'Clothing', checked: false },
      { id: 'b4', name: 'Microfiber quick-dry beach towel', category: 'Other', checked: false },
      { id: 'b5', name: 'Waterproof phone pouch', category: 'Electronics', checked: false },
      { id: 'b6', name: 'Reef-safe sunscreen SPF 50', category: 'Toiletries', checked: false },
      { id: 'b7', name: 'Flip flops & beach slides', category: 'Clothing', checked: false },
      { id: 'b8', name: 'After-sun Aloe Vera gel', category: 'Toiletries', checked: false }
    ],
    Hiking: [
      { id: 'h1', name: 'Trail maps & Offline GPS apps', category: 'Essentials', checked: true },
      { id: 'h2', name: 'First Aid emergency kit', category: 'Essentials', checked: true },
      { id: 'h3', name: 'Waterproof trail boots', category: 'Clothing', checked: false },
      { id: 'h4', name: 'Moisture-wicking active shirts', category: 'Clothing', checked: false },
      { id: 'h5', name: 'Portable battery bank (Rugged)', category: 'Electronics', checked: false },
      { id: 'h6', name: 'Headlamp with extra batteries', category: 'Electronics', checked: false },
      { id: 'h7', name: 'Biodegradable soap & wipes', category: 'Toiletries', checked: false },
      { id: 'h8', name: 'Insect repellent (Deet-free)', category: 'Toiletries', checked: false },
      { id: 'h9', name: 'Reusable water flask & filter straw', category: 'Other', checked: false }
    ],
    Winter: [
      { id: 'w1', name: 'Passport, Tickets & Ski pass', category: 'Essentials', checked: true },
      { id: 'w2', name: 'Heavy insulated parkas', category: 'Clothing', checked: false },
      { id: 'w3', name: 'Thermal base layer pants & tops', category: 'Clothing', checked: false },
      { id: 'w4', name: 'Touchscreen-compatible gloves', category: 'Clothing', checked: false },
      { id: 'w5', name: 'Beanie hat & fleece neck gaiter', category: 'Clothing', checked: false },
      { id: 'w6', name: 'Lip balm & wind-chill cream', category: 'Toiletries', checked: false },
      { id: 'w7', name: 'Reusable pocket hand warmers', category: 'Other', checked: false },
      { id: 'w8', name: 'GoPro or action-camera', category: 'Electronics', checked: false }
    ]
  };

  // Seed default presets when pack type changes
  useEffect(() => {
    setItems(defaultPresets[packType]);
  }, [packType]);

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `custom-pack-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      checked: false,
      isCustom: true
    };

    setItems(prev => [...prev, newItem]);
    setNewItemName('');
  };

  const handleReset = () => {
    setItems(defaultPresets[packType]);
  };

  // Group items by category
  const categories: PackingItem['category'][] = ['Essentials', 'Clothing', 'Electronics', 'Toiletries', 'Other'];
  
  const packedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const readyPercent = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  return (
    <div id="packing-checklist" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 px-3 py-1 rounded-full text-brand-700 text-xs font-bold mb-3">
          <Backpack className="w-3.5 h-3.5" />
          <span>Interactive Pack List</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-slate-900 mb-4">
          Smart Travel Packing Companion
        </h2>
        <p className="text-lg text-slate-600">
          Pick your terrain, load pre-tested checklists, track your luggage weight, and customize your gear loadout dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Presets and Status Card (Left) */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h4 className="text-slate-400 text-[10px] uppercase font-black mb-3 tracking-widest">
              1. Select Travel Vibe
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {(['City', 'Beach', 'Hiking', 'Winter'] as const).map(type => (
                <button
                  id={`pack-preset-${type.toLowerCase()}`}
                  key={type}
                  onClick={() => setPackType(type)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                    packType === type
                      ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {type === 'City' ? '🏙️ City Travel' : type === 'Beach' ? '🏖️ Beach Holiday' : type === 'Hiking' ? '🏔️ Wilderness' : '❄️ Winter Alpine'}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-slate-400 text-[10px] uppercase font-black mb-3 tracking-widest">
              2. Baggage Progress
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-bold text-slate-700">Ready Status</span>
                <span className="text-lg font-bold font-mono text-brand-600">{readyPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${readyPercent === 100 ? 'bg-emerald-500' : 'bg-brand-500'}`}
                  style={{ width: `${readyPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2.5">
                <span>{packedCount} items in bag</span>
                <span>{totalCount - packedCount} left</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
            <div className="text-xs text-slate-400 font-medium">
              Restore default values?
            </div>
            <button
              id="reset-packing-btn"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 border border-slate-200 hover:border-brand-100 rounded-lg px-2.5 py-1.5 transition-colors bg-white cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset list</span>
            </button>
          </div>
        </div>

        {/* Dynamic Items List (Right) */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-200 p-6 sm:p-8 shadow-sm">
          {/* Quick Add Custom Item Form */}
          <form onSubmit={handleAddItem} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 flex flex-col sm:flex-row gap-3 items-end sm:items-center">
            <div className="w-full sm:flex-1">
              <label htmlFor="custom-item-name" className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">
                New Custom Item Name
              </label>
              <input
                id="custom-item-name"
                type="text"
                placeholder="e.g. Swimming goggles, Travel pillow..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-xs font-medium bg-white"
              />
            </div>
            <div className="w-full sm:w-44">
              <label htmlFor="custom-item-category" className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">
                Category
              </label>
              <select
                id="custom-item-category"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as PackingItem['category'])}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 text-xs font-medium bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button
              id="add-packing-item-btn"
              type="submit"
              className="w-full sm:w-auto text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 bg-brand-600 hover:bg-brand-700 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Gear</span>
            </button>
          </form>

          {/* Grouped Lists */}
          <div className="space-y-6">
            {categories.map(cat => {
              const catItems = items.filter(i => i.category === cat);
              if (catItems.length === 0) return null;
              
              return (
                <div key={cat} className="space-y-2">
                  <h5 className="text-slate-400 text-[10px] uppercase font-black tracking-widest pl-1">
                    {cat}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {catItems.map(item => (
                      <div
                        id={`packing-item-${item.id}`}
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          item.checked
                            ? 'bg-slate-50 border-slate-200 opacity-70 text-slate-400'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <button
                          id={`toggle-pack-${item.id}`}
                          onClick={() => toggleItem(item.id)}
                          className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                        >
                          {item.checked ? (
                            <span className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-md border border-slate-300 hover:border-brand-500 flex items-center justify-center shrink-0" />
                          )}
                          <span className={`text-xs font-semibold ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.name}
                          </span>
                          {item.isCustom && (
                            <span className="text-[9px] bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded font-mono font-bold">
                              Custom
                            </span>
                          )}
                        </button>
                        <button
                          id={`delete-pack-${item.id}`}
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Remove gear"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
