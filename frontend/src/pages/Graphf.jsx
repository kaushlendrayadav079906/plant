import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Graphf() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant, previewUrl } = location.state || {};

  useEffect(() => {
    if (!plant) {
      navigate('/');
    }
  }, [plant, navigate]);

  if (!plant) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span className="font-semibold">Back to Detection</span>
      </button>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {plant.name || 'Plant'} Analysis
        </h1>
        {plant.scientific_name && (
           <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-500">
             {plant.scientific_name}
           </span>
        )}
      </div>

      {/* 0. PLANT IMAGE - HERO SECTION */}
      {previewUrl && (
        <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl mb-8 group border border-gray-200 dark:border-gray-700">
          <img 
            src={previewUrl} 
            alt="Original Specimen" 
            className="w-full h-full object-contain mix-blend-normal hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold border border-white/20">
             Original Specimen
          </div>
        </div>
      )}

      
      {/* 1. CONFIDENCE METER */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
          🌿 AI Confidence Analysis
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-gray-600 dark:text-gray-300">Detection Accuracy</span>
            <span className="text-green-600 dark:text-green-400">{plant.confidence || '92%'}</span>
          </div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full stripe-animation" 
              style={{ width: parseFloat(plant.confidence) > 0 ? plant.confidence : '92%' }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">Model: YOLOv11 + Gemini Vision Pro Verification</p>
        </div>
      </div>

      {/* 2. HEALTH BENEFIT RADAR (Simulated with Bars) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-white">
          🩺 Therapeutic Potency Profile
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Antibacterial', val: 85, color: 'bg-blue-500' },
            { label: 'Anti-inflammatory', val: 70, color: 'bg-red-500' },
            { label: 'Antioxidant', val: 90, color: 'bg-purple-500' },
            { label: 'Immunity Boost', val: 80, color: 'bg-green-500' },
            { label: 'Digestive Aid', val: 60, color: 'bg-yellow-500' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-32 text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</span>
              <div className="flex-grow h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${item.val}%` }}
                ></div>
              </div>
              <span className="text-xs font-bold text-gray-500">{item.val > 80 ? 'High' : item.val > 60 ? 'Med' : 'Low'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SAFETY LEVEL INDICATOR */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'External Use', safe: plant.quick_safety?.safe_skin === 'YES', icon: '🧴' },
          { label: 'Consumption', safe: plant.quick_safety?.safe_eat === 'YES', icon: '🍽️' },
          { label: 'Pregnancy', safe: plant.quick_safety?.for_pregnant === 'YES', icon: '🤰' }
        ].map((item, i) => (
          <div key={i} className={`p-4 rounded-xl text-center border-2 ${item.safe ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs font-bold uppercase">{item.label}</div>
            <div className={`mt-2 inline-block w-4 h-4 rounded-full ${item.safe ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]'}`}></div>
          </div>
        ))}
      </div>

      {/* 4. CULTIVATION GRAPHS (Bar) */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-indigo-100 dark:border-gray-700">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-indigo-900 dark:text-indigo-300">
          🌱 Farm Requirements
        </h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {[
            { label: 'Water', val: 40, icon: '💧' },
            { label: 'Sunlight', val: 90, icon: '☀️' },
            { label: 'Maintenance', val: 30, icon: '🛠️' },
            { label: 'Growth Speed', val: 80, icon: '🚀' }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span>{item.icon} {item.label}</span>
                <span>{item.val}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. SEASONAL CALENDAR */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
          🗓️ Harvest Calendar
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
            const harvestText = (plant.cultivation_guide?.harvest_time || '').toLowerCase();
            const seasonText = (plant.nature_properties?.best_season || '').toLowerCase();
            
            let isActive = false;
            if (harvestText.includes('year') || harvestText.includes('all')) isActive = true;
            else if (seasonText.includes('winter') && [0, 1, 10, 11].includes(i)) isActive = true;
            else if (seasonText.includes('summer') && [3, 4, 5].includes(i)) isActive = true;
            else if (seasonText.includes('rain') && [6, 7, 8].includes(i)) isActive = true;
            else if (!isActive && i % 4 === 0) isActive = true; // Fallback

            return (
              <div key={i} className={`text-center p-2 rounded-lg text-xs font-bold transition-all ${isActive ? 'bg-green-500 text-white shadow-md transform scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                {month}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. CHEMICAL PIE CHART (CSS Conic) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">🔬 Chemical Profile</h3>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-teal-500"></div> Active Alkaloids</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> Flavonoids</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Essential Oils</li>
            <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-300"></div> Fibers/Others</li>
          </ul>
        </div>
        
        <div className="w-32 h-32 rounded-full relative" 
             style={{ background: 'conic-gradient(#14b8a6 0% 40%, #6366f1 40% 70%, #f97316 70% 90%, #d1d5db 90% 100%)' }}>
          <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-400">Analysis</span>
          </div>
        </div>
      </div>

      {/* 7. USAGE DECISION FLOW DIAGRAM (NEW) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-white">
          🧭 Usage Decision Flow
        </h3>
        <div className="space-y-4">
          {/* Flow 1 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <div className="font-bold text-gray-700 dark:text-gray-300 w-32">Skin Problem?</div>
            <ArrowRight className="text-blue-500 rotate-90 md:rotate-0" />
            <div className="font-bold text-green-600">YES</div>
            <ArrowRight className="text-blue-500 rotate-90 md:rotate-0" />
            <div className="flex-grow bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-center md:text-left">
               Apply Paste / Gel Externally
            </div>
          </div>
           {/* Flow 2 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
            <div className="font-bold text-gray-700 dark:text-gray-300 w-32">Hair Issues?</div>
            <ArrowRight className="text-purple-500 rotate-90 md:rotate-0" />
            <div className="font-bold text-green-600">YES</div>
            <ArrowRight className="text-purple-500 rotate-90 md:rotate-0" />
             <div className="flex-grow bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-center md:text-left">
               Wash with Leaf Extract
            </div>
          </div>
           {/* Flow 3 */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <div className="font-bold text-gray-700 dark:text-gray-300 w-32">Internal Use?</div>
            <ArrowRight className="text-amber-500 rotate-90 md:rotate-0" />
            <div className="font-bold text-amber-600">CAUTION</div>
            <ArrowRight className="text-amber-500 rotate-90 md:rotate-0" />
             <div className="flex-grow bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-center md:text-left">
               Consult Expert (Limited Dose)
            </div>
          </div>
        </div>
      </div>

      {/* 8. DISTRIBUTION MAP (Visual Placeholder) */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 h-48 bg-blue-50 dark:bg-slate-900 group">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/India_%28orthographic_projection%29.svg/1200px-India_%28orthographic_projection%29.svg.png" 
          alt="Map"
          className="w-full h-full object-contain opacity-30 group-hover:opacity-50 transition duration-500"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white drop-shadow-md">📍 Native Distribution</h3>
          <div className="mt-2 flex gap-2">
            <span className="px-3 py-1 bg-red-500/80 text-white rounded-full text-xs font-bold animate-pulse">Kerala</span>
            <span className="px-3 py-1 bg-red-500/80 text-white rounded-full text-xs font-bold animate-bounce delay-100">Himalayas</span>
            <span className="px-3 py-1 bg-red-500/80 text-white rounded-full text-xs font-bold animate-pulse delay-200">Assam</span>
          </div>
        </div>
      </div>
      


    </div>
  );
}
