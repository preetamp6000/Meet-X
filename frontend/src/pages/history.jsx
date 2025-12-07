import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { IconButton, Grid, Box } from '@mui/material';

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([]);
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                setMeetings(history);
            } catch {
                // TODO: Add Snackbar here
            }
        };

        fetchHistory();
    }, [getHistoryOfUser]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <Box sx={{ 
            padding: { xs: 2, sm: 3, md: 4 },
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '100vh'
        }}>
            <IconButton 
                onClick={() => routeTo("/home")}
                sx={{ 
                    marginBottom: 3,
                    marginLeft: { xs: 0, sm: 1 }
                }}
            >
                <HomeIcon />
            </IconButton>

            {meetings.length > 0 ? (
                <Grid container spacing={2}>
                    {meetings.map((e) => (
                        <Grid item xs={12} sm={6} md={4} key={e.meetingCode}>
                            <Card variant="outlined" sx={{ 
                                height: '100%',
                                '&:hover': {
                                    boxShadow: 3
                                }
                            }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Code: {e.meetingCode}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        Date: {formatDate(e.date)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography 
                    variant="h6" 
                    sx={{ 
                        textAlign: 'center', 
                        marginTop: 4,
                        color: 'text.secondary'
                    }}
                >
                    No meeting history found
                </Typography>
            )}
        </Box>
    );
}