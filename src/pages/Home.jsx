import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper, Grid } from '@mui/material';
import { School, Group, MenuBook } from '@mui/icons-material';

const Home = () => {
    const features = [
        {
            icon: <School fontSize="large" />,
            title: "Quality Education",
            description: "Access to high-quality educational resources and expert teachers"
        },
        {
            icon: <Group fontSize="large" />,
            title: "Interactive Learning",
            description: "Engage with peers and teachers in real-time collaborative sessions"
        },
        {
            icon: <MenuBook fontSize="large" />,
            title: "Structured Curriculum",
            description: "Well-organized courses and learning paths for optimal progress"
        }
    ];

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', my: 8 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Eduverse
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                    Your Gateway to Modern Education
                </Typography>
            </Box>

            <Grid container spacing={4} sx={{ mb: 8 }}>
                {features.map((feature, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Paper 
                            elevation={3}
                            sx={{
                                p: 3,
                                textAlign: 'center',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{ color: 'primary.main', mb: 2 }}>
                                {feature.icon}
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {feature.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
