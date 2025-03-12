const mongoose = require('mongoose');
const express = require('express');
const Employee = require('../model/Employee');
const PunchHistory = require('../model/PunchHistory'); 
// const Leavehistory = require('../model/Leavehistory'); 
const cors = require('cors');
const calendar = require('../model/calendar');
const axios = require('axios');
const schedule = require('node-schedule');
const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT','OPTIONS'], 
    allowedHeaders: ['Content-Type'], 
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

app.get('/api/employee/PunchHistory', async (req, res) => {
    try {
        const employeeCode = req.query.employeeCode;
        if (!employeeCode) {
            return res.status(400).json({ message: 'Employee code is required' });
        }
        const employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('punchHistory');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        employee.masterholiday = await calendar.find();

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
        //   console.log(sundaysAndSecondFourthSaturdays);
          
          sundaysAndSecondFourthSaturdays.forEach(element => {
          element.sundays.forEach(element1 => {
            var objsatsun={
                type: "nonWorking",
                name: "non-Working Day",
                date: element1.date
            }
            employee.masterholiday.push(objsatsun);
          });
          element.evenSaturdays.forEach(element1 => {
            var objsatsun={
                type: "nonWorking",
                name: "non-Working Day",
                date: element1.date
            }
            employee.masterholiday.push(objsatsun);
          });
        });

        res.status(200).json({
            message: 'Punch history fetched successfully',
            punchHistory: employee.punchHistory,
            masterholiday: employee.masterholiday
        });

        var arra=[]
        employee.punchHistory.forEach(element => { 
            if(new Date().getMonth() == new Date(element.date).getMonth() && new Date().getFullYear() == new Date(element.date).getFullYear()){
                  if(element.punchIn != null && element.punchOut != null || element.punchIn != "" && element.punchOut != ""){
                    arra.push(element);
                  }
            }
        });

        employee.masterholiday.forEach(elementq => { 
            if(new Date().getMonth() == new Date(elementq.date).getMonth() && new Date().getFullYear() == new Date(elementq.date).getFullYear()){
                    if(elementq.type == "nonWorking" ||  elementq.type == "HoliDay"){
                        arra.push(elementq);
                    }
            }
        });
        // const lh = await Employee.findOne({ EmployeeCode: employeeCode }).populate('leaveHistory');

        lh.leaveHistory.forEach(elementq => {
            if (elementq.LeaveType != "Leave Without Pay" && elementq.stat == "Approved") {
                if(new Date().getMonth() == new Date(elementq.FromDate).getMonth() && new Date().getFullYear() == new Date(elementq.FromDate).getFullYear()){
                    // arra.push(elementq);
                    const getDaysArray = (start, end) => {
                        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
                            arr.push(new Date(dt));
                        }
                        return arr;
                    };
                    const daysBetween = getDaysArray(new Date(elementq.FromDate), new Date(elementq.ToDate));
                    console.log(daysBetween)    

                }   
            }
        })

        var salary = employee.profile.salary 
        const daysInMonth = new Date(year, new Date().getMonth() + 1, 0).getDate();
        const dailySalary = salary / daysInMonth
        const workedSalary = arra.length * dailySalary;
        // console.log(daysInMonth)



    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }

});

const checkPunchOut = async () => {
    try {
        const employees = await Employee.find().populate('punchHistory');
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        for (const employee of employees) {
            const todayPunch = employee.punchHistory.find(punch => punch.date === currentDate);
            if (todayPunch && !todayPunch.punchOut) {
                // Get live location at 7:00 PM
                const liveLocationResponse = await axios.get('https://api.livelocation.com/getLocation', {
                    params: {
                        employeeCode: employee.EmployeeCode,
                        time: '19:00'
                    }
                });

                const liveLocation = liveLocationResponse.data.location;

                todayPunch.punchOut = '23:00'; // Set punchOut time to 11:00 PM
                todayPunch.Outaddress = liveLocation;

                await todayPunch.save();
                console.log(`Punch out data updated for employee ${employee.EmployeeCode}`);
            }
        }
    } catch (err) {
        console.error('Error checking punch out:', err);
    }
};

// Call the function at 11:00 PM every day
schedule.scheduleJob('0 23 * * *', checkPunchOut);

