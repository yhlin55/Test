import React from 'react';
import { UploadCloud, Mic } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6">
      <label 
        className={`
          flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed border-indigo-200 rounded-2xl 
          bg-indigo-50/50 hover:bg-indigo-50 transition-colors cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-indigo-500">
          <div className="bg-indigo-100 p-4 rounded-full mb-4">
            <UploadCloud className="w-10 h-10" />
          </div>
          <p className="mb-2 text-xl font-semibold">
            Upload Sales Call Recording
          </p>
          <p className="text-sm text-indigo-400 mb-6">
            MP3, WAV, or M4A (Max 20MB)
          </p>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-indigo-100">
             <Mic className="w-4 h-4 text-indigo-400" />
             <span className="text-sm font-medium text-slate-600">AI Transcription & Analysis</span>
          </div>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="audio/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default FileUpload;