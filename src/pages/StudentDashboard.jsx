import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import { School, Class, MenuBook } from '@mui/icons-material';

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/students/dashboard/${userId}`);
                setDashboardData(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchDashboard();
        }
    }, [userId]);

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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                {/* Student Info */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <School fontSize="large" color="primary" />
                        <div>
                            <Typography variant="h4">{dashboardData?.student?.name}</Typography>
                            <Typography color="textSecondary">{dashboardData?.student?.email}</Typography>
                        </div>
                    </Paper>
                </Grid>

                {/* Classrooms */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Class color="primary" />
                                Your Classrooms
                            </Typography>
                            <List>
                                {dashboardData?.classrooms.map((classroom) => (
                                    <React.Fragment key={classroom._id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={classroom.name}
                                                secondary={`Teacher: ${classroom.teacher?.name || 'Not assigned'}`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recommendations */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MenuBook color="primary" />
                                Recommended Chapters
                            </Typography>
                            <List>
                                {dashboardData?.recommendations.map((rec) => (
                                    <React.Fragment key={rec.subjectId}>
                                        <ListItem>
                                            <ListItemText
                                                primary={rec.subjectName}
                                                secondary={
                                                    <List dense>
                                                        {rec.chapters.map((chapter, idx) => (
                                                            <ListItem key={idx}>
                                                                <ListItemText primary={chapter} />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                }
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StudentDashboard;
