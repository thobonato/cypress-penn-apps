document.getElementById('cancel-auth').addEventListener('click', function () {
  console.log('Cancel button clicked');
  window.parent.postMessage('auth-failure', '*');
});

document.getElementById('proceed-auth').addEventListener('click', function () {
  console.log('Proceed button clicked');
  const authWindow = window.open(
    'http://localhost:8080/auth',
    'LocalAuth',
    'width=600,height=400'
  );

  function messageHandler(event) {
    console.log('Received message from auth window:', event.data);
    console.log('Event origin:', event.origin);

    if (event.origin !== 'http://localhost:8080') {
      console.log('Untrusted origin:', event.origin);
      return; // Ignore messages from unknown origins
    }

    if (event.data === 'auth-success' || event.data === 'auth-failure') {
      console.log('Forwarding message to parent:', event.data);
      window.parent.postMessage(event.data, '*');
      authWindow.close();
      window.removeEventListener('message', messageHandler);
    }
  }

  window.addEventListener('message', messageHandler);
});
