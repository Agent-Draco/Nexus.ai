import React, { useState, useMemo } from 'react';

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

interface BuildScriptDisplayProps {
  script: string;
}

const BuildScriptDisplay: React.FC<BuildScriptDisplayProps> = ({ script }) => {
  const [osName, setOsName] = useState('MyCustomOS');
  const [copied, setCopied] = useState(false);

  const finalScript = useMemo(() => {
    const sanitizedName = osName.replace(/[^a-zA-Z0-9_-]/g, '') || 'MyCustomOS';
    return script.replace(/__OS_NAME__/g, sanitizedName);
  }, [script, osName]);

  const handleCopy = () => {
    navigator.clipboard.writeText(finalScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([finalScript], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const sanitizedName = (osName.replace(/[^a-zA-Z0-9_-]/g, '') || 'MyCustomOS').toLowerCase();
    a.href = url;
    a.download = `build-${sanitizedName}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!script) return null;

  return (
    <div className="w-full space-y-6 animate-fade-in bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6">
      <h2 className="text-2xl font-bold text-white">Your Custom OS Build Script is Ready!</h2>
      
      <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-lg">
        <h3 className="font-bold">Instructions</h3>
        <p className="text-sm mt-1">
          To create your bootable ISO, save this script and run it on a machine with Debian or Ubuntu.
          It will download all components, including VS Code, and build the ISO file.
        </p>
        <code className="block bg-black/50 p-2 rounded mt-2 text-xs font-mono">
          sudo bash ./{`build-${(osName.replace(/[^a-zA-Z0-9_-]/g, '') || 'MyCustomOS').toLowerCase()}.sh`}
        </code>
      </div>

      <div className="space-y-2">
        <label htmlFor="osName" className="block text-lg font-medium text-cyan-300">
          Name Your OS
        </label>
        <input
          id="osName"
          type="text"
          value={osName}
          onChange={(e) => setOsName(e.target.value)}
          className="w-full md:w-1/2 bg-gray-900/70 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow"
          placeholder="e.g., DevOS, PrivacyBox"
        />
        <p className="text-xs text-gray-400">This will be used for the ISO filename and system hostname.</p>
      </div>

      <div className="relative">
        <div className="bg-black rounded-md font-mono text-sm overflow-x-auto max-h-[50vh] border border-gray-700">
           <div className="sticky top-0 bg-gray-900/80 backdrop-blur-sm p-2 flex justify-end gap-2 border-b border-gray-700">
              <button onClick={handleCopy} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition-colors duration-200">
                <CopyIcon className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-1 px-3 rounded-md text-sm transition-colors duration-200">
                <DownloadIcon className="w-4 h-4" />
                Download .sh
              </button>
            </div>
          <pre className="p-4 text-gray-300 whitespace-pre-wrap break-words">
            <code>{finalScript}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default BuildScriptDisplay;
