// Git/contentGit.js

let isAuthenticating = false;

// Function to handle GitHub's login button
function handleGitHubLoginButton(button) {
  if (button.dataset.authHandlerAttached) {
    console.log('Auth handler already attached to this button.');
    return; // Avoid attaching multiple handlers
  }
  button.dataset.authHandlerAttached = true;

  console.log('Auth handler attached to:', button);

  function onClickHandler(event) {
    if (isAuthenticating) {
      console.log('Authentication already in progress. Action prevented.');
      // If authentication is already in progress, prevent further action
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    isAuthenticating = true;
    console.log('Starting GitHub authentication process');

    event.preventDefault();
    event.stopImmediatePropagation();

    // Trigger custom authentication
    triggerCustomAuthentication().then((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('Authentication successful.');

        // Remove our event listener
        button.removeEventListener('click', onClickHandler, true);

        // Reset the flag
        isAuthenticating = false;

        // Simulate a click on the button
        button.click();
      } else {
        console.log('Authentication failed.');
        // Reset the flag
        isAuthenticating = false;

        alert('Authentication failed. Access denied.');
      }
    });
  }

  button.addEventListener('click', onClickHandler, true); // Use capturing phase
  console.log('Auth handler attached to GitHub login button');
}

// Function to observe DOM changes and apply handlers to GitHub's login button
function observeDOMForGitHubLogin() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check for GitHub login button using multiple selectors
          const loginButton = node.querySelector('.js-sign-in-button') ||
                              node.querySelector('input[name="commit"][value="Sign in"]');
          if (loginButton) {
            console.log('GitHub sign-in button found:', loginButton);
            handleGitHubLoginButton(loginButton);
          }

          // Also check if the node itself is the login button
          if (node.classList.contains('js-sign-in-button') ||
              (node.tagName === 'INPUT' && node.name === 'commit' && node.value === 'Sign in')) {
            console.log('GitHub sign-in button found (direct node):', node);
            handleGitHubLoginButton(node);
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log('Started observing DOM for GitHub login button.');
}

// Function to trigger the custom authentication flow
function triggerCustomAuthentication() {
  return new Promise((resolve) => {
    // Create an iframe to load the authentication UI
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('Git/authGit.html');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    iframe.style.zIndex = '9999';
    iframe.id = 'github-auth-iframe';
    document.body.appendChild(iframe);

    console.log('GitHub authentication iframe added to the page.');

    // Listen for messages from the iframe
    function messageListener(event) {
      if (event.source !== iframe.contentWindow) return;

      if (event.data === 'auth-success') {
        console.log('Received auth-success message from GitHub');
        resolve(true);
        cleanup();
      } else if (event.data === 'auth-failure') {
        console.log('Received auth-failure message from GitHub');
        resolve(false);
        cleanup();
      }
    }

    function cleanup() {
      window.removeEventListener('message', messageListener);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      console.log('GitHub authentication iframe removed.');
    }

    window.addEventListener('message', messageListener);
  });
}

// Start observing the DOM after ensuring it's loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    observeDOMForGitHubLogin();
  });
} else {
  observeDOMForGitHubLogin();
}
