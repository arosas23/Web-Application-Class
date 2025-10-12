// Read File example
const fs = require('fs');

fs.readFile('./data/input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});