# 🚀 Deployment Guide: Plant Recognition App

## ⚠️ Important Solution for Backend Deployment

You mentioned that you deployed the frontend on **Netlify**, but the backend on **Vercel** is not working.

### The Problem: Vercel File Size Limits
Your backend uses **PyTorch** and **YOLOv8** for AI detection. These libraries are very large (over 500MB).
**Vercel** has a strict **250MB limit** for Serverless Functions. This is why your backend fails or crashes on Vercel.

### The Solution: Deploy Backend to Render.com
We will deploy the backend to **Render (Free Tier)**, which supports Docker/Python containers and has much higher limits.

---

## ✅ Step 1: Deploy Backend to Render

1.  **Push Code to GitHub**: Make sure your latest code is on GitHub.
2.  **Create Service**:
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
3.  **Configure Settings**:
    *   **Name**: `plant-backend-api`
    *   **Root Directory**: `backend` (⚠️ Very Important: tells Render to look in the backend folder)
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  **Environment Variables**:
    *   Scroll down to "Environment Variables".
    *   Add `GEMINI_API_KEY` and paste your key.
5.  **Deploy**: Click **Create Web Service**.
    *   *Note: Takes about 5 minutes to build.*

**Copy your Backend URL** once it's live (e.g., `https://plant-backend-api.onrender.com`).

---

## ✅ Step 2: Connect Frontend (Netlify) to Backend

Now that your backend is live, you need to tell your Netlify frontend where to find it.

1.  **Go to Netlify Dashboard**.
2.  Select your frontend site.
3.  Go to **Site configuration** -> **Environment variables**.
4.  Click **Add a variable**:
    *   **Key**: `VITE_API_URL`
    *   **Value**: `https://plant-backend-api.onrender.com` (Your Render URL)
5.  **Re-deploy Frontend**:
    *   Go to **Deploys** tab -> **Trigger deploy** -> **Deploy site**.

## ✅ Step 3: Verify

1.  Open your website.
2.  Upload an image.
3.  It should now successfully send the image to your Render backend and get the result!
