const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const filePath = path.join(__dirname, '.', 'public', 'servicework', 'service.js');
  
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file');
    }
    
    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(data);
  });
};
