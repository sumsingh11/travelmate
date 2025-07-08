import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditNoteIcon from '@mui/icons-material/EditNote'
import FlightIcon from '@mui/icons-material/Flight'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useCallback, useEffect, useState } from "react"

function Flights({ onBudgetUpdate }) {
  const [flights, setFlights] = useState([]);
  const [totalFlightCost, setTotalFlightCost] = useState(0);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [flightData, setFlightData] = useState({ departure: "", arrival: "", cost: "", type: "One-Way" });
  const [errors, setErrors] = useState({ departure: "", arrival: "", cost: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to Calculate Total Flight Cost
  const calculateTotal = useCallback((updatedFlights) => {
    const total = updatedFlights.reduce((sum, flight) => sum + parseFloat(flight.cost || 0), 0);
    setTotalFlightCost(total.toFixed(2));

    // Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalFlightCost", total.toFixed(2));
  }, []);

  // Load Flights from LocalStorage & calculate total cost
  useEffect(() => {
    const storedFlights = JSON.parse(localStorage.getItem("flights")) || [];
    setFlights(storedFlights);
    calculateTotal(storedFlights);
  }, [calculateTotal]);

  // Validate Inputs
  const validateForm = () => {
    let valid = true;
    let newErrors = { departure: "", arrival: "", cost: "" };

    if (!flightData.departure.trim()) {
      newErrors.departure = "Departure location is required.";
      valid = false;
    }

    if (!flightData.arrival.trim()) {
      newErrors.arrival = "Arrival location is required.";
      valid = false;
    }

    if (flightData.cost === "" || isNaN(flightData.cost)) {
      newErrors.cost = "Cost must be a valid number.";
      valid = false;
    } else if (parseFloat(flightData.cost) < 0) {
      newErrors.cost = "Cost cannot be negative.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Input Change & Live Validation
  const handleInputChange = (field, value) => {
    setFlightData((prev) => ({ ...prev, [field]: value }));

    // Live validation
    let newErrors = { ...errors };
    if (field === "departure") {
      newErrors.departure = value.trim() ? "" : "Departure location is required.";
    } else if (field === "arrival") {
      newErrors.arrival = value.trim() ? "" : "Arrival location is required.";
    } else if (field === "cost") {
      newErrors.cost =
        value === "" || isNaN(value) ? "Cost must be a valid number." :
        parseFloat(value) < 0 ? "Cost cannot be negative." :
        "";
    }
    setErrors(newErrors);
  };

  // Handle Save (Add/Edit) Flight
  const handleSaveFlight = () => {
    if (!validateForm()) return;

    let updatedFlights = [...flights];

    if (editingIndex !== null) {
      updatedFlights[editingIndex] = { ...flightData, cost: parseFloat(flightData.cost) };
    } else {
      updatedFlights.push({ ...flightData, cost: parseFloat(flightData.cost) });
    }

    localStorage.setItem("flights", JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    calculateTotal(updatedFlights); // Immediately update budget after save

    // Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);

    resetForm();
  };

  // Handle Edit Flight
  const handleEditFlight = (index) => {
    setFlightData(flights[index]);
    setEditingIndex(index);
    setErrors({ departure: "", arrival: "", cost: "" }); // Reset errors
    setShowFlightModal(true);
  };

  // Handle Delete Flight
  const handleDeleteFlight = (index) => {
    let updatedFlights = flights.filter((_, i) => i !== index);
    localStorage.setItem("flights", JSON.stringify(updatedFlights));
    setFlights(updatedFlights);
    calculateTotal(updatedFlights); // Immediately update budget after delete

    // Notify TripOverview after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);
  };

  // Reset Form Fields
  const resetForm = () => {
    setFlightData({ departure: "", arrival: "", cost: "", type: "One-Way" });
    setEditingIndex(null);
    setErrors({ departure: "", arrival: "", cost: "" }); // Reset validation errors
    setShowFlightModal(false);
  };

  return (
    <>
      {/* Flights Information Card (Material-UI, matching Stay card style) */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader
          avatar={<FlightIcon sx={{ fontSize: 28, color: 'primary.main' }} />}
          title={<Typography variant="h6">Flights</Typography>}
          sx={{ textAlign: 'center', pb: 0 }}
        />
        <CardContent sx={{ p: 2 }}>
          <List>
            {flights.length > 0 ? (
              flights.map((flight, index) => (
                <ListItem key={index} secondaryAction={
                  <>
                    <Button variant="outlined" color="primary" size="small" sx={{ mr: 1 }} onClick={() => handleEditFlight(index)} startIcon={<EditNoteIcon sx={{ fontSize: 18 }} />}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteFlight(index)} startIcon={<DeleteForeverIcon sx={{ fontSize: 18 }} />}>
                      Delete
                    </Button>
                  </>
                } divider>
                  <ListItemText
                    primary={`${flight.departure} ➝ ${flight.arrival} (${flight.type})`}
                    secondary={`$${flight.cost.toFixed(2)}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No flights added." />
              </ListItem>
            )}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 500 }}>
            Total Flight Cost: <Box component="span" color="primary.main">${totalFlightCost}</Box>
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              resetForm();
              setShowFlightModal(true);
            }}
          >
            Add Flight
          </Button>
        </CardContent>
      </Card>

      {/* Flight Modal - Material-UI Dialog */}
      <Dialog open={showFlightModal} onClose={() => setShowFlightModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingIndex !== null ? "Edit Flight" : "Add Flight"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Departure Location"
              value={flightData.departure}
              error={!!errors.departure}
              helperText={errors.departure}
              onChange={(e) => handleInputChange("departure", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Arrival Location"
              value={flightData.arrival}
              error={!!errors.arrival}
              helperText={errors.arrival}
              onChange={(e) => handleInputChange("arrival", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cost ($)"
              type="number"
              value={flightData.cost}
              error={!!errors.cost}
              helperText={errors.cost}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              fullWidth
              margin="normal"
              slotProps={{ htmlInput : { min: 0, step: 0.01 } }}
            />
            <TextField
              label="Trip Type"
              select
              value={flightData.type}
              onChange={(e) => setFlightData({ ...flightData, type: e.target.value })}
              fullWidth
              margin="normal"
            >
              <MenuItem value="One-Way">One-Way</MenuItem>
              <MenuItem value="Roundtrip">Roundtrip</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFlightModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveFlight} variant="contained" color="primary">
            {editingIndex !== null ? "Save Changes" : "Add Flight"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Flights;
