const path = require('path');
const express = require('express');
const publicpath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000
var app = express();

app.use(express.static(publicpath)).listen(port, () => {
  console.log(`Server is up on port ${3000}`);
});

// app.use((req, res, next) => {
//   console.log()
// });
// console.log(publicpath);
