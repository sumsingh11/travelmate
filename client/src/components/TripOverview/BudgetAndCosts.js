import SavingsIcon from '@mui/icons-material/Savings'
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
  TextField,
  Typography
} from '@mui/material'
import Divider from '@mui/material/Divider'
import { useEffect, useState } from "react"

function BudgetAndCosts({ updateTrigger }) {
  const [budget, setBudget] = useState(0);
  const [totalCostAllTravelers, setTotalCostAllTravelers] = useState(0);
  const [totalCostPerPerson, setTotalCostPerPerson] = useState(0);
  const [totalBudgetAllTravelers, setTotalBudgetAllTravelers] = useState(0);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");
  const [error, setError] = useState(""); // 🔹 Track validation errors

  // Load Budget & Costs from LocalStorage
  useEffect(() => {
    updateBudgetAndCosts();
  }, [updateTrigger]); // Refresh when updateTrigger changes

  // Function to Update Costs
  const updateBudgetAndCosts = () => {
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || {};
    const flights = JSON.parse(localStorage.getItem("flights")) || [];
    const stays = JSON.parse(localStorage.getItem("stays")) || [];
    const additionalExpenses = JSON.parse(localStorage.getItem("additionalExpenses")) || [];
    const numberOfTravelers = parseInt(tripDetails.people) || 1;

    // Flights Total Cost
    const flightsTotalCost = flights.reduce((sum, flight) => sum + parseFloat(flight.cost || 0), 0);

    // Stays Total Cost
    const staysTotalCost = stays.reduce((sum, stay) => sum + parseFloat(stay.cost || 0), 0);

    // Trip Days Total Cost
    let tripDaysTotalCost = 0;
    if (tripDetails.dayPlans) {
      tripDaysTotalCost = Object.values(tripDetails.dayPlans).reduce((sum, day) => {
        const dailyTotal = day.dayPlan ? 
          day.dayPlan.reduce((daySum, activity) => daySum + parseFloat(activity.cost || 0), 0) 
          : 0;
        
        return sum + (dailyTotal * numberOfTravelers);
      }, 0);
    }

    // Additional Expenses Total
    const additionalExpensesTotal = additionalExpenses.reduce((sum, expense) => sum + parseFloat(expense.cost || 0), 0);

    // Calculate Total Cost
    const totalAllTravelers = flightsTotalCost + staysTotalCost + tripDaysTotalCost + additionalExpensesTotal;
    const totalPerPerson = totalAllTravelers / numberOfTravelers;

    // Load Budget
    const storedBudget = parseFloat(tripDetails.budget) || 0;
    const budgetPerPerson = storedBudget.toFixed(2);
    const budgetAllTravelers = (storedBudget * numberOfTravelers).toFixed(2);

    // Update State
    setTotalCostAllTravelers(totalAllTravelers.toFixed(2));
    setTotalCostPerPerson(totalPerPerson.toFixed(2));
    setBudget(budgetPerPerson);
    setTotalBudgetAllTravelers(budgetAllTravelers);

    // Save Updated Costs in LocalStorage
    tripDetails.totalCostAllTravelers = totalAllTravelers;
    tripDetails.totalCostPerPerson = totalPerPerson;
    tripDetails.totalBudgetAllTravelers = budgetAllTravelers;
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
  };

  // Handle Budget Save with Validation
  const handleSaveBudget = () => {
    const newBudget = parseFloat(budgetInput);

    // Validation
    if (isNaN(newBudget) || newBudget < 0) {
      setError("Budget must be a valid number and cannot be negative.");
      return;
    }

    // Load Trip Details & Update
    const tripDetails = JSON.parse(localStorage.getItem("tripDetails")) || {};
    const numberOfTravelers = parseInt(tripDetails.people) || 1;

    tripDetails.budget = newBudget;
    tripDetails.totalBudgetAllTravelers = (newBudget * numberOfTravelers).toFixed(2);

    // Save to LocalStorage
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));

    // Update State
    setBudget(newBudget.toFixed(2));
    setTotalBudgetAllTravelers((newBudget * numberOfTravelers).toFixed(2));

    // Close modal
    setShowBudgetModal(false);
  };

  return (
    <>
      {/* Budget & Costs Section (Material-UI, matching Additional Expenses Card, horizontal layout for All Travelers and Per Person) */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader
          avatar={<SavingsIcon sx={{ fontSize: 28, color: 'primary.main' }} />}
          title={<Typography variant="h6">Budget & Costs</Typography>}
          sx={{ textAlign: 'center', pb: 0 }}
        />
        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, borderRight: { sm: '1px solid #eee' }, pr: { sm: 2 }, mb: { xs: 2, sm: 0 } }}>
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>All Travelers</Typography>
              <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 8 }}>
                <li><strong>Total Cost:</strong> ${totalCostAllTravelers}</li>
                <li><strong>Total Budget:</strong> ${totalBudgetAllTravelers}</li>
              </ul>
            </Box>
            <Box sx={{ flex: 1, pl: { sm: 2 } }}>
              <Typography variant="subtitle1" color="success.main" sx={{ fontWeight: 600 }}>Per Person</Typography>
              <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 8 }}>
                <li><strong>Total Cost:</strong> ${totalCostPerPerson}</li>
                <li><strong>Total Budget:</strong> ${budget}</li>
              </ul>
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: 1 }} />
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              setBudgetInput("");
              setError("");
              setShowBudgetModal(true);
            }}
          >
            Edit Budget
          </Button>
        </CardContent>
      </Card>

      {/* Budget Edit Modal (Material-UI Dialog) */}
      <Dialog open={showBudgetModal} onClose={() => setShowBudgetModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Trip Budget (Per Person)</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Set Budget ($)"
              type="number"
              value={budgetInput}
              error={!!error}
              helperText={error}
              onChange={(e) => {
                setBudgetInput(e.target.value);
                setError("");
              }}
              fullWidth
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
              placeholder="Enter budget amount"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBudgetModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveBudget} variant="contained" color="primary">Save Budget</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BudgetAndCosts;
