import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import api from '../services/api';
import { Camera, Upload, Sparkles, ArrowLeft, Image, X } from 'lucide-react';

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

    // Simulate progressive analysis
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
    <div className="min-h-dvh bg-slate-50 flex flex-col pb-safe">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 to-emerald-600 px-5 pt-12 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/80 hover:text-white mb-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6" /> Clearing Out
          </h1>
          <p className="text-green-100 text-sm mt-1">Upload a photo of your items — AI does the rest</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full flex-1 px-5 pt-6 space-y-6">
        {/* Upload Area */}
        {!preview ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center gap-4 bg-white cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 active:scale-[0.98] animate-fade-in"
          >
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center">
              <Camera className="w-10 h-10 text-green-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-700 text-base">Tap to upload a photo</p>
              <p className="text-sm text-slate-400 mt-1">Take a photo of your shelf, desk, or pile of items</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Image className="w-4 h-4" />
              JPG, PNG, WebP — max 10MB
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden animate-scale-in shadow-lg">
            <img src={preview} alt="Upload preview" className="w-full aspect-[4/3] object-cover" />
            {!analyzing && (
              <button
                onClick={clearFile}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {analyzing && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-white font-bold text-lg">AI Analyzing...</p>
                  <p className="text-white/70 text-sm mt-1">Identifying items in your photo</p>
                </div>
                {/* Progress bar */}
                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
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

        {/* Instructions */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h3 className="font-bold text-slate-700 text-sm">How it works</h3>
          <div className="space-y-2.5">
            {[
              { step: '1', text: 'Upload a photo of items you want to clear out' },
              { step: '2', text: 'AI identifies each item and suggests listings' },
              { step: '3', text: 'Review, edit, and publish to your community' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">{s.step}</span>
                <p className="text-sm text-slate-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Analyze Button */}
        {preview && !analyzing && (
          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 flex items-center justify-center gap-2 animate-slide-up"
          >
            <Sparkles className="w-5 h-5" />
            Analyze with AI
          </button>
        )}
      </div>
    </div>
  );
}
