import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports"
import PeopleIcon from "@mui/icons-material/People"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"

function ActivitiesHeader() {
  const [trip, setTrip] = useState({ destination: "", days: 0, people: 0 });

  // Load trip details from localStorage
  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
    if (storedTrip) {
      setTrip(storedTrip);
    }
  }, []);

  return (
    <Paper elevation={0} sx={{ color: "#000", textAlign: "center" }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Manage Activities
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" alignItems="center" mt={3}>
        <Typography variant="h6">
          <strong><ConnectingAirportsIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />Destination:</strong> {trip.destination || "Unknown"}
        </Typography>
        <Typography variant="h6">|</Typography>
        <Typography variant="h6">
          <strong><CalendarMonthIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />Days:</strong> {trip.days || 0}
        </Typography>
        <Typography variant="h6">|</Typography>
        <Typography variant="h6">
          <strong><PeopleIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />Travelers:</strong> {trip.people || 0}
        </Typography>
      </Stack>
    </Paper>
  )
}

export default ActivitiesHeader;
