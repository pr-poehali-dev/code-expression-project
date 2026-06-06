export function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:700;margin:14px 0 5px;color:inherit">$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2 style="font-size:17px;font-weight:700;margin:18px 0 7px;color:inherit">$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1 style="font-size:20px;font-weight:700;margin:20px 0 9px;color:inherit">$1</h1>')
    .replace(/^---$/gm, '<hr style="border:none;border-top:1.5px solid rgba(0,0,0,0.1);margin:16px 0">')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/~~(.+?)~~/g,     '<s>$1</s>')
    .replace(/^&gt; (.+)$/gm, '<blockquote style="border-left:3px solid currentColor;opacity:0.7;margin:8px 0;padding:2px 12px;font-style:italic">$1</blockquote>')
    .replace(/^\d+\. (.+)$/gm, '<li style="margin:3px 0">$1</li>')
    .replace(/^[-*] (.+)$/gm,  '<li style="margin:3px 0">$1</li>')
    .replace(/(<li[^>]*>.*?<\/li>\n?)+/gs, m => `<ul style="margin:8px 0;padding-left:20px">${m}</ul>`)
    .replace(/\n\n+/g, '</p><p style="margin:8px 0">')
    .replace(/\n/g, '<br>');
}
