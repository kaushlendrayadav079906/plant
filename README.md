# Medicinal Plant Recognition System 🌿

A full-stack application combining computer vision (YOLOv8) and natural language processing (Gemini) for medicinal plant identification and interactive Q&A.

## Features ✨
- 🖼️ Image-based plant detection using YOLOv8 object detection
- 💬 Conversational AI powered by Gemini
- 🌓 Dark/Light mode toggle
- 📱 Responsive mobile-first design
- 📊 Detailed plant information display
- 🔍 Interactive chat history

## Installation 🛠️

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Python)
1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```
2. Install requirements:
```bash
pip install -r requirements.txt
```
3. Set environment variables:
```bash
echo "GEMINI_API_KEY=your_api_key_here" > .env
```
4. Start server:
```bash
uvicorn main:app --reload
```

## Tech Stack 🧩

| Component       | Technologies                          |
|-----------------|---------------------------------------|
| **Frontend**    | React, Vite, Tailwind CSS, Axios      |
| **Backend**     | FastAPI, Python, YOLOv8, Gemini API  |
| **Build Tools** | npm, Vite, UVicorn                    |

## API Endpoints 📡

| Endpoint  | Method | Description                     |
|-----------|--------|---------------------------------|
| `/predict`| POST   | Plant detection from image      |
| `/chat`   | POST   | Natural language Q&A interface  |

## Usage Examples 💡

### Detection Flow
1. Upload plant image
2. View annotated detection results
3. Explore detailed plant information

### Chat Interface
```jsx
const handleSubmitChat = async (e) => {
  // Example chat submission handler
  e.preventDefault();
  const response = await axios.post(`${API_URL}/chat`, {
    plant_name: detectedPlant,
    message: userInput
  });
  // Update chat history...
};
```

## Contributing 🤝
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

![UI Screenshot](./frontend/public/screenshot.png) <!-- Add actual screenshot path -->

---
🔬 **Scientific Backing**: Leverages peer-reviewed botanical databases
🛡️ **Privacy First**: All processing done locally except Gemini API calls