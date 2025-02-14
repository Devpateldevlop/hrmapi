// api/showServiceFile.js

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Define the path to the service.js file
  const filePath = path.join(__dirname, '../public/servicework/service.js');

  // Read the file contents
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file'+err);
    }

    // Set the response header for plain text (JavaScript)
    res.setHeader('Content-Type', 'application/javascript');
    res.status(200).send(data);
  });
};
