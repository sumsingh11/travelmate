import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import EditIcon from '@mui/icons-material/Edit'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
// Material-UI imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'


function TripDays() {
    const navigate = useNavigate();
    const numberOfTravelers = JSON.parse(localStorage.getItem("tripDetails"))?.people || 1;
    const [tripDetails, setTripDetails] = useState(() => {
        return JSON.parse(localStorage.getItem("tripDetails")) || { days: 1, people: 1, dayPlans: {} };
    });

    const [days, setDays] = useState([]);

    // Load trip days when `tripDetails` updates
    useEffect(() => {
        if (tripDetails.days) {
            setDays(new Array(Number(tripDetails.days)).fill(null));
        }
    }, [tripDetails.days]);

    // Recalculate total cost for each day when `tripDetails` changes
    useEffect(() => {
        updateDayPlanCosts();
    }, [tripDetails.people]); // Trigger when number of travelers changes

    // Ensure trip details stay synced with localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            const updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { days: 1, people: 1, dayPlans: {} };
            setTripDetails(updatedTrip);
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    // Recalculate and update trip day costs when the number of travelers changes
    const updateDayPlanCosts = () => {
        const storedTrip = JSON.parse(localStorage.getItem("tripDetails")) || { days: 1, people: 1, dayPlans: {} };
        const updatedTrip = { ...storedTrip };

        if (updatedTrip.dayPlans) {
            Object.keys(updatedTrip.dayPlans).forEach((day) => {
                let dayPlan = updatedTrip.dayPlans[day];

                if (dayPlan.dayPlan) {
                    const totalCostPerPerson = dayPlan.dayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0);
                    dayPlan.totalCost = totalCostPerPerson * (updatedTrip.people || 1); // Update cost for all travelers
                }
            });
        }

        localStorage.setItem("tripDetails", JSON.stringify(updatedTrip));
        setTripDetails(updatedTrip);
    };

    // Navigate to planner for selected day
    const goToDay = (dayNumber) => {
        localStorage.setItem("selectedDay", dayNumber);
        navigate("/planner");
    };

    return (
        <Box sx={{ mt: 0 }}>
            <Grid container justifyContent="center" px={2}>
                <Grid item xs={12}>
                    <Card elevation={3} sx={{ boxShadow: 3 }}>
                        <CardHeader
                            title={
                                <Typography variant="h6" align="center">
                                    <CalendarMonthIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} /> Trip Days
                                </Typography>
                            }
                        />
                        <CardContent>
                            <Grid container spacing={2} justifyContent="flex-start">
                                {days.length > 0 ? (
                                    days.map((_, index) => (
                                        <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2} display="flex">
                                            <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 2 }}>
                                                <CardHeader
                                                    title={<Typography align="center">Day {index + 1}</Typography>}
                                                    sx={{ pb: 0 }}
                                                />
                                                <CardContent sx={{ pt: 0, flexGrow: 1 }}>
                                                    <List dense>
                                                        {tripDetails.dayPlans &&
                                                        tripDetails.dayPlans[index + 1] &&
                                                        Array.isArray(tripDetails.dayPlans[index + 1].dayPlan) &&
                                                        tripDetails.dayPlans[index + 1].dayPlan.length > 0 ? (
                                                            <>
                                                                {tripDetails.dayPlans[index + 1].dayPlan.map((activity, i) => (
                                                                    <ListItem key={i} disablePadding>
                                                                        <ListItemText
                                                                            primary={`${activity.title} - $${Number((activity.cost || 0) * numberOfTravelers).toFixed(2)}`}
                                                                        />
                                                                    </ListItem>
                                                                ))}
                                                                <Divider />
                                                                <ListItem>
                                                                    <ListItemText
                                                                        primary={<>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                <strong>Total Cost for All Travelers:</strong> ${Number(tripDetails.dayPlans[index + 1].totalCost || 0).toFixed(2)}
                                                                            </Typography>
                                                                        </>}
                                                                    />
                                                                </ListItem>
                                                            </>
                                                        ) : (
                                                            <ListItem>
                                                                <ListItemText primary="No activities planned" />
                                                            </ListItem>
                                                        )}
                                                    </List>
                                                </CardContent>
                                                <CardActions>
                                                    <Button
                                                        fullWidth
                                                        startIcon={<EditIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />}
                                                        onClick={() => goToDay(index + 1)}
                                                    >
                                                        Plan/Edit Day
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography>No trip days available.</Typography>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default TripDays;
