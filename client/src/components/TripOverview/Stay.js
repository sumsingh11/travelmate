import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import HotelIcon from '@mui/icons-material/Hotel'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'
import { useCallback, useEffect, useState } from "react"

function Stay({ onBudgetUpdate }) {
  const [stays, setStays] = useState([]);
  const [totalStayCost, setTotalStayCost] = useState(0);
  const [showStayModal, setShowStayModal] = useState(false);
  const [stayData, setStayData] = useState({ name: "", location: "", nights: "", cost: "" });
  const [errors, setErrors] = useState({ name: "", location: "", nights: "", cost: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to Calculate Total Stay Cost
  const calculateTotal = useCallback((updatedStays) => {
    const total = updatedStays.reduce((sum, stay) => sum + parseFloat(stay.cost || 0), 0);
    setTotalStayCost(total.toFixed(2));

    // Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalStayCost", total.toFixed(2));
  }, []);

  // Load Stays from LocalStorage & calculate total cost
  useEffect(() => {
    const storedStays = JSON.parse(localStorage.getItem("stays")) || [];
    setStays(storedStays);
    calculateTotal(storedStays);
  }, [calculateTotal]); // Update budget

  // Validate Inputs
  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", location: "", nights: "", cost: "" };

    if (!stayData.name.trim()) {
      newErrors.name = "Stay name is required.";
      valid = false;
    }

    if (!stayData.location.trim()) {
      newErrors.location = "Location is required.";
      valid = false;
    }

    if (stayData.nights === "" || isNaN(stayData.nights) || parseInt(stayData.nights) <= 0) {
      newErrors.nights = "Number of nights must be a positive number.";
      valid = false;
    }

    if (stayData.cost === "" || isNaN(stayData.cost) || parseFloat(stayData.cost) < 0) {
      newErrors.cost = "Cost must be a valid number and cannot be negative.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Input Change & Live Validation
  const handleInputChange = (field, value) => {
    setStayData((prev) => ({ ...prev, [field]: value }));

    // Live validation
    let newErrors = { ...errors };
    if (field === "name") {
      newErrors.name = value.trim() ? "" : "Stay name is required.";
    } else if (field === "location") {
      newErrors.location = value.trim() ? "" : "Location is required.";
    } else if (field === "nights") {
      newErrors.nights = value === "" || isNaN(value) || parseInt(value) <= 0
        ? "Number of nights must be a positive number."
        : "";
    } else if (field === "cost") {
      newErrors.cost =
        value === "" || isNaN(value) ? "Cost must be a valid number." :
        parseFloat(value) < 0 ? "Cost cannot be negative." :
        "";
    }
    setErrors(newErrors);
  };

  // Handle Save (Add/Edit) Stay
  const handleSaveStay = () => {
    if (!validateForm()) return;

    let updatedStays = [...stays];

    if (editingIndex !== null) {
      updatedStays[editingIndex] = { ...stayData, cost: parseFloat(stayData.cost) };
    } else {
      updatedStays.push({ ...stayData, cost: parseFloat(stayData.cost) });
    }

    localStorage.setItem("stays", JSON.stringify(updatedStays));
    setStays(updatedStays);
    calculateTotal(updatedStays); // Immediately update budget after save

    // Notify TripOverview after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);

    resetForm();
  };

  // Handle Edit Stay
  const handleEditStay = (index) => {
    setStayData(stays[index]);
    setEditingIndex(index);
    setErrors({ name: "", location: "", nights: "", cost: "" }); // Reset errors
    setShowStayModal(true);
  };

  // Handle Delete Stay
  const handleDeleteStay = (index) => {
    let updatedStays = stays.filter((_, i) => i !== index);
    localStorage.setItem("stays", JSON.stringify(updatedStays));
    setStays(updatedStays);
    calculateTotal(updatedStays); // Immediately update budget after delete

    // Notify TripOverview SAFELY after re-render
    setTimeout(() => {
      if (onBudgetUpdate) onBudgetUpdate();
    }, 0);
  };

  // Reset Form Fields
  const resetForm = () => {
    setStayData({ name: "", location: "", nights: "", cost: "" });
    setEditingIndex(null);
    setErrors({ name: "", location: "", nights: "", cost: "" }); // Reset validation errors
    setShowStayModal(false);
  };

  return (
    <>
      {/* Stay Information Card (Material-UI) */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader
          avatar={<HotelIcon sx={{ fontSize: 28, color: 'primary.main' }} />}
          title={<Typography variant="h6">Stay</Typography>}
          sx={{ textAlign: 'center', pb: 0 }}
        />
        <CardContent>
          <List>
            {stays.length > 0 ? (
              stays.map((stay, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="edit" color="primary" onClick={() => handleEditStay(index)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDeleteStay(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                  divider
                >
                  <ListItemText
                    primary={`${stay.name} (${stay.location})`}
                    secondary={`Nights: ${stay.nights}  |  $${stay.cost.toFixed(2)}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No stays added." />
              </ListItem>
            )}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Total Stay Cost: <Box component="span" color="primary.main">${totalStayCost}</Box>
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              resetForm();
              setShowStayModal(true);
            }}
          >
            Add Stay
          </Button>
        </CardContent>
      </Card>

      {/* Stay Modal (Material-UI Dialog) */}
      <Dialog open={showStayModal} onClose={() => setShowStayModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingIndex !== null ? "Edit Stay" : "Add Stay"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Stay Name"
              value={stayData.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              value={stayData.location}
              error={!!errors.location}
              helperText={errors.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Number of Nights"
              type="number"
              value={stayData.nights}
              error={!!errors.nights}
              helperText={errors.nights}
              onChange={(e) => handleInputChange("nights", e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Cost ($)"
              type="number"
              value={stayData.cost}
              error={!!errors.cost}
              helperText={errors.cost}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStayModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveStay} variant="contained" color="primary">
            {editingIndex !== null ? "Save Changes" : "Add Stay"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Stay;
