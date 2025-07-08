import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
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
import { useEffect, useState } from "react"

function ToDoList() {
  const [todoList, setTodoList] = useState([]);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [errors, setErrors] = useState("");
  const [editingTodoIndex, setEditingTodoIndex] = useState(null);

  // Load To-Do List from LocalStorage
  useEffect(() => {
    const storedTodoList = JSON.parse(localStorage.getItem("todoList")) || [];
    setTodoList(storedTodoList);
  }, []);

  // Save To-Do List to LocalStorage
  const saveToLocalStorage = (updatedList) => {
    localStorage.setItem("todoList", JSON.stringify(updatedList));
    setTodoList(updatedList);
  };

  // Handle Checkbox Toggle (Mark as Completed)
  const toggleCompletion = (index) => {
    const updatedList = [...todoList];
    updatedList[index].completed = !updatedList[index].completed; // Toggle checked state
    saveToLocalStorage(updatedList);
  };

  // Validate To-Do Input
  const validateForm = () => {
    if (!todoTitle.trim()) {
      setErrors("To-Do title is required.");
      return false;
    } else if (todoTitle.length < 3) {
      setErrors("To-Do title must be at least 3 characters.");
      return false;
    }

    setErrors("");
    return true;
  };

  // Handle Save (Add/Edit) To-Do
  const handleSaveToDo = () => {
    if (!validateForm()) return;

    let updatedList = [...todoList];

    if (editingTodoIndex !== null) {
      // Edit existing to-do
      updatedList[editingTodoIndex].title = todoTitle;
    } else {
      // Add new to-do
      updatedList.push({ title: todoTitle, completed: false });
    }

    // Save & Reset Form
    saveToLocalStorage(updatedList);
    resetForm();
  };

  // Handle Delete To-Do
  const handleDeleteToDo = (index) => {
    const updatedList = todoList.filter((_, i) => i !== index);
    saveToLocalStorage(updatedList);
  };

  // Reset Form Fields
  const resetForm = () => {
    setTodoTitle("");
    setErrors(""); // Reset errors
    setEditingTodoIndex(null);
    setShowTodoModal(false);
  };

  return (
    <>
      {/* To-Do List Card (Material-UI, matching Additional Expenses Card) */}
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardHeader
          avatar={<CheckCircleIcon sx={{ fontSize: 28, color: 'primary.main' }} />}
          title={<Typography variant="h6">To-Do List</Typography>}
          sx={{ textAlign: 'center', pb: 0 }}
        />
        <CardContent sx={{ p: 2 }}>
          <List>
            {todoList.length > 0 ? (
              todoList.map((todo, index) => (
                <ListItem key={index} secondaryAction={
                  <>
                    <IconButton edge="end" aria-label="edit" color="primary" onClick={() => {
                      setTodoTitle(todo.title);
                      setErrors("");
                      setEditingTodoIndex(index);
                      setShowTodoModal(true);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDeleteToDo(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                } divider>
                  <Checkbox
                    checked={todo.completed}
                    onChange={() => toggleCompletion(index)}
                    sx={{ mr: 1 }}
                  />
                  <ListItemText
                    primary={
                      <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                        {todo.title}
                      </span>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No to-dos yet." />
              </ListItem>
            )}
          </List>
          <Divider sx={{ my: 2 }} />
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              resetForm();
              setShowTodoModal(true);
            }}
          >
            Add To-Do
          </Button>
        </CardContent>
      </Card>

      {/* To-Do Modal (Material-UI Dialog) */}
      <Dialog open={showTodoModal} onClose={() => setShowTodoModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingTodoIndex !== null ? "Edit To-Do" : "Add To-Do"}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={todoTitle}
              error={!!errors}
              helperText={errors}
              onChange={(e) => {
                setTodoTitle(e.target.value);
                setErrors("");
              }}
              fullWidth
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTodoModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSaveToDo} variant="contained" color="primary">
            {editingTodoIndex !== null ? "Save Changes" : "Add To-Do"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ToDoList;
