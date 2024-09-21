// instagram/content.js

console.log("hello instagram running")

let isAuthenticating = false;
let allowNextClick = false; // Flag to allow the next click to proceed

// Function to handle Instagram's login button
function handleInstagramLoginButton(button) {
  if (button.dataset.authHandlerAttached) {
    return; // Prevent attaching multiple handlers
  }
  button.dataset.authHandlerAttached = true;

  button.addEventListener('click', function(event) {
    console.log('Instagram login button clicked');

    if (allowNextClick) {
      console.log('Allowing Instagram click to proceed');
      allowNextClick = false;
      return; // Do not intercept the click
    }

    if (isAuthenticating) {
      console.log('Instagram authentication already in progress');
      // If authentication is already in progress, prevent further action
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    isAuthenticating = true;
    console.log('Starting Instagram authentication process');

    // Prevent default action and further event propagation
    event.preventDefault();
    event.stopImmediatePropagation();

    // Open the custom authentication interface as a modal
    openAuthenticationModal().then(isAuthenticated => {
      isAuthenticating = false;
      console.log(`Authentication result: ${isAuthenticated}`);

      if (isAuthenticated) {
        // Set the flag to allow the next click to proceed
        allowNextClick = true;

        // Programmatically trigger the click to proceed with Instagram's login
        button.click();
      } else {
        alert('Authentication failed. Access denied.');
      }
    });
  }, true); // Use capturing phase
}

// Function to open the custom authentication modal
function openAuthenticationModal() {
  return new Promise((resolve) => {
    // Create an iframe for the authentication modal
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('instagram/auth.html');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '10000';
    iframe.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    iframe.id = 'instagram-auth-iframe';
    document.body.appendChild(iframe);

    console.log('Instagram authentication modal opened');

    // Listen for messages from the auth iframe
    function messageListener(event) {
      if (event.source !== iframe.contentWindow) return;

      if (event.data === 'auth-success') {
        console.log('Received auth-success message from Instagram');
        resolve(true);
        cleanup();
      } else if (event.data === 'auth-failure') {
        console.log('Received auth-failure message from Instagram');
        resolve(false);
        cleanup();
      }
    }

    function cleanup() {
      window.removeEventListener('message', messageListener);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      console.log('Instagram authentication modal closed');
    }

    window.addEventListener('message', messageListener);
  });
}

// Function to observe DOM changes and apply handlers to Instagram's login button
function observeDOMForInstagramLogin() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Specific check for Instagram's login button
          const selector = 'button._acan._acap._acas._aj1-._ap30';
          if (node.matches(selector) || node.querySelector(selector)) {
            const loginButton = node.matches(selector) ? node : node.querySelector(selector);
            console.log('Found Instagram login button');
            handleInstagramLoginButton(loginButton);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log('Started observing DOM for Instagram login button');
}

// Start observing the DOM for Instagram's login button
observeDOMForInstagramLogin();
