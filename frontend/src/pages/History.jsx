import axios from 'axios';
import { AlertTriangle, History as HistoryIcon, Loader2, Sprout } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:8000';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
            <HistoryIcon size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Search History</h1>
            <p className="text-gray-500 dark:text-gray-400">Recent plant identifications</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600">
            <Sprout className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-500 dark:text-gray-400">No history found yet.</p>
            <p className="text-sm text-gray-400">Start by identifying some plants!</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Date & Time</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300">Plant Name</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-300 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 font-mono text-sm">
                      {item.date}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-sm">
                          {item.plant_name[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                          {item.plant_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                       <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                         Identified
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
