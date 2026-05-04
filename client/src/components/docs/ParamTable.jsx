export default function ParamTable({ params }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="px-4 py-2.5 text-muted font-medium text-xs uppercase tracking-wider">Parameter</th>
            <th className="px-4 py-2.5 text-muted font-medium text-xs uppercase tracking-wider">Type</th>
            <th className="px-4 py-2.5 text-muted font-medium text-xs uppercase tracking-wider">Required</th>
            <th className="px-4 py-2.5 text-muted font-medium text-xs uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {params.map((p) => (
            <tr key={p.name}>
              <td className="px-4 py-2.5 font-mono text-xs text-white whitespace-nowrap">{p.name}</td>
              <td className="px-4 py-2.5 text-xs text-purple-400 whitespace-nowrap">{p.type}</td>
              <td className="px-4 py-2.5">
                {p.required ? (
                  <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded border border-red-500/20 font-medium">REQUIRED</span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-500/10 text-gray-400 rounded border border-gray-500/20 font-medium">OPTIONAL</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-muted text-xs leading-relaxed">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
