chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "pasteToChat") {
      // Megkeressük a lehetséges chatmezőket (textarea vagy szerkeszthető div)
      const selectors = [
        '#prompt-textarea', // ChatGPT
        'div[contenteditable="true"]', // Gemini, Claude, Perplexity
        'textarea', // Általános fallback
        '.ds-textarea-wrapper textarea' // DeepSeek
      ];
  
      let inputField = null;
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el) {
          inputField = el;
          break;
        }
      }
  
      if (inputField) {
        inputField.focus();
        
        // Ha contenteditable div (pl. Gemini/Claude)
        if (inputField.tagName === 'DIV') {
          inputField.innerText = request.text;
        } else {
          // Ha sima textarea
          inputField.value = request.text;
        }
  
        // Események kiváltása, hogy az oldal észrevegye a változást
        const inputEvent = new Event('input', { bubbles: true });
        inputField.dispatchEvent(inputEvent);
        const changeEvent = new Event('change', { bubbles: true });
        inputField.dispatchEvent(changeEvent);
  
        sendResponse({ status: "success" });
      } else {
        sendResponse({ status: "error", message: "Nem találtam a chatmezőt." });
      }
    }
  });