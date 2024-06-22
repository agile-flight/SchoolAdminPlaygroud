/**
 * Routes for managing students, teachers, grades, and classes.
 * 
 * Test route:
 * GET /test
 * - Returns a JSON object confirming that the test route is working.
 * 
 * Register a new student:
 * POST /register/student
 * Request Body: { name, major, social_security_number }
 * - Creates a new student if the social security number is not already in use.
 * - Returns 201 with the created student object if successful.
 * - Returns 400 if the student with the same social security number already exists.
 * 
 * Register a new teacher:
 * POST /register/teacher
 * Request Body: { name, social_security_number, subjectsTaught }
 * - Creates a new teacher if the social security number is not already in use.
 * - Returns 201 with the created teacher object if successful.
 * - Returns 400 if the teacher with the same social security number already exists.
 * 
 * Add a new grade:
 * POST /gradebook
 * Request Body: { student_id, subject_id, grade, semester, year }
 * - Creates a new grade entry for a student.
 * - Returns 201 with the created grade object.
 * 
 * Calculate GPA for a specific semester and year:
 * GET /students/:studentId/gpa/:semester/:year
 * - Calculates the GPA for a student based on the specified semester and year.
 * - Returns 200 with { gpa } if successful.
 * - Returns 404 if the student or grades for the specified semester/year are not found.
 * 
 * Calculate cumulative GPA for a student:
 * GET /students/:studentId/gpa
 * - Calculates the cumulative GPA for a student across all semesters.
 * - Returns 200 with { studentId, gpa } if successful.
 * - Returns 404 if no grades are found for the student.
 * 
 * Update a grade:
 * PUT /grades/:gradeId
 * Request Body: { grade }
 * - Updates the grade value for a specific grade entry.
 * - Returns 200 with the updated grade object.
 * - Returns 404 if the grade entry is not found.
 * 
 * Get all grades for a student:
 * GET /students/:studentId/grades
 * - Retrieves all grades associated with a specific student.
 * - Returns 200 with an array of grade objects.
 * - Returns 404 if the student is not found.
 * 
 * List all classes taught by a teacher:
 * GET /teachers/:teacherId/classes
 * - Retrieves all classes taught by a specific teacher.
 * - Returns 200 with an array of class objects.
 * - Returns 404 if the teacher is not found.
 * 
 * Enroll students in a class:
 * PUT /classes/:classId/enroll
 * Request Body: { student_ids }
 * - Enrolls students into a specific class.
 * - Returns 200 with the updated class object including enrolled students.
 * - Returns 404 if any student in student_ids is not found or if the class is not found.
 * 
 * Drop a student from a class:
 * DELETE /classes/:classId/drop
 * Request Body: { student_id }
 * - Removes a specific student from a class.
 * - Returns 200 with the updated class object after dropping the student.
 * - Returns 404 if the class or student is not found or if the student is not enrolled in the class.
 * 
 * Get all grades for a class:
 * GET /grades/class/:classId
 * - Retrieves all grades associated with a specific class.
 * - Returns 200 with an array of grade objects.
 * - Returns 404 if no grades are found for the class.
 */

// Import necessary modules and initialize router
const express = require("express");
const router = express.Router();
const handleError = require("../../utils/errorHandler");
const { getCurrentSemesterAndYear,  isPastSemester} = require('../../helpers/helpers');

const { Class, Grade, Student, Subject, Teacher } = require('../../models');

router.get("/test", (req, res) => {
    res.status(200).json({ message: "Test route working!" });
});

const gradeToPoint = {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
};

