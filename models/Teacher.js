const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    social_security_number: {
        type: Number,
        required: true
    },
    subjectsTaught: {
        type: [String],
        required: true,
    }
});

module.exports = mongoose.model("Teacher", teacherSchema);