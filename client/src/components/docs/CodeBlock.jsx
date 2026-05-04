import { useState } from 'react';

export default function CodeBlock({ children, language = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 left-0 px-3 py-1 text-[10px] uppercase tracking-widest text-gray-500 font-mono">
          {language}
        </div>
      )}
      <button
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 px-2 py-1 text-[10px] uppercase tracking-wider font-medium rounded bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <pre className="bg-black/60 border border-border rounded-xl p-4 pt-8 overflow-x-auto text-[13px] text-gray-300 font-mono leading-relaxed whitespace-pre">
        {children}
      </pre>
    </div>
  );
}
