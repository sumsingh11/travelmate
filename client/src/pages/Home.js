import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import PeopleIcon from '@mui/icons-material/People'
import PublicIcon from '@mui/icons-material/Public'
import { Alert, Box, Button, Card, Container, Stack, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
function Home() {
    const navigate = useNavigate();
    const [tripDetails, setTripDetails] = useState({ destination: "", days: "", people: "" });
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertVariant, setAlertVariant] = useState("error");

    // Show an Alert with auto-hide
    const showAlert = (message, variant = "error") => {
        setAlertMessage(message);
        setAlertVariant(variant);

        // Auto-hide after 3 seconds
        setTimeout(() => setAlertMessage(null), 3000);
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Create New Trip
    const handleCreateTrip = (e) => {
        e.preventDefault();
        // Do NOT clear all localStorage, only update tripDetails
        // localStorage.clear(); // <-- Remove this line

        if (!tripDetails.destination.trim() || tripDetails.days <= 0 || tripDetails.people <= 0) {
            showAlert("❌ Please fill in all fields correctly.", "danger");
            return;
        }

        localStorage.setItem("tripDetails", JSON.stringify(tripDetails));
        navigate("/trip");
    };

    // Handle Trip File Import
    const handleImportTrip = (event) => {
        const file = event.target.files[0];

        if (!file) {
            showAlert("❌ No file selected.", "danger");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);

                // Ensure imported data contains the necessary fields
                if (!importedData.tripDetails || !importedData.tripDetails.destination || !importedData.tripDetails.days || !importedData.tripDetails.people) {
                    throw new Error("Invalid trip data format.");
                }

                // Clear existing data before importing
                localStorage.clear();

                // Load all imported data into LocalStorage
                Object.keys(importedData).forEach((key) => {
                    localStorage.setItem(key, JSON.stringify(importedData[key]));
                });

                showAlert("✅ Trip imported successfully!", "success");
                setTimeout(() => navigate("/trip"), 1500); // Redirect after success
            } catch (error) {
                showAlert("❌ Failed to import trip. Please upload a valid JSON file.", "danger");
            }
        };

        reader.readAsText(file);
    };

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Card elevation={6} sx={{ p: 4 }}>
                    <Box textAlign="center">
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            <PublicIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
                            Ready to takeoff?
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Start by creating a new trip or importing an existing one!
                        </Typography>
                        {alertMessage && (
                            <Alert severity={alertVariant} sx={{ my: 2, justifyContent: 'center' }}>
                                {alertMessage}
                            </Alert>
                        )}
                        <Box component="form" onSubmit={handleCreateTrip} sx={{ mt: 2, mb: 3 }}>
                            <Stack spacing={2}>
                                <TextField
                                    label={<><ConnectingAirportsIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />Destination</>}
                                    name="destination"
                                    value={tripDetails.destination}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label={<><CalendarMonthIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />Number of Days</>}
                                    name="days"
                                    type="number"
                                    slotProps={{ htmlInput: { min: 1 } }}
                                    value={tripDetails.days}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label={<><PeopleIcon sx={{ fontSize: 20, verticalAlign: 'middle', mr: 1 }} />Number of Travelers</>}
                                    name="people"
                                    type="number"
                                    slotProps={{ htmlInput: { min: 1 } }}
                                    value={tripDetails.people}
                                    onChange={handleChange}
                                    required
                                    fullWidth
                                />
                                <Button variant="contained" type="submit" size="large" fullWidth sx={{ mt: 2 }}>
                                    <EditNoteIcon sx={{ fontSize: 22, verticalAlign: 'middle', mr: 1 }} />
                                    Start Planning
                                </Button>
                            </Stack>
                        </Box>
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            <ImportExportIcon sx={{ fontSize: 22, verticalAlign: 'middle', mr: 1 }} />
                            Import Trip
                            <input type="file" accept="application/json" onChange={handleImportTrip} hidden />
                        </Button>
                    </Box>
                </Card>
            </Container>
            <Box mt={2} />
            <Footer />
        </>
    );
}

export default Home;
