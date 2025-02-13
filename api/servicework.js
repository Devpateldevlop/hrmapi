const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const fs = require('fs');
// const Employee = require('../model/Employee');
const servicework = require('../model/serviceworker'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'PUT','OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors()); // This handles preflight requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

app.use('/api/servicework', express.static(path.join(__dirname, 'public', 'servicework')));

module.exports = app;

app.get('/api/servicework', (req, res) => {
  res.type('application/javascript');
  res.sendFile (path.join(process.cwd(), 'public', 'servicework', 'service.js'););
  console.log(path.join(__dirname, 'public', 'servicework', 'service.js'));
//   import path from 'path';
//    import fs from 'fs';

// export default function handler(req, res) {
//   const filePath = path.join(process.cwd(), 'public', 'servicework', 'service.js');
  
//   // Ensure the file exists before sending it
//   if (fs.existsSync(filePath)) {
//     // Set the correct MIME type for JavaScript files
//     res.setHeader('Content-Type', 'application/javascript');
//     res.status(200).sendFile(filePath);
//   } else {
//     res.status(404).json({ error: 'File not found' });
//   }
// }
});
// app.post('/api/servicework', async (req, res) => {
//     try {
//       const { file } = req.body;
//       const newAddress = new servicework({ file:file });
//       await newAddress.save();
//       res.status(201).json({
//         message: 'service worker created successfully',
//         file: newAddress.file
//       });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });
  
//   app.get('/api/servicework', async (req, res) => {
//     try {
//       const serviceworks = await servicework.find();
  
//       // Parse the stringified JavaScript code into a JSON-like structure.
//       const parsedServiceWorks = serviceworks.map(item => {
//         try {
//           // Attempt to parse the file content as JSON (if it's valid JSON).
//           item.file = JSON.parse(item.file);
//         } catch (err) {
//           console.error('Error parsing the script:', err);
//           item.file = {}; // If parsing fails, set file as an empty object.
//         }
//         return item;
//       });
  
//       res.status(200).json(parsedServiceWorks);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

 

  
//   app.put('/servicework/:id', async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { file } = req.body;
  
//       const updatedAddress = await servicework.findByIdAndUpdate(id, { file }, { new: true });
  
//       if (!updatedAddress) {
//         return res.status(404).json({ error: 'Address not found' });
//       }
  
//       res.status(200).json(updatedAddress);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   });
  
app.post('/api/servicework', (req, res) => {
  const { filename, code } = req.body;
  if (!filename || !code) {
    return res.status(400).send('Filename and code are required');
  }

  const filePath = path.join(__dirname, 'nodejs_crud_mongo', filename);

  fs.writeFile(filePath, code, (err) => {
    if (err) {
      return res.status(500).send('Error saving file');
    }
    res.status(200).send(`File uploaded successfully: ${filename}`);
  });
});

// PUT: Update JavaScript code
  app.put('/api/servicework:filename', (req, res) => {
  const { filename } = req.params;
  const { code } = req.body;

  if (!code) {
    return res.status(400).send('Code is required');
  }

  const filePath = path.join(__dirname, 'nodejs_crud_mongo', filename);

  fs.writeFile(filePath, code, (err) => {
    if (err) {
      return res.status(500).send('Error updating file');
    }
    res.status(200).send(`File updated successfully: ${filename}`);
  });
});




app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
