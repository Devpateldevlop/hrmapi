const mongoose = require('mongoose');
const express = require('express');
const calendar = require('../model/calendar'); // Assuming model is in models folder
const cors = require('cors');
const app = express();

app.use(cors({
    origin: '*', // Allow all domains or restrict to your frontend's domain
    methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log('MongoDB connection error: ' + err));

app.get('/api/calendar', async (req, res) => {
    try {
        const getSundaysAndSecondFourthSaturdays = (year) => {
            const result = [];
          
            for (let month = 0; month < 12; month++) {
              const obj = {
                month: (month + 1).toString(),  // Month as a string '1' to '12'
                sundays: [],
                evenSaturdays: []
              };
          
              const daysInMonth = new Date(year, month + 1, 0).getDate();
          
              let saturdayCount = 0; // To track the number of Saturdays in the month
          
              for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const dayOfWeek = date.getDay();
          
                // Check for Sundays (day 0)
                if (dayOfWeek === 0) {
                  const formattedDate = new Date(year, month, day).toLocaleDateString('en-GB').split('/');
                  obj.sundays.push({ "date": `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}` });
                }
          
                // Check for Saturdays (day 6)
                if (dayOfWeek === 6) {
                  saturdayCount++; // Increment Saturday count
                  
                  // If it's the 2nd Saturday, push it
                  if (saturdayCount === 2) {
                    const formattedDate = new Date(year, month, day).toLocaleDateString('en-GB').split('/');
                    obj.evenSaturdays.push({ "date": `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}` });
                  }
          
                  // If it's the 4th Saturday, push it
                  if (saturdayCount === 4) {
                    const formattedDate = new Date(year, month, day).toLocaleDateString('en-GB').split('/');
                    obj.evenSaturdays.push({ "date": `${formattedDate[2]}-${formattedDate[1]}-${formattedDate[0]}` });
                  }
                }
              }
          
              result.push(obj);
            }
          
            return result;
          };
          
          const year = new Date().getFullYear();
          const sundaysAndSecondFourthSaturdays = getSundaysAndSecondFourthSaturdays(year);
        
        const calendar1 = await calendar.find();
        res.status(200).json({ message: 'calendar fetched successfully', data: calendar1 ,
        nonworkingday:sundaysAndSecondFourthSaturdays
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching calendar' });
    }
});
app.post('/api/calendar', async (req, res) => {
    const { date, type, name } = req.body;
    const calendar2 = await calendar.find();
    try {
        const updatedCalendar = await calendar.findOneAndUpdate(
            { date },  
            { type, name },  
            { new: true, upsert: true }  
          );
      res.status(201).json({ message: updatedCalendar ? 'LeaveHistory updated successfully' : 'LeaveHistory added successfully', data: calendar2 });
    } catch (err) {
      res.status(500).json({ error: 'Error adding LeaveHistory' });
    }
  });
  
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
