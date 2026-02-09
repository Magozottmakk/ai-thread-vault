// AI Thread Vault - popup.js v1.7 (Full Integrated Version)

// --- 1. MENTÉS FUNKCIÓ ---
document.getElementById('saveBtn').addEventListener('click', async () => {
  const format = document.getElementById('formatSelect').value;
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: universalScrapeAndDownload,
    args: [format]
  });
});

function universalScrapeAndDownload(format) {
  let messages = [];
  const host = window.location.hostname;
  let aiName = "AI";

  // AI azonosítás
  if (host.includes('chatgpt.com')) aiName = "ChatGPT";
  else if (host.includes('claude.ai')) aiName = "Claude";
  else if (host.includes('gemini.google.com')) aiName = "Gemini";
  else if (host.includes('deepseek.com')) aiName = "DeepSeek";

  // Tartalom szelektorok
  const selectors = {
    'chatgpt.com': '.agent-turn, .user-turn, .markdown',
    'claude.ai': '.font-claude-message, [data-testid="user-message"]',
    'gemini.google.com': '.message-content, .model-response-text, .query-text',
    'deepseek.com': '.ds-markdown, .fbb7306e'
  };

  let currentSelector = selectors[Object.keys(selectors).find(key => host.includes(key))] || 'p, div';
  const elements = document.querySelectorAll(currentSelector);
  
  elements.forEach(el => {
    const isUser = el.classList.contains('user-turn') || 
                   el.classList.contains('query-text') || 
                   el.getAttribute('data-testid')?.includes('user') ||
                   el.closest('[data-testid*="user"]');
    
    const text = el.innerText.trim();
    if (text.length > 0) {
      messages.push({
        role: isUser ? "Felhasználó" : "AI",
        text: text
      });
    }
  });

  if (messages.length === 0) {
    alert("Nem találtam kimenthető tartalmat.");
    return;
  }

  let finalContent = "";
  let mimeType = "text/plain";
  const dateStr = new Date().toISOString().split('T')[0];

  switch (format) {
    case 'md':
      finalContent = messages.map(m => `### ${m.role}:\n${m.text}`).join('\n\n---\n\n');
      mimeType = "text/markdown";
      break;
    case 'html':
      const htmlRows = messages.map(m => `
        <div class="message-card ${m.role === 'AI' ? 'ai' : 'user'}">
          <div class="role-badge">${m.role}</div>
          <div class="text-content">${m.text.replace(/\n/g, '<br>')}</div>
        </div>`).join('');
      finalContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${aiName} Mentés</title><style>:root { --bg: #ffffff; --text: #1a1a1a; --card-user: #e3f2fd; --card-ai: #f5f5f5; --accent: #4285f4; } @media (prefers-color-scheme: dark) { :root { --bg: #121212; --text: #e0e0e0; --card-user: #1e3a5f; --card-ai: #2a2a2a; } } body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; background: var(--bg); color: var(--text); max-width: 900px; margin: 40px auto; padding: 20px; } .message-card { margin-bottom: 20px; padding: 15px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); } .user { background: var(--card-user); margin-left: 40px; border-left: 5px solid var(--accent); } .ai { background: var(--card-ai); margin-right: 40px; border-left: 5px solid #34a853; } .role-badge { font-weight: bold; font-size: 11px; text-transform: uppercase; margin-bottom: 8px; opacity: 0.6; } .text-content { white-space: pre-wrap; font-size: 15px; } .footer { text-align: center; margin-top: 40px; font-size: 12px; opacity: 0.5; }</style></head><body><h1>${aiName} Mentés</h1><div class="chat-container">${htmlRows}</div></body></html>`;
      mimeType = "text/html";
      break;
    case 'json':
      finalContent = JSON.stringify({ ai: aiName, date: dateStr, messages: messages }, null, 2);
      mimeType = "application/json";
      break;
    default:
      finalContent = messages.map(m => `${m.role.toUpperCase()}:\n${m.text}`).join('\n\n' + '='.repeat(30) + '\n\n');
      break;
  }

  const blob = new Blob([finalContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${aiName} - ${dateStr}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}

// --- 2. INTELLIGENS VISSZATÖLTÉS FUNKCIÓ ---
const fileInput = document.getElementById('fileInput');
document.getElementById('loadBtn').addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    let rawText = e.target.result;
    
    // JSON feldolgozás
    if (file.name.endsWith('.json')) {
      try {
        const data = JSON.parse(rawText);
        if (data.messages) {
          rawText = data.messages.map(m => `### ${m.role}:\n${m.text}`).join('\n\n---\n\n');
        }
      } catch (err) { console.error("JSON parse hiba"); }
    }

    const finalPrompt = `Mellékeltem egy korábbi beszélgetésünk mentését markdown formátumban. \n\nFONTOS INSTRUKCIÓ: \nMost még NE válaszolj a mentésben található kérdésekre vagy témákra. \nElső lépésként csak elemezd a kapott adatokat, jelezd nekem, hogy minden információt sikeresen feldolgoztál, és kérdezd meg, hogyan folytassuk a munkát.\n\nA mentett beszélgetés:\n---\n${rawText}`;

    // Határérték: 15.000 karakter (~3-4000 token)
    const CHAR_LIMIT = 15000;

    if (rawText.length <= CHAR_LIMIT) {
      // Automatikus beillesztés megkísérlése
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "pasteToChat", text: finalPrompt }, (response) => {
          if (chrome.runtime.lastError || (response && response.status === "error")) {
            copyToClipboardFallback(finalPrompt, "Az automatikus beillesztés nem sikerült. Az adatok a vágólapra kerültek, nyomj Ctrl+V-t!");
          } else {
            window.close(); // Siker esetén popup bezárása
          }
        });
      }
    } else {
      // Fájlcsatolási javaslat túl hosszú tartalom esetén
      const fileInstruction = `Csatoltam egy korábbi beszélgetésünk mentését ("${file.name}"). \n\nFONTOS: Most még NE válaszolj a mentésben található kérdésekre. Első lépésként csak olvasd el és elemezd a fájl tartalmát, jelezd, ha megvagy, és kérdezd meg, hogyan folytassuk a munkát.`;
      copyToClipboardFallback(fileInstruction, "⚠️ Túl hosszú szöveg (" + rawText.length + " karakter).\n\nAz instrukciók a vágólapra kerültek!\n1. Nyomj Ctrl+V-t a chatben.\n2. CSATOLD a mentett fájlt is!\n3. Küldd el.");
    }
    
    event.target.value = null;
  };
  reader.readAsText(file);
});

async function copyToClipboardFallback(text, alertMsg) {
  window.focus();
  try {
    await navigator.clipboard.writeText(text);
    alert(alertMsg);
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert(alertMsg);
  }
}