import React, { useState } from 'react';
import { Bot, Loader2, RefreshCw } from 'lucide-react';
import { AnalysisResult, AppState } from './types';
import { analyzeAudio, fileToBase64 } from './services/geminiService';
import FileUpload from './components/FileUpload';
import Transcript from './components/Transcript';
import SentimentGraph from './components/SentimentGraph';
import CoachingCard from './components/CoachingCard';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileSelect = async (file: File) => {
    try {
      setAppState(AppState.ANALYZING);
      setFileName(file.name);
      setErrorMsg(null);

      const base64Audio = await fileToBase64(file);
      const data = await analyzeAudio(base64Audio, file.type);
      
      setResult(data);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to analyze audio. Please ensure the file is valid and try again. " + (err instanceof Error ? err.message : ""));
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setFileName("");
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">SalesIQ Coach</h1>
            <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.5</p>
          </div>
        </div>
        {appState === AppState.SUCCESS && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Analyze New Call
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        
        {/* State: IDLE */}
        {appState === AppState.IDLE && (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-2xl mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Turn Call Recordings into Revenue</h2>
              <p className="text-slate-600 text-lg">
                Upload your sales calls to get instant transcripts, engagement analysis, and AI coaching tips.
              </p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} />
            
            {/* Demo Tip */}
            <div className="mt-12 text-center text-sm text-slate-400 max-w-md mx-auto">
               <p>Tip: Ensure your API key is set in the environment. Supported formats: MP3, WAV, M4A.</p>
            </div>
          </div>
        )}

        {/* State: ANALYZING */}
        {appState === AppState.ANALYZING && (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">Analyzing Audio...</h3>
              <p className="text-slate-500">Transcribing conversation and generating insights for {fileName}</p>
              <div className="mt-8 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 animate-[shimmer_1.5s_infinite] w-1/2"></div>
              </div>
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {appState === AppState.ERROR && (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100 max-w-md text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
              <p className="text-slate-600 mb-6">{errorMsg || "Something went wrong while processing the file."}</p>
              <button 
                onClick={handleReset}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* State: SUCCESS (Dashboard) */}
        {appState === AppState.SUCCESS && result && (
          <div className="h-full p-4 lg:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
              
              {/* Left Column: Transcript (4 cols) */}
              <div className="lg:col-span-4 h-full">
                <Transcript segments={result.transcript} />
              </div>

              {/* Right Column: Graphs & Coaching (8 cols) */}
              <div className="lg:col-span-8 h-full flex flex-col gap-6">
                
                {/* Top: Sentiment Graph (40% height) */}
                <div className="flex-none h-[40%] min-h-[250px]">
                  <SentimentGraph data={result.sentiment} />
                </div>

                {/* Bottom: Coaching Card (Remaining height) */}
                <div className="flex-1 min-h-[300px]">
                  <CoachingCard data={result.coaching} />
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;