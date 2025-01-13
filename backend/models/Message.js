const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        role: { type: String, enum: ['student', 'teacher'], required: true }
    },
    receiver: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        role: { type: String, enum: ['student', 'teacher'], required: true }
    },
    content: { type: String, required: true },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
