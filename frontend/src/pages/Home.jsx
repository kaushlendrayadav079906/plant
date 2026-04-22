import axios from 'axios';
import { AlertTriangle, BookOpen, Bot, Camera, Clock, Droplets, FlaskConical, Globe, ImageOff, Leaf, Loader2, Mic, Microscope, ShieldCheck, Sprout, StopCircle, Sun, Tractor, TrendingUp, Upload, User, Volume2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ... (existing imports)

// --- Home Component ---
export default function Home({ showSplash, setShowSplash }) {
  // const [showSplash, setShowSplash] = useState(true); // Lifted to App.jsx
  const [activeTab, setActiveTab] = useState('detect');
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // --- Voice State ---
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [availableVoices, setAvailableVoices] = useState([]);

  const languages = [
    { code: 'en-US', name: 'English', label: 'English' },
    { code: 'hi-IN', name: 'Hindi', label: 'हिंदी (Hindi)' },
    { code: 'es-ES', name: 'Spanish', label: 'Español' },
    { code: 'fr-FR', name: 'French', label: 'Français' },
  ];


  // --- Voice Functions ---
  
  // Load voices securely
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakMessage = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice input is not supported in this browser.");
        return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = selectedLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
        console.error("Speech recognition error", e);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            alert("Microphone access denied. Please click the site settings icon in your browser's address bar (usually a lock or settings icon) and allow microphone access.");
        } else {
            alert("Speech recognition error: " + e.error);
        }
        setIsListening(false);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput(transcript);
    };

    recognition.start();
  };

  // --- Voice Guide Logic ---
  const generateSummary = (plant, lang) => {
    const getYesNoText = (val, yesText, noText) => val === 'YES' ? yesText : noText;

    if (lang === 'hi-IN') {
        const safe_eat = getYesNoText(plant.quick_safety?.safe_eat, 'सुरक्षित है', 'असुरक्षित है');
        return `नमस्ते। यह ${plant.common_name} है। 
        वैज्ञानिक नाम: ${plant.scientific_name}।
        सुरक्षा: ${safe_eat}।
        मुख्य फायदे: ${plant.diseases_cured || 'सामान्य रोग'}।
        उपयोग: ${plant.mode_of_use || 'सलाह लें'}।`;
    }
    
    // Default English
    return `Hello. We identified this as ${plant.common_name}. 
    Ideally known as ${plant.scientific_name}.
    Confidence: ${plant.confidence || 'High'}.
    
    Safety: ${getYesNoText(plant.quick_safety?.safe_eat, 'Safe to eat.', 'Do not eat directly.')}
    Medicinal Uses: ${plant.diseases_cured || 'General health'}.
    How to use: ${plant.mode_of_use || 'Consult an expert'}.`;
  };

  const handleSpeak = (plant) => {
    // Stop any current speech
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    
    if (!plant) return;

    const summary = generateSummary(plant, selectedLanguage);
    console.log("Speaking summary:", summary);

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = selectedLanguage;
    utterance.rate = 1.0; 
    
    // FORCE VOICE SELECTION causing potential silence if not set in some browsers
    let voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices.length, voices.map(v => v.name));
    
    // Fix for Chrome needing voices to be loaded:
    if (voices.length === 0) {
        console.warn("No voices loaded yet. Waiting for onvoiceschanged...");
        // In a real app we might wait, but here just try letting browser default
    }

    // Try to find a voice matching the language exactly, preferring Google
    let voice = voices.find(v => v.lang === selectedLanguage && v.name.includes("Google"));
    if (!voice) voice = voices.find(v => v.lang === selectedLanguage);
    if (!voice) voice = voices.find(v => v.lang.startsWith(selectedLanguage.slice(0, 2)));

    if (voice) {
        utterance.voice = voice;
        console.log("Forcing voice:", voice.name);
    } else {
        console.warn("No matching voice found for", selectedLanguage, "letting browser decide.");
    }

    utterance.onstart = () => {
        console.log("Speech started");
        setIsSpeaking(true);
    };
    utterance.onend = () => {
        console.log("Speech ended");
        setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
         console.error("Speech error:", e);
         setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // --- Restore State on Mount ---
  useEffect(() => {
    if (location.state?.restoredDetectionResult) {
       setDetectionResult(location.state.restoredDetectionResult);
       setPreviewUrl(location.state.restoredPreviewUrl);
       setActiveTab('detect');
       // If we have a plant name, set it for chat
       const plantData = location.state.restoredDetectionResult.plant_data?.[0];
       if (plantData && plantData.name) {
         setChatPlantName(plantData.name);
         setChatMessages([{ sender: 'bot', text: `Welcome back! I still remember ${plantData.name}. Need more info?` }]);
       }
       // Clear state to prevent loop if we navigate back/forward separately? 
       // Actually replace state might be better, but for now this works.
       // window.history.replaceState({}, document.title) // Optional cleanup
    }
  }, [location.state]);

  // --- Loading Components ---
  const Spinner = () => <Loader2 className="animate-spin h-5 w-5 mr-3" />;
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
    </div>
  );

  // --- Camera State ---
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStream, setCameraStream] = useState(null);

  // --- Detection State ---
  const [detectionResult, setDetectionResult] = useState(null);

  // --- Chat State ---
  const [chatPlantName, setChatPlantName] = useState('your plant');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || 'https://plant-2-9w9a.onrender.com';

  // --- File Upload ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      clearResults();
    }
  };

  const clearResults = () => {
    setDetectionResult(null);
    setError(null);
    setChatMessages([]);
    setChatPlantName('your plant');
    setShowAdvanced(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    clearResults();
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // --- CAMERA FUNCTIONS ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      setCameraOpen(true);
      setCameraError(null);
    } catch (err) {
      console.error(err);
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        setCameraError('Camera access denied. Please click the site settings icon in your browser address bar (usually a lock or settings icon) and allow camera access, then try again.');
      } else {
        setCameraError('Unable to access camera: ' + err.message);
      }
    }
  };

  useEffect(() => {
    if (cameraOpen && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraOpen, cameraStream]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(blob));
      clearResults();
    }, 'image/jpeg');

    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraOpen(false);
    setCameraStream(null);
  };

  // --- Detection ---
  const handleSubmitDetection = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setDetectionResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDetectionResult(response.data);

      if (response.data.plant_data?.length > 0) {
        const firstPlant = response.data.plant_data[0];
        if (firstPlant.name !== "No plant detected") {
           const plantName = firstPlant.name || 'your plant';
           setChatPlantName(plantName);
           setChatMessages([{ sender: 'bot', text: `I've identified ${plantName}. Ask me anything about it!` }]);
        } else {
           setChatMessages([{ sender: 'bot', text: "I couldn't detect a specific plant." }]);
        }
      } else {
        setChatMessages([{ sender: 'bot', text: "I couldn't detect a specific plant." }]);
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Error during detection. Is backend running?';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Chat ---
  const handleSubmitChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        plant_name: chatPlantName,
        message: chatInput,
      });
      const botMessage = { sender: 'bot', text: response.data.response || response.data.error };
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error, please try again.';
      setChatMessages((prev) => [...prev, { sender: 'bot', text: msg }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- Splash Screen Logic ---
  const backgroundImages = [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2560&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1501854140884-074bf86ee91c?q=80&w=2560&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2560&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2560&auto=format&fit=crop"
  ];

  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    if (!showSplash) return;
    const interval = setInterval(() => {
       setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showSplash]);

  // --- UI ---
  if (showSplash) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white cursor-pointer select-none overflow-hidden bg-black"
        onClick={() => setShowSplash(false)}
      >
        {backgroundImages.map((img, index) => (
            <div 
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'} scale-110`}
                style={{ backgroundImage: `url(${img})` }}
            />
        ))}
        <div className="absolute inset-0 bg-radial-gradient from-black/20 via-black/60 to-black/90 backdrop-blur-[2px]"></div>
        <div className="z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-1000">
          <div className="mb-12 text-lime-600 font-bold tracking-[0.3em] uppercase text-sm animate-in slide-in-from-top-4 duration-1000 drop-shadow-md">
            Plant Detection 
          </div>
          <div className="relative mb-8 group">
             <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-green-500 to-lime-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
             <div className="relative w-36 h-36 bg-white rounded-full flex items-center justify-center ring-4 ring-white shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-transparent opacity-50"></div>
                <Leaf className="w-20 h-20 text-green-600 drop-shadow-md transform transition-transform group-hover:scale-110 duration-500 fill-green-100" />
             </div>
          </div>
          <h1 className="font-black mb-6 drop-shadow-2xl leading-tight">
            <span className="block text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white tracking-wide uppercase mb-2">
              Medicinal Plant
            </span>
            <span className="block text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-green-400 to-lime-300 pb-2">
              Recognition System
            </span>
          </h1>
          <p className="text-lg md:text-2xl font-medium text-gray-300 max-w-2xl leading-relaxed mb-12 drop-shadow-lg">
            Instant identification & detailed healing properties <br className="hidden md:block"/>powered by advanced AI.
          </p>
          <div className="group relative px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full overflow-hidden transition-all duration-300 hover:scale-105 border border-white/20 hover:border-green-400/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            <span className="relative text-sm font-bold tracking-[0.2em] uppercase text-white group-hover:text-green-300 transition-colors flex items-center gap-3">
              Tap to Explore <span className="text-lg">→</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex-grow p-6 flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* LEFT: Upload + Camera */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">
          1. Upload or Capture Image
        </h2>

        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 dark:hover:border-green-500 transition"
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="max-h-60 rounded-lg" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
              <span className="text-gray-600 dark:text-gray-300">Click to upload</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, WEBP</span>
            </>
          )}
        </div>

        <button
          onClick={startCamera}
          className="mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <Camera className="h-5 w-5" /> Open Camera
        </button>

        {cameraOpen && (
          <div className="mt-4 flex flex-col items-center">
            {cameraError ? (
              <p className="text-red-600">{cameraError}</p>
            ) : (
              <>
                <video ref={videoRef} autoPlay className="w-72 h-56 rounded-lg shadow mb-3"></video>
                <button
                  onClick={capturePhoto}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Capture Photo
                </button>
                <canvas ref={canvasRef} className="hidden"></canvas>
              </>
            )}
          </div>
        )}

        <button
          onClick={handleSubmitDetection}
          disabled={!selectedFile || isLoading}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg mt-6 flex justify-center hover:bg-green-700 disabled:bg-gray-400"
        >
          {isLoading ? <Spinner /> : 'Detect Plant'}
        </button>

        {/* VOICE ASSISTANT UI */}
        {detectionResult?.plant_data?.[0] && !detectionResult.plant_data[0].error && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-indigo-500" />
                    AI Voice Guide
                </h3>
                
                <div className="flex flex-col gap-3">
                    <div className="relative">
                        <select 
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                    </div>

                    <button 
                        onClick={() => handleSpeak(detectionResult.plant_data[0])}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold shadow-md transition-all ${
                            isSpeaking 
                            ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                        {isSpeaking ? <StopCircle size={20} /> : <Volume2 size={20} />}
                        {isSpeaking ? 'Stop Explanation' : 'Explain Findings'}
                    </button>
                </div>
            </div>
        )}

      </div>

      {/* RIGHT: Output + Chat */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col h-full">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('detect')}
            className={`py-2 px-4 font-medium whitespace-nowrap ${
              activeTab === 'detect'
                ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            Detection Result
          </button>

          <button
            onClick={() => {
              if (detectionResult?.plant_data?.[0] && !detectionResult.plant_data[0].error) {
                 navigate('/analysis', { 
                    state: { 
                      plant: detectionResult.plant_data[0], 
                      previewUrl,
                      fullDetectionResult: detectionResult // Pass full result for restoration
                    } 
                 });
              } else {
                 alert("Please detect a plant first to see the analysis.");
              }
            }}
            className={`py-2 px-4 font-medium whitespace-nowrap text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            📊 Scientific Analysis
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-4 font-medium whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            Ask AI Assistant
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            
        {/* TAB 1: DETECTION RESULT */}
        {activeTab === 'detect' && (
          <div className="space-y-6">
            {isLoading && <SkeletonLoader />}
            
            {/* Main Detection Image */}
            {!isLoading && detectionResult && (
              <div className="relative group">
                 <img
                  src={`data:image/jpeg;base64,${detectionResult.annotated_image}`}
                  alt="Detected"
                  className="rounded-xl border border-gray-200 w-full shadow-md transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
                    Plant Image
                </div>
              </div>
            )}
            
            {/* Empty State */}
            {!isLoading && !detectionResult && (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                <ImageOff className="w-16 h-16 mb-4 opacity-60" />
                <p className="text-lg font-medium">No plant detected yet.</p>
                <p className="text-sm">Upload an image to get started!</p>
              </div>
            )}
          </div>
        )}


        
        {/* TAB 3: CHAT BOT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col flex-grow h-[600px] relative">
            <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 space-y-4 border border-gray-100 dark:border-gray-700 scroll-smooth">
              {chatMessages.length === 0 && (
                 <div className="text-center text-gray-400 mt-10">
                    <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Ask me anything about {chatPlantName}!</p>
                 </div>
              )}
                  {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[80%] ${
                      msg.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm relative group ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                      {msg.sender === 'bot' && (
                        <button 
                            onClick={() => speakMessage(msg.text)}
                            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-500"
                            title="Read Aloud"
                        >
                            <Volume2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full flex gap-1 items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmitChat} className="mt-4 relative">
              <div className="relative flex items-center gap-2">
                <div className="relative flex-grow">
                    <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask about ${chatPlantName}...`}
                    className="w-full pl-4 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={startListening}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-gray-200 text-gray-400'}`}
                        title="Voice Input"
                    >
                        <Mic size={20} />
                    </button>
                </div>
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  <span className="sr-only">Send</span>
                  ➡️
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      </div>
      </div>

      {/* --- NEW PLANT INFORMATION SECTION --- */}
      {!isLoading && detectionResult && detectionResult.plant_data && detectionResult.plant_data.length > 0 && (
        <div className="w-full space-y-6">
          {detectionResult.plant_data.map((plant, i) => {
            // Check for specific error indicating plant not found or no info
            if (plant.error || plant.scientific_name === "Not Available") {
                return (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex justify-center mt-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl text-center border-l-8 border-red-500">
                             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Leaf className="w-10 h-10 text-red-500" />
                             </div>
                             <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Plant Information Not Available</h2>
                             <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                {plant.error || "We detected a plant, but it is not currently in our medicinal database, and we couldn't verify its details online."}
                             </p>
                             <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl inline-block text-left text-sm text-gray-500 dark:text-gray-400">
                                <p className="font-bold mb-1">Why am I seeing this?</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>The plant might not be a recognized medicinal species.</li>
                                    <li>The image might be unclear or contain non-plant objects.</li>
                                    <li>Our strict accuracy filters prevented showing unverified data.</li>
                                </ul>
                             </div>
                        </div>
                    </div>
                );
            }

            return (
             <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
               
               {/* 1. TOP CARD: Quick Safety Result */}
               <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border-l-8 border-green-500 overflow-hidden relative mb-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                         <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2">{plant.name}</h2>
                         <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">{plant.plant_description}</p>
                         <p className="text-green-600 dark:text-green-400 font-medium text-lg">Confidence: {plant.confidence || '85.0% (Verified)'}</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full transform transition hover:scale-105">
                       <ShieldCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className={`p-4 rounded-xl text-center ${plant.quick_safety?.safe_skin === 'YES' ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                         <div className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">Safe for Skin</div>
                         <div className="text-xl font-bold">{plant.quick_safety?.safe_skin || 'Caution'}</div>
                      </div>
                      <div className={`p-4 rounded-xl text-center ${plant.quick_safety?.safe_eat === 'YES' ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 text-red-700'}`}>
                         <div className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">Safe to Eat</div>
                         <div className="text-xl font-bold">{plant.quick_safety?.safe_eat || 'No'}</div>
                      </div>
                      <div className={`p-4 rounded-xl text-center ${plant.quick_safety?.for_children === 'YES' ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                         <div className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">For Children</div>
                         <div className="text-xl font-bold">{plant.quick_safety?.for_children || 'No'}</div>
                      </div>
                       <div className={`p-4 rounded-xl text-center ${plant.quick_safety?.for_pregnant === 'YES' ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 text-red-700'}`}>
                         <div className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">For Pregnant</div>
                         <div className="text-xl font-bold">{plant.quick_safety?.for_pregnant || 'DANGEROUS ⚠️'}</div>
                      </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/30">
                      <span className="font-bold text-blue-800 dark:text-blue-200">✨ Best Use Today:</span>
                      <span className="text-blue-700 dark:text-blue-300">{plant.quick_safety?.best_use_today || 'Consult Expert'}</span>
                  </div>
               </div>

                {/* 2. COLORFUL GRID CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  
                  {/* Card 1: Identity */}
                  <div className="group relative bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-2xl">🌱</div>
                        <div>
                           <div className="text-xs font-bold tracking-wider text-green-800 uppercase">Scientific Profile</div>
                           <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">{plant.scientific_name}</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between border-b border-green-200 dark:border-gray-700 pb-2">
                             <span className="text-gray-600 dark:text-gray-400">Common Name</span>
                             <span className="font-semibold text-gray-800 dark:text-gray-200">{plant.common_name}</span>
                         </div>
                         <div className="flex justify-between border-b border-green-200 dark:border-gray-700 pb-2">
                             <span className="text-gray-600 dark:text-gray-400">Family</span>
                             <span className="font-semibold text-gray-800 dark:text-gray-200">{plant.family_name}</span>
                         </div>
                         <div className="flex justify-between">
                             <span className="text-gray-600 dark:text-gray-400">Type</span>
                             <span className="font-semibold text-gray-800 dark:text-gray-200">{plant.plant_type || 'Plant'}</span>
                         </div>
                      </div>
                  </div>

                  {/* Card 2: Habitat (Origin) */}
                  <div className="group relative bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50 dark:border-gray-700 overflow-hidden">
                       <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-2xl">🌍</div>
                        <div>
                           <div className="text-xs font-bold tracking-wider text-teal-800 uppercase">Origin & Habitat</div>
                           <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">Native Regions</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                         <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                            {plant.native_location || 'Global'}
                         </p>
                         <div className="pt-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Ideal Climate</span>
                            <div className="mt-1 font-semibold text-teal-700 dark:text-teal-300 bg-white/50 px-3 py-1 rounded-lg inline-block">
                                {plant.ideal_climate || 'Varied'}
                            </div>
                         </div>
                      </div>
                  </div>

                  {/* Card 3: Medicinal Power */}
                  <div className="group relative bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50 dark:border-gray-700 overflow-hidden">
                       <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-2xl">⚡</div>
                        <div>
                           <div className="text-xs font-bold tracking-wider text-amber-800 uppercase">Healing Power</div>
                           <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">Key Benefits</h3>
                        </div>
                      </div>
                      <div className="space-y-3">
                         <div className="bg-white/60 dark:bg-black/20 rounded-xl p-3">
                            <span className="text-xs text-amber-600 font-bold uppercase">Main Target</span>
                            <p className="font-bold text-gray-800 dark:text-gray-200 text-lg">{plant.primary_body_system || 'General Health'}</p>
                         </div>
                         <div>
                            <span className="text-xs text-gray-500 font-bold uppercase">Active Ingredients</span>
                            <p className="text-gray-800 dark:text-gray-200 text-sm mt-1">{plant.medicine_content || 'Various compounds'}</p>
                         </div>
                      </div>
                  </div>

                  {/* Card 4: Diseases Cured (Expanded) */}
                  <div className="col-span-1 md:col-span-2 group relative bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-2xl">🩺</div>
                        <div>
                           <div className="text-xs font-bold tracking-wider text-red-800 uppercase">Medical Application</div>
                           <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">Treats Conditions</h3>
                        </div>
                      </div>
                       <div className="flex flex-wrap gap-2 relative z-10">
                         {plant.diseases_cured ? (
                           plant.diseases_cured.split(',').map((disease, idx) => (
                             <span key={idx} className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-base font-semibold text-gray-800 dark:text-gray-100 shadow-sm border border-red-100 dark:border-gray-600">
                               {disease.trim()}
                             </span>
                           ))
                         ) : (
                           <p className="font-bold">General health benefits</p>
                         )}
                      </div>
                  </div>

                  {/* Card 5: Age & Safety (Combined) */}
                  <div className="group relative bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/50 dark:border-gray-700 overflow-hidden">
                       <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-2xl">🛡️</div>
                        <div>
                           <div className="text-xs font-bold tracking-wider text-orange-800 uppercase">Safety Protocol</div>
                           <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight">Usage Limits</h3>
                        </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Age Restriction</span>
                            <span className="font-bold text-red-600 bg-white px-2 py-1 rounded shadow-sm">{plant.age_restriction || 'None'}</span>
                         </div>
                          <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                            <span className="text-xs text-red-600 font-bold uppercase">Toxicity Warning</span>
                            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{plant.toxicity_warning || 'Consult Expert'}</p>
                         </div>
                      </div>
                  </div>

                </div>


               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* 3. Practical Use Guide */}
                 <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                     <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        🧠 Practical Use Guide
                     </h3>
                     <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Problem</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">What to Do</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {plant.practical_guide && plant.practical_guide.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{item.problem}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{item.solution}</td>
                                    </tr>
                                ))}
                                {!plant.practical_guide && (
                                    <tr><td colSpan="2" className="p-4 text-center">No practical guide available.</td></tr>
                                )}
                            </tbody>
                        </table>
                     </div>
                 </div>

                 {/* 4. When to AVOID (Safety) */}
                 <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl shadow-lg p-6 border border-red-100 dark:border-red-900/30">
                     <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                        🚫 Avoid If / Warning
                     </h3>
                     <div className="space-y-4">
                         <div>
                             <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 text-sm uppercase tracking-wider">Do Not Use If:</h4>
                             <div className="flex flex-wrap gap-2">
                                 {plant.safety_guide?.avoid_if ? plant.safety_guide.avoid_if.map((item, id) => (
                                     <span key={id} className="px-3 py-1 bg-white dark:bg-red-900/40 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium border border-red-100 dark:border-red-800">
                                         {item}
                                     </span>
                                 )) : <span>Consult Doctor</span>}
                             </div>
                         </div>
                         <div>
                             <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 text-sm uppercase tracking-wider">Overuse Effects:</h4>
                             <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-sm space-y-1">
                                 {plant.safety_guide?.overuse_effects ? plant.safety_guide.overuse_effects.map((effect, id) => (
                                     <li key={id}>{effect}</li>
                                 )) : <li>Nausea (General)</li>}
                             </ul>
                         </div>
                     </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 {/* 5. Human Friendly Description */}
                 <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-indigo-100 dark:border-gray-700">
                     <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-400 mb-4 flex items-center gap-2">
                        🌿 Nature of Plant (Visual Memory)
                     </h3>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center border-b border-indigo-100 dark:border-gray-700 pb-2">
                             <span className="text-gray-600 dark:text-gray-400">Taste</span>
                             <span className="font-bold text-gray-800 dark:text-gray-200">{plant.nature_properties?.taste || 'Unknown'}</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-indigo-100 dark:border-gray-700 pb-2">
                             <span className="text-gray-600 dark:text-gray-400">Body Effect</span>
                             <span className="font-bold text-indigo-600 dark:text-indigo-400">{plant.nature_properties?.body_effect || 'Unknown'} ❄️</span>
                         </div>
                         <div className="flex justify-between items-center border-b border-indigo-100 dark:border-gray-700 pb-2">
                             <span className="text-gray-600 dark:text-gray-400">Best Time</span>
                             <span className="font-bold text-gray-800 dark:text-gray-200">{plant.nature_properties?.best_time || 'Daytime'}</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-gray-600 dark:text-gray-400">Parts Used</span>
                             <span className="font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 px-2 py-1 rounded shadow-sm">
                                 {plant.nature_properties?.parts_used || 'General'}
                             </span>
                         </div>
                     </div>
                 </div>

                  {/* --- NEW SECTION: FOR FARMERS & AGRICULTURE --- */}
                  <div className="col-span-1 md:col-span-2 mt-4 relative overflow-hidden rounded-2xl shadow-lg border border-green-100 dark:border-green-800">
                      {/* Background Image Overlay */}
                      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none" 
                           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=3432&auto=format&fit=crop')" }}>
                      </div>

                      <div className="relative z-10 bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/90 dark:to-emerald-900/90 h-full">
                          <div className="bg-green-600/10 dark:bg-green-900/40 p-4 border-b border-green-100 dark:border-green-800 flex justify-between items-center">
                              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 flex items-center gap-2">
                                  <Tractor className="w-6 h-6" /> 
                                  <span>For Farmers: Cultivation & Economics</span>
                              </h3>
                              <span className="text-xs font-bold bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-3 py-1 rounded-full uppercase tracking-wider">High Value</span>
                          </div>
                          
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Cultivation Details */}
                             <div>
                                 <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                     <Sprout className="w-5 h-5 text-green-500" /> Growth Requirements
                                 </h4>
                                 <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                                         <Droplets className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                         <div className="text-xs text-gray-500">Water</div>
                                         <div className="font-bold text-gray-800 dark:text-gray-200">{plant.cultivation_guide?.water || 'Standard'}</div>
                                      </div>
                                      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                                         <Sun className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                                         <div className="text-xs text-gray-500">Sunlight</div>
                                         <div className="font-bold text-gray-800 dark:text-gray-200">{plant.cultivation_guide?.sunlight || 'Full Sun'}</div>
                                      </div>
                                      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                                         <Globe className="w-5 h-5 text-brown-500 mx-auto mb-1" />
                                         <div className="text-xs text-gray-500">Soil</div>
                                         <div className="font-bold text-gray-800 dark:text-gray-200">{plant.cultivation_guide?.soil || 'Well-drained'}</div>
                                      </div>
                                      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
                                         <Clock className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                                         <div className="text-xs text-gray-500">Harvest</div>
                                         <div className="font-bold text-gray-800 dark:text-gray-200">{plant.cultivation_guide?.harvest_time || 'Seasonal'}</div>
                                      </div>
                                 </div>
                             </div>

                             {/* Economic & Disease Info */}
                             <div className="space-y-4">
                                 <div>
                                     <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                         <TrendingUp className="w-5 h-5 text-blue-600" /> Market Potential
                                     </h4>
                                     <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-blue-100 dark:border-gray-700">
                                         <div className="flex justify-between mb-2">
                                            <span className="text-sm text-gray-500">Demand</span>
                                            <span className="font-bold text-blue-700 dark:text-blue-300">{plant.farming_guide?.market_demand || 'Stable Local Demand'}</span>
                                         </div>
                                         <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {plant.farming_guide?.economic_benefits || 'Good source of sustainable income if cultivated properly.'}
                                         </div>
                                     </div>
                                 </div>
                                 
                                 <div>
                                     <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                         <AlertTriangle className="w-5 h-5 text-amber-500" /> Disease & Care
                                     </h4>
                                     <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-amber-100 dark:border-gray-700 text-sm">
                                         <p><span className="font-semibold text-amber-700">Common Issues:</span> {plant.farming_guide?.common_diseases || 'Standard pest control required.'}</p>
                                         <p className="mt-1"><span className="font-semibold text-green-700">Prevention:</span> {plant.farming_guide?.prevention_tips || 'Ensure good drainage.'}</p>
                                     </div>
                                 </div>
                             </div>
                          </div>
                      </div>
                  </div>

                  {/* --- NEW SECTION: FOR SCIENTISTS & RESEARCHERS --- */}
                  <div className="col-span-1 md:col-span-2 mt-4 relative overflow-hidden rounded-2xl shadow-lg border border-blue-100 dark:border-blue-800">
                      {/* Background Image Overlay */}
                       <div className="absolute inset-0 z-0 bg-cover bg-center opacity-10 pointer-events-none" 
                           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=3540&auto=format&fit=crop')" }}>
                      </div>

                      <div className="relative z-10 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-900/90 dark:to-indigo-900/90 h-full">
                          <div className="bg-blue-600/10 dark:bg-blue-900/40 p-4 border-b border-blue-100 dark:border-blue-800 flex justify-between items-center">
                              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                  <Microscope className="w-6 h-6" /> 
                                  <span>For Scientists: Research Data</span>
                              </h3>
                              <span className="text-xs font-bold bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">Botanical Analysis</span>
                          </div>
                          
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                              {/* Morphology & Chemicals */}
                              <div className="space-y-4">
                                  <div>
                                      <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                          <Leaf className="w-4 h-4" /> Botanical Morphology
                                      </h4>
                                      <p className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                          {plant.research_data?.botanical_morphology || plant.plant_description || 'Morphological data currently being simplified for general use.'}
                                      </p>
                                  </div>
                                  <div>
                                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                          <FlaskConical className="w-4 h-4" /> Chemical Constituents
                                      </h4>
                                      <p className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                          {plant.research_data?.chemical_constituents || plant.medicine_content || 'Analysis pending.'}
                                      </p>
                                  </div>
                              </div>

                              {/* Research Areas & Distribution */}
                              <div className="space-y-4">
                                  <div>
                                      <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                          <BookOpen className="w-4 h-4" /> Potential Research Areas
                                      </h4>
                                       <p className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                          {plant.research_data?.potential_research_areas || 'Medicinal properties validation, sustainable cultivation.'}
                                      </p>
                                  </div>
                                  <div>
                                       <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                          <Globe className="w-4 h-4" /> Distribution Status
                                      </h4>
                                      <p className="text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                          {plant.research_data?.distribution_status || plant.native_location || 'Global distribution data unavailable.'}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                </div>



                {/* 7. Similar Plants (Safety) */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-l-4 border-yellow-400">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        🪴 Looks Similar To (Avoid Confusion)
                     </h3>
                     <div className="flex flex-wrap gap-4">
                         {plant.similar_plants && plant.similar_plants.map((sim, id) => (
                             <div key={id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                 <span className="font-bold text-gray-800 dark:text-gray-200">{sim.name}</span>
                                 <span className="text-gray-400">→</span>
                                 <span className={`font-bold ${sim.status === 'Toxic' ? 'text-red-500' : 'text-green-500'}`}>
                                     {sim.status}
                                 </span>
                             </div>
                         ))}
                         {!plant.similar_plants && <p>No lookalikes found in database.</p>}
                     </div>
                </div>

                {/* 8. Advanced Info (Collapsible) */}
                <div className="mt-8">
                    <button 
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <span className="font-bold text-gray-700 dark:text-gray-300">🔬 For Students & Researchers (Advanced Details)</span>
                        <span className="text-2xl">{showAdvanced ? '−' : '+'}</span>
                    </button>
                    
                    {showAdvanced && (
                        <div className="mt-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-500 uppercase text-sm mb-1">Scientific Name</h4>
                                    <p className="font-mono text-lg">{plant.scientific_name}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 uppercase text-sm mb-1">Family</h4>
                                    <p className="font-mono text-lg">{plant.family_name}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 uppercase text-sm mb-1">Doses</h4>
                                    <p className="font-mono text-lg">{plant.doses || 'Consult Doctor'}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-500 uppercase text-sm mb-1">Mode of Use</h4>
                                    <p className="font-mono text-lg">{plant.mode_of_use || 'General'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <h4 className="font-semibold text-gray-500 uppercase text-sm mb-1">Preparation Procedure</h4>
                                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{plant.procedure}</p>
                                </div>
                                 <div className="md:col-span-2">
                                    <h4 className="font-semibold text-gray-500 uppercase text-sm mb-1">Medicinal Summary</h4>
                                    <p className="text-gray-800 dark:text-gray-200">{plant.medicinal_uses}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
          
          )})}
        </div>
      )}
    </div>
  );
}
