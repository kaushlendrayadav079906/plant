import axios from 'axios';
import { Bot, Image as ImageIcon, Loader2, Upload, User, X } from 'lucide-react';
// --- THIS IS THE FIX ---
// We must import 'React' itself, not just the hooks.
import React, { useRef, useState } from 'react';

// --- Loading Components ---
const Spinner = () => (
  <Loader2 className="animate-spin h-5 w-5 mr-3" />
);

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
  </div>
);

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('detect'); // 'detect' or 'chat'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // --- Detection State ---
  const [detectionResult, setDetectionResult] = useState(null); // Will hold { annotated_image, plant_data }

  // --- Chat State ---
  const [chatPlantName, setChatPlantName] = useState('your plant'); // Plant context for chat
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // --- THIS IS THE FIX ---
  const [isDark, setIsDark] = useState(false); // You were missing this line

  const fileInputRef = useRef(null);

  // --- API URL ---
  // This is the address of your Python backend
  const API_URL = 'http://localhost:8000'; 

  // --- File Handling ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      clearResults(); // Clear old results when a new file is up
    }
  };

  const clearResults = () => {
    setDetectionResult(null);
    setError(null);
    setChatMessages([]);
    setChatPlantName('your plant');
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    clearResults();
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset the file input
    }
  };

  // --- Detection API Call ---
  const handleSubmitDetection = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setDetectionResult(null);

    // We use FormData to send a file
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Make the API call to our /predict endpoint
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setDetectionResult(response.data);
      
      // Set plant name for chat context
      if (response.data.plant_data && response.data.plant_data.length > 0 && !response.data.plant_data[0].error) {
        const plantName = response.data.plant_data[0].name || 'your plant';
        setChatPlantName(plantName);
        // Pre-populate chat with a welcome message
        setChatMessages([
          { sender: 'bot', text: `I've identified ${plantName}. Feel free to ask me any questions about it!` }
        ]);
      } else {
        setChatMessages([
          { sender: 'bot', text: "I couldn't detect a specific plant, but you can still ask general questions." }
        ]);
      }
      
    } catch (err) {
      console.error(err);
      setError('An error occurred during detection. Is the backend server running?');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Chat API Call ---
  const handleSubmitChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Make the API call to our /chat endpoint
      const response = await axios.post(`${API_URL}/chat`, {
        plant_name: chatPlantName,
        message: chatInput,
      });

      const botMessage = { sender: 'bot', text: response.data.response || response.data.error };
      setChatMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error(err);
      const errorMessage = { sender: 'bot', text: 'Sorry, I ran into an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };


  // --- Render the UI ---
  return (
    // This div controls the dark mode
    <div className={isDark ? 'dark' : ''}>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 transition-colors duration-300">
        
        {/* --- Header --- */}
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
              🌿 Medicinal Plant Recognition
            </h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
          </div>
        </header>

        {/* --- Main Content (2-column layout on large screens) --- */}
        <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- Left Column (Input) --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col h-full">
            <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">1. Upload Your Image</h2>
            
            {/* File Input Area */}
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-400 dark:hover:border-green-500 transition-colors"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="max-h-60 rounded-lg object-contain" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent re-opening file dialog
                      clearSelection();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-all"
                    aria-label="Clear selection"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                  <span className="font-medium text-gray-600 dark:text-gray-300">Click to upload an image</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, or WEBP</span>
                </>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmitDetection}
              disabled={!selectedFile || isLoading}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg mt-6 flex items-center justify-center transition-all
                      hover:bg-green-700 
                      disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner /> : 'Detect Plant'}
            </button>
          </div>

          {/* --- Right Column (Output) --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col h-full">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                onClick={() => setActiveTab('detect')}
                className={`py-2 px-4 font-medium transition-all ${
                  activeTab === 'detect' 
                  ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Detection Result
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-4 font-medium transition-all ${
                  activeTab === 'chat' 
                  ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Ask Gemini
              </button>
            </div>

            {/* --- Tab Content --- */}
            <div className="flex-grow flex flex-col min-h-[400px]">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:text-red-200 dark:border-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {/* --- Detection Tab --- */}
              {activeTab === 'detect' && (
                <div className="flex flex-col h-full">
                  {!detectionResult && !isLoading && !error && (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-center">
                      <ImageIcon size={64} className="mb-4" />
                      <h3 className="text-xl font-medium">Your results will appear here</h3>
                      <p>Upload an image and click "Detect Plant" to begin.</p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex-grow flex items-center justify-center">
                      <SkeletonLoader />
                    </div>
                  )}
                  
                  {detectionResult && (
                    <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                      {/* Annotated Image */}
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">Annotated Image</h3>
                        <img 
                          src={`data:image/jpeg;base64,${detectionResult.annotated_image}`} 
                          alt="Detected Plant" 
                          className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full"
                        />
                      </div>

                      {/* Plant Info */}
                      <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">Plant Information</h3>
                      {detectionResult.plant_data.map((plant, index) => (
                        <div key={index} className="bg-green-50 dark:bg-gray-700 border border-green-200 dark:border-gray-600 p-4 rounded-lg">
                          <h4 className="text-lg font-bold text-green-800 dark:text-green-300">{plant.name}</h4>
                          {plant.error ? (
                            <p className="text-red-600 dark:text-red-400">{plant.error}</p>
                          ) : (
                            <ul className="text-sm space-y-1 mt-2 text-gray-700 dark:text-gray-300">
                              <li><strong>Scientific Name:</strong> {plant.scientific_name}</li>
                              <li><strong>Common Name:</strong> {plant.common_name}</li>
                              <li><strong>Local Name:</strong> {plant.local_name}</li>
                              <li><strong>Family:</strong> {plant.family_name}</li>
                              <li><strong>Medicinal Uses:</strong> {plant.medicinal_uses}</li>
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- Chat Tab --- */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-full">
                  {/* Chat History */}
                  <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4 mb-4 min-h-[400px]">
                    {chatMessages.length === 0 && (
                      <div className="flex-grow flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-center h-full">
                        <Bot size={64} className="mb-4" />
                        <h3 className="text-xl font-medium">Chat with the Botanist AI</h3>
                        <p>First, detect a plant. Then, ask questions about it here!</p>
                      </div>
                    )}
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-2 max-w-xs md:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`flex-shrink-0 p-2 rounded-full ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-green-600 text-white'}`}>
                            {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                          </div>
                          <div className={`px-4 py-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-gray-800 dark:bg-blue-800 dark:text-gray-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'}`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2 max-w-xs md:max-w-md">
                          <div className="flex-shrink-0 p-2 rounded-full bg-green-600 text-white">
                            <Bot size={20} />
                          </div>
                          <div className="px-4 py-3 rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <form onSubmit={handleSubmitChat} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      // --- THIS IS THE SECOND FIX ---
                      // It was 'e.T.value', it's now 'e.target.value'
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Ask about ${chatPlantName}...`}
                      className="flex-grow border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading}
                      className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors
                                  disabled:bg-gray-300 dark:disabled:bg-gray-600"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


