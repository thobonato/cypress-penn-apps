// const express = require('express');
// const app = express();
// const port = 8080;

// app.use(express.static('public'));

// app.get('/auth', (req, res) => {
//   res.sendFile(__dirname + '/public/auth.html');
// });

// app.get('/result', (req, res) => {
//   const authResult = req.query.result; // 'success' or 'failure'
//   // Redirect back to X.com with the result as a query parameter
//   res.redirect(`https://x.com/?authResult=${authResult}`);
// });

// app.listen(port, () => {
//   console.log(`Local Auth Server listening at http://localhost:${port}`);
// });
const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('public'));

app.get('/auth', (req, res) => {
  res.sendFile(__dirname + '/public/auth.html');
});

app.listen(port, () => {
  console.log(`Local Auth Server listening at http://localhost:${port}`);
});
