// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openAuthTab") {
    chrome.tabs.create({url: request.url}, (tab) => {
      console.log("New auth tab opened:", tab.id);
      sendResponse({success: true, tabId: tab.id});
    });
    return true; // Indicates we will send a response asynchronously
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && changeInfo.url.startsWith("http://localhost:8000/auth-result")) {
    const url = new URL(changeInfo.url);
    const success = url.searchParams.get("success") === "true";
    
    chrome.tabs.sendMessage(tabId, {action: "authResult", success: success});
    chrome.tabs.remove(tabId);
  }
});