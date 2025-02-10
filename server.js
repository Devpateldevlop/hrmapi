const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes'); 
const User = require('./model/User');
const cors = require('cors'); 
const punchHistory = require('./model/PunchHistory');

const app = express();
const corsOptions = {
  origin: '*',  // Replace with your frontend domain or URL
  methods: ['GET', 'POST', 'DELETE'],  // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Specify allowed headers
};

app.use(cors(corsOptions));  // Use the customized CORS options

// app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://pdev5771:rxHFzG2xPEkkocvM@cluster0.bso1d.mongodb.net')
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log('MongoDB connection error: ' + err));

// app.use('/api', userRoutes); 


app.get('/PunchHistory', async (req, res) => {
  try {
    const users = await punchHistory.find();  
    res.json(users); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

app.post('/PunchHistory', async (req, res) => {
  const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;

  try {
    const newUser = new punchHistory({ date, punchIn, punchOut, Inaddress, Outaddress});
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.delete('/PunchHistory/:date', async (req, res) => {
  try {
    const deletedUser = await punchHistory.findByIdAndDelete(req.params.date);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Punch not found' });
    }
    res.status(200).json({ message: 'Punch deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});













app.get('/', (req, res) => {
    res.send('Hello, welcome to the API!');
  });

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  
    res.json(users); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;

  try {
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
