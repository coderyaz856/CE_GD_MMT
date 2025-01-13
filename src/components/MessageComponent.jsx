import React, { useState } from 'react';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    Divider,
    Avatar
} from '@mui/material';
import { Send } from '@mui/icons-material';

const MessageComponent = ({ messages, onSendMessage, recipient }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                <List>
                    {messages.map((message, index) => (
                        <React.Fragment key={message._id || index}>
                            <ListItem alignItems="flex-start">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: message.sender.role === 'teacher' ? 'flex-end' : 'flex-start',
                                        width: '100%'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Avatar sx={{ mr: 1, bgcolor: message.sender.role === 'teacher' ? 'primary.main' : 'secondary.main' }}>
                                            {message.sender.name[0]}
                                        </Avatar>
                                        <Typography variant="subtitle2">
                                            {message.sender.name}
                                        </Typography>
                                    </Box>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 1,
                                            bgcolor: message.sender.role === 'teacher' ? 'primary.light' : 'grey.100',
                                            maxWidth: '70%'
                                        }}
                                    >
                                        <Typography variant="body1">{message.content}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {new Date(message.createdAt).toLocaleString()}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </ListItem>
                            <Divider variant="middle" />
                        </React.Fragment>
                    ))}
                </List>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder={`Message to ${recipient?.name || 'student'}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button
                    variant="contained"
                    endIcon={<Send />}
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                >
                    Send
                </Button>
            </Box>
        </Paper>
    );
};

export default MessageComponent;
