let isAuthenticating = false;

// Function to handle login buttons
function handleLoginButton(button) {
  if (button.dataset.authHandlerAttached) {
    return; // Avoid attaching multiple handlers
  }
  button.dataset.authHandlerAttached = true;

  function onClickHandler(event) {
    if (isAuthenticating) {
      // If authentication is already in progress, prevent further action
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    isAuthenticating = true;

    event.preventDefault();
    event.stopImmediatePropagation();

    // Trigger custom authentication
    triggerCustomAuthentication().then((isAuthenticated) => {
      if (isAuthenticated) {
        // Remove our event listener
        button.removeEventListener('click', onClickHandler, true);

        // Reset the flag
        isAuthenticating = false;

        // Simulate a click on the button
        button.click();
      } else {
        // Reset the flag
        isAuthenticating = false;

        alert('Authentication failed. Access denied.');
      }
    });
  }

  button.addEventListener('click', onClickHandler, true); // Use capturing phase
}

// Function to observe DOM changes
function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const addedNodes = mutation.addedNodes;
      if (addedNodes) {
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check for login button
            const loginButton = node.querySelector('button.bubble-element.Button.clickable-element');
            if (loginButton) {
              handleLoginButton(loginButton);
            }

            // Also check if the node itself is the login button
            if (node.matches && node.matches('button.bubble-element.Button.clickable-element')) {
              handleLoginButton(node);
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to trigger the custom authentication flow
function triggerCustomAuthentication() {
  return new Promise((resolve) => {
    // Create an iframe to load the authentication UI
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('Incomee/authIncomee.html');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.id = 'custom-auth-iframe';
    document.body.appendChild(iframe);

    // Listen for messages from the iframe
    window.addEventListener('message', function handler(event) {
      if (event.data === 'auth-success') {
        window.removeEventListener('message', handler);
        const iframe = document.getElementById('custom-auth-iframe');
        if (iframe) {
          document.body.removeChild(iframe);
        }
        resolve(true);
      } else if (event.data === 'auth-failure') {
        window.removeEventListener('message', handler);
        const iframe = document.getElementById('custom-auth-iframe');
        if (iframe) {
          document.body.removeChild(iframe);
        }
        resolve(false);
      }
    });
  });
}

// Start observing the DOM
observeDOM();
