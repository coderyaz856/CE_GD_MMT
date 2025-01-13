import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    Tabs,
    Tab,
    CircularProgress,
    Alert
} from '@mui/material';
import { Class, Group, MenuBook, Message } from '@mui/icons-material';
import axios from 'axios';
import MessageComponent from '../components/MessageComponent';

const TeacherDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [dashboardData, setDashboardData] = useState({
        classrooms: [],
        subjects: [],
        messages: []
    });
    const [selectedStudent, setSelectedStudent] = useState(null);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                console.log('Fetching dashboard for teacher ID:', userId);
                
                const response = await axios.get(`http://localhost:5000/api/teachers/dashboard/${userId}`);
                console.log('Dashboard response:', response.data);
                
                if (response.data) {
                    setDashboardData(response.data);
                    setError(null);
                }
            } catch (err) {
                console.error('Dashboard error:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchDashboardData();
        } else {
            setError('No user ID found');
        }
    }, [userId]);

    const handleSendMessage = async (content) => {
        try {
            const response = await axios.post('http://localhost:5000/api/messages', {
                senderId: userId,
                receiverId: selectedStudent._id,
                content,
                senderRole: 'teacher'
            });

            setDashboardData(prev => ({
                ...prev,
                messages: [...prev.messages, response.data]
            }));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            </Container>
        );
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Teacher Dashboard
                </Typography>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<Class />} label="Classrooms" />
                    <Tab icon={<MenuBook />} label="Subjects" />
                    <Tab icon={<Message />} label="Messages" />
                </Tabs>
            </Paper>

            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Your Classrooms
                            </Typography>
                            {dashboardData.classrooms.map((classroom) => (
                                <Card key={classroom.id} sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {classroom.name}
                                        </Typography>
                                        <List dense>
                                            {classroom.students.map((student) => (
                                                <ListItem
                                                    key={student.id}
                                                    button
                                                    selected={selectedStudent?._id === student.id}
                                                    onClick={() => setSelectedStudent(student)}
                                                >
                                                    <ListItemText
                                                        primary={student.name}
                                                        secondary={student.email}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            ))}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {selectedStudent ? (
                            <MessageComponent
                                messages={dashboardData.messages.filter(m => 
                                    m.sender.id === selectedStudent._id || 
                                    m.receiver.id === selectedStudent._id
                                )}
                                onSendMessage={handleSendMessage}
                                recipient={selectedStudent}
                            />
                        ) : (
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                                <Typography>Select a student to start messaging</Typography>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                    {dashboardData.subjects.map((subject) => (
                        <Grid item xs={12} md={6} key={subject._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {subject.name}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <List dense>
                                        {subject.lessons?.map((lesson, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={lesson} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Recent Messages
                            </Typography>
                            <List>
                                {dashboardData.messages.map((message) => (
                                    <ListItem key={message._id}>
                                        <Card sx={{ width: '100%', mb: 1 }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="textSecondary">
                                                    {message.sender.role === 'teacher' ? 'To: ' : 'From: '}
                                                    {message.sender.role === 'teacher' 
                                                        ? message.receiver.name 
                                                        : message.sender.name}
                                                </Typography>
                                                <Typography variant="body1" sx={{ mt: 1 }}>
                                                    {message.content}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(message.createdAt).toLocaleString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>
        </Container>
    );
};

export default TeacherDashboard;
