import React, { useState, useCallback } from 'react';
import { generateBuildScript } from './services/geminiService';
import FileUpload from './components/FileUpload';
import BuildScriptDisplay from './components/OsDisplay';
import AIIcon from './components/icons/AIIcon';
import Spinner from './components/ui/Spinner';
import LinuxIcon from './components/icons/LinuxIcon';

const App: React.FC = () => {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [buildScript, setBuildScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
  }, []);

  const handleGenerate = async () => {
    if (!userPrompt && files.length === 0) {
      setError('Please describe the OS you want to build or provide files for context.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setBuildScript(null);

    try {
      const result = await generateBuildScript(userPrompt, files);
      setBuildScript(result);
    } catch (e) {
      const err = e as Error;
      setError(`Generation failed: ${err.message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  const WelcomeScreen = () => (
    <div className="text-center p-8">
      <div className="flex justify-center items-center gap-4 mb-4">
        <AIIcon className="w-16 h-16 text-cyan-400" />
        <span className="text-4xl font-thin text-gray-500">→</span>
        <LinuxIcon className="w-16 h-16 text-cyan-400" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Build a Bootable Linux ISO</h2>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
        Describe your ideal OS, and let AI generate a build script to create a real, bootable ISO file with Visual Studio Code pre-installed.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            AI <span className="text-cyan-400">ISO</span> Builder
          </h1>
          <p className="mt-2 text-gray-400">Generate a build script for a custom, bootable Linux OS with Gemini.</p>
        </header>

        <main className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl shadow-cyan-500/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label htmlFor="prompt" className="block text-lg font-medium text-cyan-300">
                  1. Describe Your OS
                </label>
                <textarea
                  id="prompt"
                  rows={4}
                  className="w-full bg-gray-900/70 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
                  placeholder="e.g., A lightweight OS for developers using XFCE, with Docker and Python pre-installed."
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                 <label className="block text-lg font-medium text-cyan-300">
                  2. Add Context Files (Optional)
                </label>
                <FileUpload files={files} onFilesChange={handleFilesChange} />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-500 text-gray-900 font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-5 h-5 mr-3" />
                    Generating Script...
                  </>
                ) : (
                  <>
                    <AIIcon className="w-5 h-5 mr-3" />
                    Generate Build Script
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                <p><strong>Error:</strong> {error}</p>
              </div>
            )}

            <div className="mt-6">
              {isLoading && (
                  <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                      <Spinner className="w-12 h-12 text-cyan-400 mb-4" />
                      <h3 className="text-xl font-semibold text-white">Writing build script...</h3>
                      <p className="text-gray-400">The AI is preparing the instructions to build your OS.</p>
                  </div>
              )}
              {!isLoading && !buildScript && !error && <WelcomeScreen />}
              {buildScript && <BuildScriptDisplay script={buildScript} />}
            </div>
          </div>
        </main>
      </div>
       <footer className="w-full max-w-5xl mx-auto text-center mt-12 pb-4">
          <p className="text-sm text-gray-500">
            Powered by Google Gemini. This tool generates a build script. You must run it on a Linux machine to create the ISO.
          </p>
        </footer>
    </div>
  );
};

export default App;
