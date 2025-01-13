const express = require('express');
const mongoose = require('mongoose'); // Add mongoose import
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        console.log('All students:', students);
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route GET /api/students/dashboard/:id
// @desc Get student dashboard data
router.get('/dashboard/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        console.log('Attempting to fetch dashboard for student ID:', studentId);

        // Get student data
        const rawStudent = await mongoose.connection.db
            .collection('students')
            .findOne({ _id: studentId });

        if (!rawStudent) {
            return res.status(404).json({ 
                message: 'Student not found',
                providedId: studentId
            });
        }

        // Get classrooms with populated data
        const classrooms = await mongoose.connection.db
            .collection('classrooms')
            .aggregate([
                { $match: { students: studentId } },
                {
                    $lookup: {
                        from: 'teachers',
                        localField: 'teacher',
                        foreignField: '_id',
                        as: 'teacherData'
                    }
                },
                {
                    $lookup: {
                        from: 'subjects',
                        localField: 'subjects',
                        foreignField: '_id',
                        as: 'subjectData'
                    }
                },
                {
                    $project: {
                        name: 1,
                        students: 1,
                        teacher: { $arrayElemAt: ['$teacherData', 0] },
                        subjects: '$subjectData'
                    }
                }
            ]).toArray();

        console.log('Found classrooms:', classrooms);

        // Get recommended chapters from subjects
        const recommendedChapters = await mongoose.connection.db
            .collection('subjects')
            .aggregate([
                { 
                    $match: { 
                        _id: { 
                            $in: rawStudent.recommendations.map(id => 
                                typeof id === 'string' ? id : id.toString()
                            )
                        } 
                    }
                },
                {
                    $project: {
                        name: 1,
                        lessons: 1
                    }
                }
            ]).toArray();

        console.log('Found recommended chapters:', recommendedChapters);

        res.status(200).json({
            student: {
                id: rawStudent._id,
                name: rawStudent.name,
                email: rawStudent.email
            },
            classrooms: classrooms.map(classroom => ({
                _id: classroom._id,
                name: classroom.name,
                students: classroom.students,
                teacher: {
                    id: classroom.teacher._id,
                    name: classroom.teacher.name
                },
                subjects: classroom.subjects.map(subject => ({
                    id: subject._id,
                    name: subject.name
                }))
            })),
            recommendations: recommendedChapters.map(subject => ({
                subjectId: subject._id,
                subjectName: subject.name,
                chapters: subject.lessons || []
            }))
        });
    } catch (error) {
        console.error('Dashboard error details:', error);
        res.status(500).json({ 
            message: 'Error fetching student dashboard', 
            error: error.message,
            providedId: req.params.id
        });
    }
});

// Get a single student
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new student
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// Update a student
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// Delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;