const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const gradeSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'Students',
    },
    subject_id: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
    },
    grade: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
});

// gradeSchema is imported as "Grade"
module.exports = mongoose.model("Grade", gradeSchema);