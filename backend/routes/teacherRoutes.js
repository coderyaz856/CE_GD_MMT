const express = require('express');
const mongoose = require('mongoose');
const Teacher = require('../models/Teacher');
const Message = require('../models/Message');
const Classroom = require('../models/Classroom');

const router = express.Router();

// Dashboard route must come before generic /:id route
router.get('/dashboard/:id', async (req, res) => {
    try {
        const teacherId = req.params.id;
        console.log('Attempting to fetch dashboard for teacher:', teacherId);

        // First try with string ID
        let teacher = await Teacher.findOne({ _id: teacherId })
            .populate('subjects', 'name lessons');

        if (!teacher) {
            // Try with ObjectId if string ID fails
            try {
                const teacherObjectId = new mongoose.Types.ObjectId(teacherId);
                teacher = await Teacher.findById(teacherObjectId)
                    .populate('subjects', 'name lessons');
            } catch (err) {
                console.error('Error converting ID:', err);
            }
        }

        if (!teacher) {
            console.log('Teacher not found with ID:', teacherId);
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Get classrooms
        const classrooms = await Classroom.find({ teacher: teacherId })
            .populate('students', 'name email')
            .populate('subjects', 'name')
            .lean();

        console.log('Found classrooms:', classrooms);

        // Get messages
        const messages = await Message.find({
            $or: [
                { 'sender.id': teacherId },
                { 'receiver.id': teacherId }
            ]
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

        console.log('Found messages:', messages.length);

        res.status(200).json({
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email
            },
            classrooms: classrooms.map(classroom => ({
                id: classroom._id,
                name: classroom.name,
                students: classroom.students,
                subjects: classroom.subjects
            })),
            subjects: teacher.subjects,
            messages
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ 
            message: 'Error fetching teacher dashboard', 
            error: error.message 
        });
    }
});

// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a single teacher
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new teacher
router.post('/', async (req, res) => {
    const { name, email, classrooms } = req.body;
    try {
        const teacher = new Teacher({ name, email, classrooms });
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// Update a teacher
router.put('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// Delete a teacher
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
        res.json({ message: 'Teacher deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route POST /api/teacher/exams
// @desc Create a new exam template
router.post('/exams', async (req, res) => {
    try {
        const { title, questions } = req.body;
        const teacherId = req.user.id;

        // Store exam template in a local file or cloud storage
        const filePath = path.join(__dirname, `../documents/${teacherId}_${Date.now()}.json`);
        fs.writeFileSync(filePath, JSON.stringify({ title, questions }, null, 2));

        res.status(201).json({ message: 'Exam template created', filePath });
    } catch (error) {
        res.status(500).json({ message: 'Error creating exam template', error });
    }
});

module.exports = router;
