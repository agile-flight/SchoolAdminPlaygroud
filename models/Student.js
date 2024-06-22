const { truncate } = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const studentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    social_security_number: {
        type: Number,
        required: true
    },
    class_enrollment_history: [{
            class_id: {
                type: Schema.Types.ObjectId,
                ref: 'Class',
            },
            semester: {
                type: String,
                required: true
            },
            year: {
                type: Number,
                required: true
            }
        }]
});

// studentSchema is imported as "Student"
module.exports = mongoose.model("Student", studentSchema);
