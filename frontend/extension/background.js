chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  console.log('External message received in background script:', message);
  if (message === 'auth-success' || message === 'auth-failure') {
    // Forward the message to content scripts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { authResult: message });
      }
    });
    sendResponse({ status: 'ok' });
  } else {
    sendResponse({ status: 'unknown message' });
  }
});
