const express = require('express');
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const router = express.Router();

// Get messages for a user (either student or teacher)
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Find messages where user is either sender or receiver
        const messages = await Message.find({
            $or: [
                { 'sender.id': userId },
                { 'receiver.id': userId }
            ]
        }).sort({ createdAt: -1 }).lean();

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
});

// Send a new message
router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId, content, senderRole } = req.body;

        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        // Get sender details
        const sender = senderRole === 'student' 
            ? await Student.findById(senderId)
            : await Teacher.findById(senderId);

        // Get receiver details
        const receiver = senderRole === 'student'
            ? await Teacher.findById(receiverId)
            : await Student.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        const newMessage = new Message({
            sender: {
                id: sender._id,
                name: sender.name,
                role: senderRole
            },
            receiver: {
                id: receiver._id,
                name: receiver.name,
                role: senderRole === 'student' ? 'teacher' : 'student'
            },
            content
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
});

// Mark message as read
router.patch('/:messageId/read', async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.messageId,
            { read: true },
            { new: true }
        );
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error updating message', error: error.message });
    }
});

module.exports = router;
