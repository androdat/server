'use strict';

//const express = require('express');
import express from 'express';
//const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
//const cors = require('cors');
import cors from 'cors';
//const mongoose = require('mongoose');
import mongoose from 'mongoose';
//const nodeMailer = require('nodemailer')
import nodeMailer from 'nodemailer';

const registrationSchema = mongoose.Schema({
  parentName : String,
  contactNo : Number,
  emailId : String,
  childName : String,
  childAge : Number,
  courseId: String,
  courseName : String,
  timestamp : Number,
  suitDate : String,
  suitTime: String
});

const registrationData = mongoose.model('registrationData', registrationSchema);


//App Config
const app = express();
var port_number = app.listen(process.env.PORT || 8081)
app.use(cors());

//Middleware
app.use(express.json());


//DB Config
const connection_url = "mongodb+srv://admin:admin@cluster0.ia3lg.mongodb.net/notchup?retryWrites=true&w=majority";


mongoose.connect(connection_url, {
    useNewUrlParser : true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}



//To register trial class (args: 8 fields specified in form)
app.post('/registerStudent', async (req, res) => {
    console.log('req.body: ');
    console.log(req.body);
    const dataInput = req.body;
    
    const dateObject = new Date(req.body.timestamp * 1);
    const humanDateFormat = dateObject.toLocaleString(undefined, {
      timeZone: "Asia/Kolkata"
    });
    console.log("timestamp" + req.body.timestamp);
    console.log("Full date" + humanDateFormat);

    var months_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    var my_date = new Date(humanDateFormat);
    var month = months_arr[my_date.getMonth()];
    var day = my_date.getDate();

    var hours = my_date.getHours();
    var minutes = "0" + my_date.getMinutes();

    var convdataTime = hours + ":" + minutes.substr(-2);

    let val = {
      day: day,
      month: month,
      time: tConvert(convdataTime),
      timestamp: req.body.timestamp
    };  
    
    dataInput.suitDate = val.day.toString() + " " + val.month
    dataInput.suitTime = val.time
    
    let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          // should be replaced with real sender's account
          user: '1ms17cs134@gmail.com',
          pass: 'gururajlalaji@123'
      }
    });
  
    let mailOptions = {
          // should be replaced with real recipient's account
        to: req.body.emailId,
        subject: "NotchUp Trial Class Booked successfully",
        text: "Dear " + req.body.parentName + "\n\n" + req.body.childName + "'s" + " class at " + dataInput.suitTime + ", " + dataInput.suitDate +" has been successfully booked."
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Hi")
        //res.status(500).send("error");
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  

    registrationData.create(dataInput, (err, data) => {
      if(err) {
          res.status(500).send(err);
      }else{
          res.status(201).send("Successfully Posted");
      }
  });

});


//Fetch all records from MongoDB (args: healthId)
app.get('/getAllData', (req, res) => {
  registrationData.find({}, (err, data) =>{
      if(err){
          res.status(500).send(err);
      }
      else{
          res.status(200).send(data);
      }
});

});




//Listen
app.listen(port_number, () => console.log(`Listening on port number ${port_number}`)); // Only works with back ticks (variable using ${} notation)
  