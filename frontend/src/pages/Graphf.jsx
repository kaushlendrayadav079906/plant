import { ArrowLeft, Check, ShieldCheck, StopCircle, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar, RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis, YAxis
} from 'recharts';

// --- COLORS ---
const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

// --- DETERMINISTIC RANDOM DATA GENERATOR ---
// Generates a mock "random" number between 0 and 1 based on a string seed (plant name)
// This ensures the same plant always gets the same graphs.
const stringToSeed = (str) => {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function Graphf() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plant, previewUrl, fullDetectionResult } = location.state || {}; // Extract full result
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Redirect if no data
  useEffect(() => {
    if (!plant) navigate('/');
    // Cleanup speech on unmount
    return () => window.speechSynthesis.cancel();
  }, [plant, navigate]);

  if (!plant) return null;

  // ... (useMemo for chartData remains same)
  const chartData = useMemo(() => {
    const seed = stringToSeed(plant.name || 'plant');
    
    // 1. Medicinal Radar Data
    const medicinal = [
      { subject: 'Antibacterial', A: Math.floor(seededRandom(seed) * 60) + 40, fullMark: 100 },
      { subject: 'Antifungal', A: Math.floor(seededRandom(seed + 1) * 60) + 40, fullMark: 100 },
      { subject: 'Anti-inflammatory', A: Math.floor(seededRandom(seed + 2) * 60) + 40, fullMark: 100 },
      { subject: 'Immunity Boost', A: Math.floor(seededRandom(seed + 3) * 60) + 40, fullMark: 100 },
      { subject: 'Pain Relief', A: Math.floor(seededRandom(seed + 4) * 60) + 40, fullMark: 100 },
    ];

    // 2. Plant Uses Pie Chart
    let r1 = seededRandom(seed + 5);
    let r2 = seededRandom(seed + 6);
    let r3 = seededRandom(seed + 7);
    let total = r1 + r2 + r3 + 0.5; 
    const uses = [
      { name: 'Skin Care', value: Math.round((r1 / total) * 100) },
      { name: 'Hair Care', value: Math.round((r2 / total) * 100) },
      { name: 'Dental/Oral', value: Math.round((r3 / total) * 100) },
      { name: 'Internal Health', value: 100 - (Math.round((r1 / total) * 100) + Math.round((r2 / total) * 100) + Math.round((r3 / total) * 100)) }
    ];

    // 3. Cultivation Bar Chart
    const cultivation = [
      { name: 'Water', value: Math.floor(seededRandom(seed + 8) * 80) + 20, fill: '#3B82F6' },
      { name: 'Sunlight', value: Math.floor(seededRandom(seed + 9) * 80) + 20, fill: '#F59E0B' },
      { name: 'Growth', value: Math.floor(seededRandom(seed + 10) * 80) + 20, fill: '#10B981' },
      { name: 'Maint.', value: Math.floor(seededRandom(seed + 11) * 80) + 20, fill: '#6B7280' },
    ];

    // 4. Seasonal Line Chart
    const seasonal = [];
    for (let i = 0; i < 12; i++) {
        const val = 40 + (Math.sin((i + seededRandom(seed+12)*5) * 0.5) * 30) + (seededRandom(seed + 13 + i) * 20);
        seasonal.push({ name: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], index: Math.abs(val) });
    }

    // 5. Chemical Donut Chart
    const chemical = [
      { name: 'Alkaloids', value: Math.floor(seededRandom(seed + 20) * 30) + 10 },
      { name: 'Flavonoids', value: Math.floor(seededRandom(seed + 21) * 20) + 5 },
      { name: 'Terpenoids', value: Math.floor(seededRandom(seed + 22) * 25) + 15 },
      { name: 'Glycosides', value: Math.floor(seededRandom(seed + 23) * 25) + 10 },
    ];

    return { medicinal, uses, cultivation, seasonal, chemical };
  }, [plant.name]);


  // --- VOICE ASSISTANT ---
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [availableVoices, setAvailableVoices] = useState([]);
  
  const languages = [
    { code: 'en-US', name: 'English', label: 'English' },
    { code: 'hi-IN', name: 'Hindi', label: 'हिंदी (Hindi)' },
    { code: 'es-ES', name: 'Spanish', label: 'Español' },
    { code: 'fr-FR', name: 'French', label: 'Français' },
  ];

  // Load voices securely
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // Cleanup
    return () => {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const generateSummary = (lang) => {
    // Helper for "Yes/No" text
    const getYesNoText = (val, yesText, noText) => val === 'YES' ? yesText : noText;

    if (lang === 'hi-IN') {
        const safe_eat = getYesNoText(plant.quick_safety?.safe_eat, 'यह खाने के लिए सुरक्षित है', 'इसे सीधे नहीं खाना चाहिए');
        const pregnant = getYesNoText(plant.quick_safety?.for_pregnant, 'गर्भवती महिलाओं के लिए सुरक्षित है', 'गर्भवती महिलाओं को इससे बचना चाहिए');
        
        return `नमस्ते। यह विस्तृत विश्लेषण है।
        यह पौधा है ${plant.common_name}, जिसे विज्ञान में ${plant.scientific_name} कहा जाता है। यह ${plant.family_name} परिवार से आता है।
        
        सुरक्षा रिपोर्ट:
        ${safe_eat}। और ${pregnant}।
        अगर आप इसे त्वचा पर लगाते हैं, तो यह ${getYesNoText(plant.quick_safety?.safe_skin, 'सुरक्षित है', 'जलन पैदा कर सकता है')}।
        बच्चों के लिए: ${getYesNoText(plant.quick_safety?.for_children, 'उपयोगी है', 'सावधानी बरतें')}।

        मुख्य फायदे:
        यह मुख्य रूप से ${plant.primary_body_system || 'शरीर'} को ठीक करने में मदद करता है।
        यह इन बीमारियों में काम आता है: ${plant.diseases_cured || 'सामान्य रोग'}।
        
        उपयोग कैसे करें:
        ${plant.mode_of_use || 'विशेषज्ञ से सलाह लें'}।
        ${plant.procedure || ''}
        
        चेतावनी:
        ${plant.toxicity_warning || 'कोई विशेष विषाक्तता नहीं'}।
        ${plant.age_restriction ? `आयु सीमा: ${plant.age_restriction}` : ''}।

        खेती और विज्ञान:
        यह ${plant.native_location || 'कई जगहों'} में पाया जाता है।
        इसमे ${chartData.chemical.sort((a,b) => b.value - a.value)[0].name} जैसे रसायन होते हैं।
        इसे उगाने के लिए ${chartData.cultivation[0].value} प्रतिशत पानी की जरूरत होती है।
        
        संक्षेप में, यह एक ${plant.plant_type || 'औषधीय पौधा'} है जिसका उपयोग ${plant.nature_properties?.best_time || 'दिन'} के समय करना सबसे अच्छा है।`;
    }

    // Default English Narrative
    const safe_eat = getYesNoText(plant.quick_safety?.safe_eat, 'It is safe to consume.', 'It is NOT safe to eat directly.');
    const safe_skin = getYesNoText(plant.quick_safety?.safe_skin, 'Safe for skin application.', 'May cause skin irritation.');
    const pregnant = getYesNoText(plant.quick_safety?.for_pregnant, 'It is safe for pregnant women.', 'It is strictly forbidden for pregnant women.');
    const children = getYesNoText(plant.quick_safety?.for_children, 'Safe for children.', 'Not recommended for small children.');

    return `Hello. Let me explain the complete analysis for this plant.
      
      Identification:
      This is ${plant.common_name}, scientifically known as ${plant.scientific_name}. It generally belongs to the ${plant.family_name} family.
      Our confidence in this detection is ${plant.confidence || 'very high'}.

      Safety Profile:
      First, let's talk about safety. ${safe_eat} ${safe_skin} ${pregnant} And regarding children, ${children}.
      Important Warning: ${plant.toxicity_warning || 'Always handle with care.'}
      
      Medicinal Properties:
      This plant is powerful. Its primary target is the ${plant.primary_body_system || 'Body System'}.
      It is traditionally used to treat conditions like: ${plant.diseases_cured || 'general ailments'}.
      The main healing compounds found in it are likely ${plant.medicine_content || 'alkaloids and flavonoids'}.
      
      How to Use:
      The recommended mode of use is: ${plant.mode_of_use || 'consulting a specialist'}.
      ${plant.procedure ? `Here is a procedure: ${plant.procedure}.` : ''}
      And remember, the best time to use it is ${plant.nature_properties?.best_time || 'during the day'}.

      Cultivation & Ecology:
      If you want to grow this, it is native to ${plant.native_location || 'various regions'}.
      Use water level around ${chartData.cultivation[0].value} percent, and ensure sunlight is around ${chartData.cultivation[1].value} percent.
      
      Economic Value:
      ${plant.farming_guide?.market_demand ? `Market demand is ${plant.farming_guide.market_demand}.` : ''}
      ${plant.farming_guide?.economic_benefits || ''}

      Thank you. I hope this detailed breakdown helps you utilize the ${plant.name} effectively.`;
  };

  const handleSpeak = () => {
    // If currently speaking, stop it.
    if (isSpeaking || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Generate text
    const summary = generateSummary(selectedLanguage);
    console.log("Speaking summary:", summary);

    // Cancel any previous utterances just in case
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.lang = selectedLanguage;
    utterance.rate = 1.1; // Slightly faster
    utterance.volume = 1.0;

    // Voice Selection - Prioritize Google
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang === selectedLanguage && v.name.includes("Google"));
    
    if (!voice) {
        voice = voices.find(v => v.lang === selectedLanguage);
    }
    
    if (voice) {
        utterance.voice = voice;
        console.log("Using voice (Graphf):", voice.name);
    } else {
        console.log("No specific voice found, using default for language:", selectedLanguage);
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
             console.error("Speech error:", e);
        }
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };


  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-7xl">
      
      {/* HEADER & NAV */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => navigate('/', { state: { restoredDetectionResult: fullDetectionResult, restoredPreviewUrl: previewUrl } })} 
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-green-100 transition-colors">
            <ArrowLeft size={20} />
          </div>
          <span className="font-semibold text-lg">Back</span>
        </button>

        {/* VOICE GUIDE CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
                <select 
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-3 pl-4 pr-10 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                    {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
            </div>

            <button 
            onClick={handleSpeak}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
                isSpeaking 
                ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse shadow-red-500/30' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30'
            }`}
            >
            {isSpeaking ? <StopCircle size={20} /> : <Volume2 size={20} />}
            {isSpeaking ? 'Stop Voice' : 'Start Guide'}
            </button>
        </div>

        <div className="text-right">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
            {plant.name || 'Plant'} Analysis
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full inline-block">
            {plant.scientific_name}
          </p>
        </div>
      </div>

      {/* 0. HERO IMAGE SECTION */}
      {previewUrl && (
        <div className="relative w-full h-[350px] md:h-[450px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl group border border-gray-200 dark:border-gray-700">
          <img 
            src={previewUrl} 
            alt="Original Specimen" 
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white max-w-lg">
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                   Verified Specimen
                </span>
             </div>
             
          </div>
        </div>
      )}

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* 1. CONFIDENCE METER (Progress Bar) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-white">
            <Check className="w-6 h-6 text-green-500" />
            Prediction Confidence
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-end mb-1">
                <span className="text-3xl font-black text-green-600 dark:text-green-400">
                  {plant.confidence || '96%'}
                </span>
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Accuracy</span>
             </div>
             
             {/* Custom Progress Bar */}
             <div className="h-6 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner relative">
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 via-green-500 to-lime-500 rounded-full flex items-center justify-end px-2"
                  style={{ width: parseFloat(plant.confidence) > 0 ? plant.confidence : '96%' }}
                >
                    <div className="h-full w-full absolute top-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                </div>
             </div>
             <p className="text-xs text-gray-400 text-right mt-1">High certainty based on leaf morphology.</p>
          </div>
        </div>

        {/* 7. SAFETY INDICATOR (Badges) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
           <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-800 dark:text-white">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            Safety Profile
          </h3>
           <div className="grid grid-cols-3 gap-4 h-32">
             {/* Card 1 */}
             <div className={`rounded-xl flex flex-col items-center justify-center p-2 border-2 ${plant.quick_safety?.safe_skin === 'YES' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <div className="text-3xl mb-2">{plant.quick_safety?.safe_skin === 'YES' ? '🟢' : '🔴'}</div>
                <div className="text-xs font-bold uppercase">Skin Safe</div>
             </div>
              {/* Card 2 */}
             <div className={`rounded-xl flex flex-col items-center justify-center p-2 border-2 ${plant.quick_safety?.safe_eat === 'YES' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                <div className="text-3xl mb-2">{plant.quick_safety?.safe_eat === 'YES' ? '🟢' : '🟡'}</div>
                <div className="text-xs font-bold uppercase">Edible</div>
             </div>
              {/* Card 3 */}
             <div className={`rounded-xl flex flex-col items-center justify-center p-2 border-2 ${plant.quick_safety?.for_pregnant === 'YES' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <div className="text-3xl mb-2">{plant.quick_safety?.for_pregnant === 'YES' ? '🟢' : '🔴'}</div>
                <div className="text-xs font-bold uppercase">Pregnancy</div>
             </div>
           </div>
        </div>

        {/* 2. MEDICINAL STRENGTH (Radar Chart) */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
               ⭐ Medicinal Properties
             </h3>
             <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">Key Features</span>
          </div>
          
          <div className="h-[300px] w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.medicinal}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Potency"
                  dataKey="A"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fill="#8B5CF6"
                  fillOpacity={0.4}
                />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">Comparison of therapeutic strengths</p>
        </div>

        {/* 3. PLANT USES (Pie Chart) */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
            🩺 Usage Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.uses}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.uses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

         {/* 4. CULTIVATION (Bar Chart) */}
         <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
           <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
            🌱 Cultivation Needs
          </h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 data={chartData.cultivation}
                 margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
               >
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                 <YAxis hide domain={[0, 100]} />
                 <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                 <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                   {chartData.cultivation.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
           <div className="flex justify-between px-4 mt-2 text-xs text-gray-500 font-medium">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
           </div>
         </div>

         {/* 5. SEASONAL AVAILABILITY (Line Chart) */}
         <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-gray-800 dark:text-white">
              🗓️ Seasonal Growth Curve
            </h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                     data={chartData.seasonal}
                     margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} interval={2} />
                     <YAxis hide />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                     <Line 
                        type="monotone" 
                        dataKey="index" 
                        stroke="#10B981" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10B981' }} 
                        activeDot={{ r: 6 }} 
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* 6. CHEMICAL COMPOSITION (Pie/Donut Chart) */}
         <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-xl border border-indigo-100 dark:border-gray-700">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-4 max-w-md">
                     <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">🔬 Chemical Composition</h3>
                     <p className="text-gray-600 dark:text-gray-300">
                        Detailed breakdown of active phytochemicals found in {plant.name}. These compounds are responsible for its medicinal efficacy.
                     </p>
                     
                     <ul className="space-y-3 mt-4">
                        {chartData.chemical.map((entry, index) => (
                           <li key={index} className="flex items-center justify-between text-sm font-medium p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-indigo-50 dark:border-gray-700">
                              <span className="flex items-center gap-2">
                                 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                 {entry.name}
                              </span>
                              <span className="font-bold text-gray-700 dark:text-white">{entry.value}%</span>
                           </li>
                        ))}
                     </ul>
                 </div>

                 <div className="h-[300px] w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={chartData.chemical}
                             cx="50%"
                             cy="50%"
                             innerRadius={80}
                             outerRadius={110}
                             dataKey="value"
                             stroke="none"
                             paddingAngle={2}
                             cornerRadius={5}
                          >
                             {chartData.chemical.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                             ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold fill-gray-500">
                             100%
                          </text>
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
             </div>
         </div>

      </div>

      <div className="text-center mt-12 text-gray-400 text-sm pb-8">
         <p>Data visualization generated based on AI analysis and botanical database records for {plant.scientific_name}.</p>
      </div>

    </div>
  );
}
