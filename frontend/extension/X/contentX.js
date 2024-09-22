console.log('contentX.js loaded');

let isAuthenticating = false;
let resolveAuthentication; // Declare resolve function in outer scope

function handleNextButton(button) {
  if (button.dataset.authHandlerAttached) {
    return;
  }
  console.log('Attaching event listener to Next button');
  button.dataset.authHandlerAttached = true;

  function onClickHandler(event) {
    if (isAuthenticating) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    isAuthenticating = true;

    event.preventDefault();
    event.stopImmediatePropagation();

    const usernameInput = document.querySelector('input[name="text"]');
    console.log('Username input:', usernameInput);

    if (!usernameInput) {
      isAuthenticating = false;
      alert('Error: Could not find username field. Please try again.');
      return;
    }

    sessionStorage.setItem('savedUsername', usernameInput.value);

    triggerCustomAuthentication().then((isAuthenticated) => {
      console.log('Authentication result:', isAuthenticated);
      if (isAuthenticated) {
        isAuthenticating = false;

        // Remove event listener
        button.removeEventListener('click', onClickHandler, true);

        // Restore username
        usernameInput.value = sessionStorage.getItem('savedUsername');

        // Submit the form directly
        const form = button.closest('form');
        if (form) {
          form.submit();
        } else {
          // Fallback to clicking the button
          button.click();
        }
      } else {
        isAuthenticating = false;
        alert('Authentication failed. Access denied.');
      }
    });
  }

  button.addEventListener('click', onClickHandler, true);
}

function handleLoginButton(button) {
  if (button.dataset.authHandlerAttached) {
    return;
  }
  console.log('Attaching event listener to Login button');
  button.dataset.authHandlerAttached = true;

  function onClickHandler(event) {
    if (isAuthenticating) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    isAuthenticating = true;

    event.preventDefault();
    event.stopImmediatePropagation();

    const passwordInput = document.querySelector('input[name="password"]');
    console.log('Password input:', passwordInput);

    if (!passwordInput) {
      isAuthenticating = false;
      alert('Error: Could not find password field. Please try again.');
      return;
    }

    sessionStorage.setItem('savedPassword', passwordInput.value);

    triggerCustomAuthentication().then((isAuthenticated) => {
      console.log('Authentication result:', isAuthenticated);
      if (isAuthenticated) {
        isAuthenticating = false;

        // Remove event listener
        button.removeEventListener('click', onClickHandler, true);

        // Restore password
        passwordInput.value = sessionStorage.getItem('savedPassword');

        // Submit the form directly
        const form = button.closest('form');
        if (form) {
          form.submit();
        } else {
          // Fallback to clicking the button
          button.click();
        }
      } else {
        isAuthenticating = false;
        alert('Authentication failed. Access denied.');
      }
    });
  }

  button.addEventListener('click', onClickHandler, true);
}

function observeDOM() {
  console.log('Starting to observe DOM');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const addedNodes = mutation.addedNodes;
      if (addedNodes) {
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Handle "Next" button on username step
            const nextButton = node.querySelector('[data-testid="LoginForm_Next_Button"]');
            if (nextButton) {
              handleNextButton(nextButton);
            }
            if (node.getAttribute && node.getAttribute('data-testid') === 'LoginForm_Next_Button') {
              handleNextButton(node);
            }

            // Handle "Log In" button on password step
            const loginButton = node.querySelector('[data-testid="LoginForm_Login_Button"]');
            if (loginButton) {
              handleLoginButton(loginButton);
            }
            if (node.getAttribute && node.getAttribute('data-testid') === 'LoginForm_Login_Button') {
              handleLoginButton(node);
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function triggerCustomAuthentication() {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('X/authX.html');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '9999';
    iframe.id = 'custom-auth-iframe';
    document.body.appendChild(iframe);

    resolveAuthentication = function (isAuthenticated) {
      const iframe = document.getElementById('custom-auth-iframe');
      if (iframe) {
        document.body.removeChild(iframe);
      }
      resolve(isAuthenticated);
    };
  });
}
// Ensure the message listener is set up only once
if (!window.hasSetupAuthMessageListener) {
  // Listen for messages from the iframe (authX.html)
  window.addEventListener('message', function handler(event) {
    console.log('Message received in content script:', event.data);
    console.log('Event origin:', event.origin);

    // Get the extension's origin
    const extensionOrigin = 'chrome-extension://' + chrome.runtime.id;

    // Accept messages from the extension iframe and localhost
    if (
      event.origin !== window.location.origin &&
      event.origin !== 'http://localhost:8080' &&
      event.origin !== extensionOrigin
    ) {
      console.log('Ignoring message from untrusted origin:', event.origin);
      return;
    }

    if (event.data === 'auth-success') {
      console.log('Authentication successful in content script');
      if (typeof resolveAuthentication === 'function') {
        resolveAuthentication(true);
      }
    } else if (event.data === 'auth-failure') {
      console.log('Authentication failed in content script');
      if (typeof resolveAuthentication === 'function') {
        resolveAuthentication(false);
      }
    }
  });

  window.hasSetupAuthMessageListener = true;
}

observeDOM();
