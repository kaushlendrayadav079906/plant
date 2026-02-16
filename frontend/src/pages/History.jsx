import axios from 'axios';
import { Eye, History as HistoryIcon, Leaf, Loader2, Sprout, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history`);
      setHistory(response.data.history);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (index, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_URL}/history/${index}`);
      fetchHistory(); // Refresh
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all history?")) return;
    try {
      await axios.delete(`${API_URL}/history`);
      setHistory([]);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  const viewDetails = async (plantName) => {
    setLoadingDetails(true);
    try {
        const response = await axios.get(`${API_URL}/plant_details/${plantName}`);
        setSelectedPlant(response.data);
    } catch (err) {
        console.error("Error fetching details:", err);
        alert("Could not load details for this plant.");
    } finally {
        setLoadingDetails(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                <HistoryIcon size={24} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Search History</h1>
                <p className="text-gray-500 dark:text-gray-400">Your recent discoveries</p>
            </div>
          </div>
          {history.length > 0 && (
             <button 
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-semibold"
             >
                <Trash2 size={16} /> Clear All
             </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600">
            <Sprout className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">No history found yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Plant Name</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((item, index) => (
                  <tr 
                    key={index} 
                    onClick={() => viewDetails(item.plant_name)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm">
                          {item.plant_name[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {item.plant_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-sm">
                      {item.date}
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                                onClick={(e) => { e.stopPropagation(); viewDetails(item.plant_name); }}
                                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                                title="View Details"
                           >
                               <Eye size={18} />
                           </button>
                           <button 
                                onClick={(e) => deleteItem(index, e)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                title="Delete"
                           >
                               <Trash2 size={18} />
                           </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- DETAIL MODAL --- */}
      {selectedPlant && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
                  <button 
                     onClick={() => setSelectedPlant(null)}
                     className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                     <X size={20} />
                  </button>
                  
                  <div className="p-8">
                       <div className="flex items-center gap-4 mb-6">
                           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                               <Leaf className="w-8 h-8 text-green-600" />
                           </div>
                           <div>
                               <h2 className="text-3xl font-bold text-gray-800 dark:text-white leading-tight">
                                   {selectedPlant.name}
                               </h2>
                               <p className="text-green-600 dark:text-green-400 font-mono italic">
                                   {selectedPlant.scientific_name}
                               </p>
                           </div>
                       </div>

                       <div className="space-y-6">
                           <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                               <h3 className="font-bold text-green-800 dark:text-green-300 mb-2">🌿 Medicinal Uses</h3>
                               <p className="text-gray-700 dark:text-gray-300">{selectedPlant.medicinal_uses}</p>
                           </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                   <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Family</h4>
                                   <p className="text-gray-600 dark:text-gray-400">{selectedPlant.family_name}</p>
                               </div>
                               <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                   <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Native Region</h4>
                                   <p className="text-gray-600 dark:text-gray-400">{selectedPlant.native_location}</p>
                               </div>
                           </div>

                           <div>
                               <h3 className="font-bold text-gray-800 dark:text-white mb-2">💊 Diseases Cured</h3>
                               <div className="flex flex-wrap gap-2">
                                   {selectedPlant.diseases_cured?.split(',').map((d, i) => (
                                       <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm">
                                           {d.trim()}
                                       </span>
                                   ))}
                               </div>
                           </div>
                           
                           <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-l-4 border-yellow-400">
                               <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-1">⚠️ Safety & Toxicity</h3>
                               <p className="text-gray-700 dark:text-gray-300 text-sm">
                                   {selectedPlant.toxicity_warning}
                               </p>
                           </div>
                       </div>
                  </div>
              </div>
          </div>
      )}
      
      {loadingDetails && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
               <div className="bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                   <Loader2 className="animate-spin text-green-600" />
                   <span className="font-medium">Loading details...</span>
               </div>
          </div>
      )}
    </div>
  );
}
