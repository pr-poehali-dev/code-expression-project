export default function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  const renderInline = (str: string): React.ReactNode => {
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);  
    return parts.map((p, idx) => {
      if (p.startsWith("**") && p.endsWith("**"))
        return <strong key={idx} style={{ fontWeight: 700, color: "#0F172A" }}>{p.slice(2, -2)}</strong>;
      if (p.startsWith("*") && p.endsWith("*"))
        return <em key={idx} style={{ fontStyle: "italic" }}>{p.slice(1, -1)}</em>;
      if (p.startsWith("`") && p.endsWith("`"))
        return <code key={idx} style={{ background: "#f1f5f9", borderRadius: 4, padding: "1px 6px", fontSize: 13, fontFamily: "monospace" }}>{p.slice(1, -1)}</code>;
      return p;
    });
  };

  while (i < lines.length) {
    const line = lines[i];
    const h3 = line.match(/^###\s+(.*)/);
    const h2 = line.match(/^##\s+(.*)/);
    const h1 = line.match(/^#\s+(.*)/);
    const li = line.match(/^[-*]\s+(.*)/);
    const oli = line.match(/^\d+\.\s+(.*)/);
    const hr = line.match(/^---+$/);
    const bq = line.match(/^>\s*(.*)/);
    const code = line.match(/^```/);

    if (h3) {
      elements.push(<div key={i} style={{ fontSize: 14, fontWeight: 700, color: "#334155", margin: "8px 0 4px" }}>{renderInline(h3[1])}</div>);
    } else if (h2) {
      elements.push(<div key={i} style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "10px 0 5px" }}>{renderInline(h2[1])}</div>);
    } else if (h1) {
      elements.push(<div key={i} style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "12px 0 6px" }}>{renderInline(h1[1])}</div>);
    } else if (hr) {
      elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "12px 0" }} />);
    } else if (bq) {
      elements.push(<blockquote key={i} style={{ borderLeft: "3px solid #cbd5e1", margin: "8px 0", paddingLeft: 12, color: "#64748b" }}>{renderInline(bq[1])}</blockquote>);
    } else if (code) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].match(/^```/)) { codeLines.push(lines[i]); i++; }
      elements.push(<pre key={i} style={{ background: "#f1f5f9", borderRadius: 8, padding: "10px 14px", fontSize: 13, overflowX: "auto", margin: "8px 0", fontFamily: "monospace" }}><code>{codeLines.join("\n")}</code></pre>);
    } else if (li) {
      const items: string[] = [li[1]];
      while (i + 1 < lines.length && lines[i + 1].match(/^[-*]\s+(.*)/)) {
        i++; items.push(lines[i].match(/^[-*]\s+(.*)/)![1]);
      }
      elements.push(<ul key={i} style={{ margin: "4px 0 8px", paddingLeft: 20 }}>{items.map((it, idx) => <li key={idx} style={{ marginBottom: 4, lineHeight: 1.65 }}>{renderInline(it)}</li>)}</ul>);
    } else if (oli) {
      const items: string[] = [oli[1]];
      while (i + 1 < lines.length && lines[i + 1].match(/^\d+\.\s+(.*)/)) {
        i++; items.push(lines[i].match(/^\d+\.\s+(.*)/)![1]);
      }
      elements.push(<ol key={i} style={{ margin: "4px 0 8px", paddingLeft: 20 }}>{items.map((it, idx) => <li key={idx} style={{ marginBottom: 4, lineHeight: 1.65 }}>{renderInline(it)}</li>)}</ol>);
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i} style={{ margin: "0 0 6px", lineHeight: 1.75 }}>{renderInline(line)}</p>);
    }
    i++;
  }

  return <div>{elements}</div>;
}
