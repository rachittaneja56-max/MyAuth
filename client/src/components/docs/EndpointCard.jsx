import { useState } from 'react';
import CodeBlock from './CodeBlock';
import ParamTable from './ParamTable';

const methodColors = {
  GET: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  POST: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  PUT: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function EndpointCard({ method, path, description, auth, params, responseExample, curlExample, notes }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${methodColors[method]}`}>
          {method}
        </span>
        <code className="font-mono text-sm text-white flex-1">{path}</code>
        <span className="text-muted text-xs hidden sm:block max-w-[200px] truncate">{description}</span>
        <svg
          className={`w-4 h-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-5 space-y-5">
          <p className="text-muted text-sm leading-relaxed">{description}</p>

          {auth && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Auth:</span>
              <span className="text-xs px-2 py-0.5 bg-white/5 border border-border rounded text-white font-mono">{auth}</span>
            </div>
          )}

          {params && params.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">Parameters</h4>
              <div className="bg-black/30 rounded-lg border border-border overflow-hidden">
                <ParamTable params={params} />
              </div>
            </div>
          )}

          {responseExample && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">Response</h4>
              <CodeBlock language="json">{responseExample}</CodeBlock>
            </div>
          )}

          {curlExample && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-3">Example</h4>
              <CodeBlock language="bash">{curlExample}</CodeBlock>
            </div>
          )}

          {notes && (
            <div className="px-4 py-3 bg-glow/5 border border-glow/20 rounded-lg">
              <p className="text-xs text-glow leading-relaxed"> {notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
