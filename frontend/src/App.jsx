import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, Image as ImageIcon, Loader2, Upload, User, X, Camera } from 'lucide-react';

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

// --- Main App Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('detect');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // --- Dark Mode ---
  const [isDark, setIsDark] = useState(false);

  const fileInputRef = useRef(null);
  const API_URL = 'http://localhost:8000';

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
      setCameraError('Unable to access camera. Please allow permissions.');
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

      if (response.data.plant_data?.length > 0 && !response.data.plant_data[0].error) {
        const plantName = response.data.plant_data[0].name || 'your plant';
        setChatPlantName(plantName);
        setChatMessages([{ sender: 'bot', text: `I've identified ${plantName}. Ask me anything about it!` }]);
      } else {
        setChatMessages([{ sender: 'bot', text: "I couldn't detect a specific plant." }]);
      }
    } catch (err) {
      console.error(err);
      setError('Error during detection. Is backend running?');
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
      setChatMessages((prev) => [...prev, { sender: 'bot', text: 'Error, please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400">
              🌿 Medicinal Plant Recognition
            </h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              {isDark ? '🌞' : '🌙'}
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="container mx-auto flex-grow p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            {/* Camera Button */}
            <button
              onClick={startCamera}
              className="mt-4 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              <Camera className="h-5 w-5" /> Open Camera
            </button>

            {/* Camera Stream */}
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

            {/* Detect Button */}
            <button
              onClick={handleSubmitDetection}
              disabled={!selectedFile || isLoading}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg mt-6 flex justify-center hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? <Spinner /> : 'Detect Plant'}
            </button>
          </div>

          {/* RIGHT: Output + Chat */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col h-full">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                onClick={() => setActiveTab('detect')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'detect'
                    ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                    : 'text-gray-400'
                }`}
              >
                Detection Result
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-4 font-medium ${
                  activeTab === 'chat'
                    ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                    : 'text-gray-400'
                }`}
              >
                Ask Gemini
              </button>
            </div>

            {/* Detection + Chat */}
            {activeTab === 'detect' ? (
              <div className="flex-grow">
                {isLoading && <SkeletonLoader />}
                {!isLoading && detectionResult && (
                  <div>
                    <img
                      src={`data:image/jpeg;base64,${detectionResult.annotated_image}`}
                      alt="Detected"
                      className="rounded-lg border border-gray-200 w-full mb-4"
                    />
                    {detectionResult.plant_data.map((plant, i) => (
                      <div
                        key={i}
                        className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg mb-3"
                      >
                        <h4 className="font-bold text-green-700 dark:text-green-300">
                          {plant.name}
                        </h4>
                        <ul className="text-sm mt-2 space-y-1">
                          <li>
                            <b>Scientific:</b> {plant.scientific_name}
                          </li>
                          <li>
                            <b>Common:</b> {plant.common_name}
                          </li>
                          <li>
                            <b>Family:</b> {plant.family_name}
                          </li>
                          <li>
                            <b>Uses:</b> {plant.medicinal_uses}
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col flex-grow">
                <div className="flex-grow overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex items-start gap-2 ${
                          msg.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full ${
                            msg.sender === 'user' ? 'bg-blue-500' : 'bg-green-600'
                          } text-white`}
                        >
                          {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmitChat} className="flex gap-2 mt-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask about ${chatPlantName}...`}
                    className="flex-grow p-2 border rounded-lg"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