app.post('/api/employee/PunchHistory', async (req, res) => {
    try {
        const { employeeCode } = req.query;
        const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;
        
        const employee = await Employee.findOne({ EmployeeCode: employeeCode });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        employee.masterholiday = await calendar.find();
        
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
        //   console.log(sundaysAndSecondFourthSaturdays);
          
          sundaysAndSecondFourthSaturdays.forEach(element => {
          element.sundays.forEach(element1 => {
            var objsatsun={
                type: "nonWorking",
                name: "non-Working Day",
                date: element1.date
            }
            employee.masterholiday.push(objsatsun);
          });
          element.evenSaturdays.forEach(element1 => {
            var objsatsun={
                type: "nonWorking",
                name: "non-Working Day",
                date: element1.date
            }
            employee.masterholiday.push(objsatsun);
          });
        });
        employee.masterholiday.forEach(element => {
            if(element.date === date){
                if(element.type == "nonWorking"){
                res.status(500).json({ message: 'Selcted Date Is Non-Working Day' });
                return
            }else if(element.type == "HoliDay"){
                res.status(500).json({ message: 'Selcted Date Is HoliDay' });
            }
            }
        });

    
        // var employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('punchHistory');
  
        const newPunchHistory = new PunchHistory({
            date,
            punchIn,
            punchOut,
            Inaddress,
            Outaddress,
            employee: employee._id  
        });

        const savedPunchHistory = await newPunchHistory.save();
        employee.punchHistory.push(savedPunchHistory._id);
        await employee.save();

        if(employeeCode == 143) {
            const employee = await Employee.findOne({ EmployeeCode: employeeCode }).populate('punchHistory');
            const savedPunchHistory=  employee

            res.status(201).json({
                message: 'Punch history created successfully',
                punchHistory: savedPunchHistory
            });
        }

        res.status(201).json({
            message: 'Punch history created successfully',
            punchHistory: savedPunchHistory
            
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
});

app.put('/api/employee/PunchHistory', async (req, res) => {
    try {
        const { punchHistoryId } = req.query; 
        const { employeeCode } = req.query;    

        const { date, punchIn, punchOut, Inaddress, Outaddress } = req.body;

        // Validate required fields
        // if (!date || !punchIn || !punchOut || !Inaddress || !Outaddress) {
        //     return res.status(400).json({ message: 'Missing required fields' });
        // }

        // Find the employee by employeeCode
        const employee = await Employee.findOne({ EmployeeCode: employeeCode });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        employee.masterholiday = await calendar.find();
        
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
        //   console.log(sundaysAndSecondFourthSaturdays);
          
          sundaysAndSecondFourthSaturdays.forEach(element => {
          element.sundays.forEach(element1 => {
            var objsatsun={
                type: "nonWorking",
                name: "non-Working Day",
                date: element1.date
            }
            employee.masterholiday.push(objsatsun);
          });
          element.evenSaturdays.forEach(element1 => {
            var objsatsun={
                type: "nonWorking",
                name: "non-Working Day",
                date: element1.date
            }
            employee.masterholiday.push(objsatsun);
          });
        });
        employee.masterholiday.forEach(element => {
            if(element.date === date){
                if(element.type == "nonWorking"){
                res.status(500).json({ message: 'Selcted Date Is Non-Working Day' });
            }else if(element.type == "HoliDay"){
                res.status(500).json({ message: 'Selcted Date Is HoliDay' });
            }
            }
        });
        // Find the punch history by its ID and update it
        const punchHistory = await PunchHistory.findById(punchHistoryId);

        if (!punchHistory) {
            return res.status(404).json({ message: 'Punch history not found' });
        }

        if (date) punchHistory.date = date;
        if (punchIn) punchHistory.punchIn = punchIn;
        if (punchOut) punchHistory.punchOut = punchOut;
        if (Inaddress) punchHistory.Inaddress = Inaddress;
        if (Outaddress) punchHistory.Outaddress = Outaddress;
        
        const updatedPunchHistory = await punchHistory.save();
       
        res.status(200).json({
            message: 'Punch history updated successfully',
            punchHistory: updatedPunchHistory
        });
         
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err });
    }
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
