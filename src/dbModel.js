import mongoose from 'mongoose';

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

//This will create a collection patientData based on patientSchema
module.exports = mongoose.model('registrationData', registrationSchema); 
