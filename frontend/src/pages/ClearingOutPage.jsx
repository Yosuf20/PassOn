import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Camera, Sparkles, ArrowLeft, Image, X } from 'lucide-react';

export default function ClearingOutPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef(null);
  const { community, user, showToast } = useApp();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(0);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { clearInterval(progressTimer); return 90; }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const results = await api.analyzePhoto(file);
      clearInterval(progressTimer);
      setProgress(100);
      setTimeout(() => {
        navigate('/ai-results', { state: { aiItems: results, photoPreview: preview } });
      }, 500);
    } catch (err) {
      clearInterval(progressTimer);
      showToast('error', err.message || 'Analysis failed. Please try again.');
      setAnalyzing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="min-h-dvh bg-white text-gray-900 pb-safe">
      {/* Header */}
      <div className="border-b-2 border-gray-100 px-5 sm:px-8 pt-8 pb-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              title="Return"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <span>Clearing Out</span>
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium max-w-xl">
            Upload a photo of your items — AI identifies objects and recommends reuse vs scrap routes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-5 sm:px-8 py-8 space-y-6">
        {/* Upload Zone */}
        {!preview ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="bg-gray-100 hover:bg-blue-50/60 rounded-2xl p-12 sm:p-16 text-center cursor-pointer transition-all duration-200 hover:scale-[1.01] flex flex-col items-center justify-center gap-4"
          >
            <div className="w-18 h-18 bg-blue-500 text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-transform">
              <Camera className="w-9 h-9" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-extrabold text-xl text-gray-900">Upload or Snap Photo</p>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Photograph your desk, bookshelf, pile, or storage container
              </p>
            </div>
            <div className="text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg">
              JPG, PNG, WEBP • Max 10MB
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-gray-900">
            <img src={preview} alt="Upload preview" className="w-full aspect-[4/3] object-cover" />

            {!analyzing && (
              <button
                onClick={clearFile}
                className="absolute top-4 right-4 p-2 bg-gray-900/80 hover:bg-gray-900 text-white rounded-lg transition"
                title="Discard photo"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {analyzing && (
              <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center p-6 gap-4 text-center">
                <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                <div className="text-white">
                  <p className="font-extrabold text-lg">AI Vision Parsing...</p>
                  <p className="text-sm text-gray-300 mt-0.5">Detecting individual objects and condition</p>
                </div>
                {/* Progress bar */}
                <div className="w-56 h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white">{Math.round(progress)}% Complete</span>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* How it works */}
        <div className="bg-gray-100 rounded-2xl p-6 space-y-3.5">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-900">
            How It Works
          </h3>
          <div className="space-y-3 text-sm text-gray-700 font-medium">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <p><strong>Snap:</strong> Take one photo containing all items you want to give away or recycle.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <p><strong>AI Detection:</strong> Vision model segments individual goods and suggests routes.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-md flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <p><strong>Publish:</strong> Review prices, adjust titles, and list directly in your community circle.</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {preview && !analyzing && (
          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-base rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Analyze with AI</span>
          </button>
        )}
      </div>
    </div>
  );
}
