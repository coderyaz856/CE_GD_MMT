import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { School } from '@mui/icons-material';

const Header = () => {
    const location = useLocation();
    const isDashboard = location.pathname.includes('dashboard');

    return (
        <AppBar position="static" sx={{ marginBottom: 4 }}>
            <Toolbar>
                <School sx={{ mr: 2 }} />
                <Typography 
                    variant="h6" 
                    component={Link} 
                    to="/" 
                    sx={{ 
                        flexGrow: 1, 
                        textDecoration: 'none', 
                        color: 'inherit' 
                    }}
                >
                    Eduverse
                </Typography>
                
                {!isDashboard && (
                    <Box>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/login"
                            sx={{ mr: 2 }}
                        >
                            Login
                        </Button>
                        <Button 
                            color="inherit" 
                            component={Link} 
                            to="/signup"
                        >
                            Sign Up
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
