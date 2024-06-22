const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const classSchema = new Schema({
    subject_id: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    student_ids: [{
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }],
});

// classSchema is imported as "Class"
module.exports = mongoose.model("Class", classSchema);