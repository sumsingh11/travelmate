import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function TotalCost({ dayPlan, numberOfTravelers }) {
  const navigate = useNavigate();
  const [totalCostPerPerson, setTotalCostPerPerson] = useState(0);
  const [totalCostForAll, setTotalCostForAll] = useState(0);

  useEffect(() => {
    // Calculate total cost but DO NOT save it to localStorage automatically
    const totalPerPerson = dayPlan.reduce((sum, activity) => sum + parseFloat(activity.cost || 0), 0);
    const totalAll = totalPerPerson * numberOfTravelers;

    setTotalCostPerPerson(totalPerPerson);
    setTotalCostForAll(totalAll);
  }, [dayPlan, numberOfTravelers]);

  // Handle finishing planning and explicitly saving to localStorage
  const handleFinishPlanning = () => {
  
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || { dayPlans: {} };
    const selectedDay = localStorage.getItem("selectedDay");
  
    if (!selectedDay) {
      console.error("No selected day found. Cannot save.");
      return;
    }
  
    const serializableDayPlan = dayPlan.map(({ id, title, startTime, endTime, cost, color }) => ({
      id,
      title,
      startTime,
      endTime,
      cost,
      color,
    }));
  
    tripDetails.dayPlans[selectedDay] = {
      dayPlan: serializableDayPlan,
    };
  
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
  
    navigate("/trip");
  };
  
  return (
    <Card sx={{ boxShadow: 3, p: 4, mt: 4 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h5" component="h4" gutterBottom>
          <LocalAtmIcon /> Total Costs for the Day
        </Typography>
        <Typography variant="body1" sx={{ mt: 3 }}>
          <strong>Per Person:</strong> ${totalCostPerPerson.toFixed(2)}
        </Typography>
        <Typography variant="body1">
          <strong>For All Travelers:</strong> ${totalCostForAll.toFixed(2)}
        </Typography>
        {/* Button group */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate("/trip")}>
            Trip Overview
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleFinishPlanning}>
            Save Changes
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default TotalCost;
