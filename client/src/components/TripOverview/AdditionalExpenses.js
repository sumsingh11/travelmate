import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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

function AdditionalExpenses({ onExpensesUpdate }) {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState({ title: "", cost: "" });
  const [errors, setErrors] = useState({ title: "", cost: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to Calculate Total Expenses
  const calculateTotal = useCallback((updatedExpenses) => {
    const total = updatedExpenses.reduce((sum, expense) => sum + parseFloat(expense.cost || 0), 0);
    setTotalExpenses(total.toFixed(2));

    // Save total to localStorage for BudgetAndCosts.js
    localStorage.setItem("totalAdditionalExpenses", total.toFixed(2));
  }, []);

  // Load Expenses from LocalStorage on Mount
  useEffect(() => {
    const storedExpenses = JSON.parse(localStorage.getItem("additionalExpenses")) || [];
    setExpenses(storedExpenses);
    calculateTotal(storedExpenses);
  }, [calculateTotal]);

  // Validate Inputs (Real-time)
  const validateForm = () => {
    let valid = true;
    let newErrors = { title: "", cost: "" };

    if (!expenseData.title.trim()) {
      newErrors.title = "Title is required.";
      valid = false;
    } else if (expenseData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
      valid = false;
    }

    if (expenseData.cost === "" || isNaN(expenseData.cost)) {
      newErrors.cost = "Cost must be a valid number.";
      valid = false;
    } else if (parseFloat(expenseData.cost) < 0) {
      newErrors.cost = "Cost cannot be negative.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle Input Change & Live Validation
  const handleInputChange = (field, value) => {
    setExpenseData((prev) => ({ ...prev, [field]: value }));

    // Live validation
    let newErrors = { ...errors };
    if (field === "title") {
      newErrors.title = value.trim().length < 3 ? "Title must be at least 3 characters." : "";
    } else if (field === "cost") {
      newErrors.cost =
        value === "" || isNaN(value) ? "Cost must be a valid number." :
        parseFloat(value) < 0 ? "Cost cannot be negative." :
        "";
    }
    setErrors(newErrors);
  };

  // Handle Save (Add/Edit) Expense
  const handleSaveExpense = () => {
    if (!validateForm()) return;

    let updatedExpenses = [...expenses];

    if (editingIndex !== null) {
      updatedExpenses[editingIndex] = { ...expenseData, cost: parseFloat(expenseData.cost) };
    } else {
      updatedExpenses.push({ ...expenseData, cost: parseFloat(expenseData.cost) });
    }

    // Update localStorage first
    localStorage.setItem("additionalExpenses", JSON.stringify(updatedExpenses));

    // Update state & budget
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses); // Immediately update budget

    // Notify TripOverview
    setTimeout(() => {
      if (onExpensesUpdate) onExpensesUpdate();
    }, 0);

    resetForm();
  };

  // Handle Edit Expense
  const handleEditExpense = (index) => {
    setExpenseData(expenses[index]);
    setEditingIndex(index);
    setErrors({ title: "", cost: "" }); // Reset errors when opening modal
    setShowExpenseModal(true);
  };

  // Handle Delete Expense
  const handleDeleteExpense = (index) => {
    let updatedExpenses = expenses.filter((_, i) => i !== index);
    localStorage.setItem("additionalExpenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);
    calculateTotal(updatedExpenses);
    setTimeout(() => {
      if (onExpensesUpdate) onExpensesUpdate();
    }, 0);
  };

  // Reset Form Fields
  const resetForm = () => {
    setExpenseData({ title: "", cost: "" });
    setEditingIndex(null);
    setErrors({ title: "", cost: "" }); // Reset errors when closing modal
    setShowExpenseModal(false);
  };

  return (
    <>
      {/* Additional Expenses Card (Material-UI, matching Stay card style) */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader
          avatar={<AttachMoneyIcon sx={{ fontSize: 28, color: 'primary.main' }} />}
          title={<Typography variant="h6">Additional Expenses</Typography>}
          sx={{ textAlign: 'center', pb: 0 }}
        />
        <CardContent sx={{ p: 2 }}>
          <List>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <ListItem key={index} secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" color="primary" onClick={() => handleEditExpense(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDeleteExpense(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                } divider>
                  <ListItemText
                    primary={expense.title}
                    secondary={`$${expense.cost.toFixed(2)}`}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No additional expenses." />
              </ListItem>
            )}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Total Additional Expenses: <Box component="span" color="primary.main">${totalExpenses}</Box>
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              resetForm();
              setShowExpenseModal(true);
            }}
          >
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Expense Modal (Material-UI Dialog) */}
      <Dialog open={showExpenseModal} onClose={() => setShowExpenseModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingIndex !== null ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={expenseData.title}
              error={!!errors.title}
              helperText={errors.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Cost ($)"
              type="number"
              value={expenseData.cost}
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
          <Button onClick={() => setShowExpenseModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveExpense} variant="contained" color="primary">
            {editingIndex !== null ? "Save Changes" : "Add Expense"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdditionalExpenses;