router.post("/register/student", async (req, res) => {
    try {
        const existingStudentSocialSecurityNumber = 
            req.body.social_security_number;
        const existingStudent = 
            await Student.findOne({social_security_number: existingStudentSocialSecurityNumber })
        if (existingStudent) {
            return res.status(400).json({ message: "Student is already in the database" });
        } else {
            const newStudent = new Student(req.body);
            await newStudent.save()
            return res.status(201).json(newStudent);
        }
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.post("/register/teacher", async (req, res) => {
    try {
        const existingTeacherSocialSecurityNumber = 
            req.body.social_security_number;
        const existingTeacher = 
            await Teacher.findOne({social_security_number: existingTeacherSocialSecurityNumber })
        if (existingTeacher) {
            return res.status(400).json({ message: "Teacher is already in the database" });
        } else {
            const newTeacher = new Teacher(req.body);
            await newTeacher.save()
            return res.status(201).json(newTeacher);
        }
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.post("/gradebook", async (req, res) => {
    try {
        const newGrade = new Grade(req.body);
        await newGrade.save()
        return res.status(201).json(newGrade);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.get("/students/:studentId/gpa/:semester/:year", async (req, res) => {
    const { studentId, semester, year } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!semester || !year) {
            return res.status(404).json({ message: "Invalid semester or year" });
        }

        const grades = await Grade.find({ 
            student_id: studentId, 
            semester: semester, 
            year: parseInt(year) 
        });

        if (grades.length === 0) {
            return res.status(404).json({ message: "No grades found for the specified semester and year" });
        }

        // Calculate the GPA
        let totalPoints = 0;
        for (let i = 0; i < grades.length; i++) {
        const grade = grades[i];
        totalPoints += gradeToPoint[grade.grade];
        }   
        const gpa = totalPoints / grades.length;

        res.status(200).json({ gpa });
    } catch (err) {
        console.log(error);
        handleError(error, res);
    }
});

router.get("/students/:studentId/gpa", async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const grades = await Grade.find({ student_id: studentId });

        let totalPoints = 0;
        let totalCredits = 0; 

        for (let i = 0; i < grades.length; i++) {
            const grade = grades[i];
            totalPoints += gradeToPoint[grade.grade];
            totalCredits++; 
        }

        if (totalCredits === 0) {
            return res.status(404).json({ message: "No grades found for the student" });
        }

        const gpa = totalPoints / totalCredits;

        res.status(200).json({ studentId, gpa });
    } catch (err) {
        console.log(error);
        handleError(error, res);
    }
});

router.put("/grades/:gradeId", async (req, res) => {
    const { gradeId } = req.params;
    const { grade } = req.body; 

    try {
        const updatedGrade = await Grade.findByIdAndUpdate(
            gradeId,
            { grade },
            { new: true } 
        );

        if (!updatedGrade) {
            return res.status(404).json({ message: "Grade not found" });
        }

        res.status(200).json(updatedGrade);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.get("/students/:studentId/grades", async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const grades = await Grade.find({ student_id: studentId });

        res.status(200).json(grades);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.get("/teachers/:teacherId/classes", async (req, res) => {
    const { teacherId } = req.params;

    try {
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        const classes = await Class.find({ teacher_id: teacherId });

        res.status(200).json(classes);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

router.put("/classes/:classId/enroll", async (req, res) => {
    const { classId } = req.params;
    const { student_ids } = req.body; 

    try {
        const students = [];
        for (let i = 0; i < student_ids.length; i++) {
            const student = await Student.findById(student_ids[i]);
            if (!student) {
                return res.status(404).json({ message: `Student with ID ${student_ids[i]} not found` });
            }
            students.push(student);
        }

        const existingClass = await Class.findById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        const updatedStudentIds = existingClass.student_ids.concat(student_ids);
        existingClass.student_ids = updatedStudentIds;

        const updatedClass = await existingClass.save();
        res.status(200).json(updatedClass);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});


router.delete("/classes/:classId/drop", async (req, res) => {
    const { classId } = req.params;
    const { student_id } = req.body;

    try {
        const existingClass = await Class.findById(classId);
        if (!existingClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        const studentIndex = existingClass.student_ids.indexOf(student_id);
        if (studentIndex === -1) {
            return res.status(404).json({ message: "Student not enrolled in the class" });
        }

        existingClass.student_ids.splice(studentIndex, 1);
        await existingClass.save();

        res.status(200).json(existingClass);
    } catch (error) {

        console.log(error);
        handleError(error, res);
    }
});

router.get("/grades/class/:classId", async (req, res) => {
    const { classId } = req.params;

    try {
        const grades = await Grade.find({ class_id: classId });

        if (grades.length === 0) {
            return res.status(404).json({ message: "No grades found for this class" });
        }
        res.status(200).json({ grades });
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
});

module.exports = router;