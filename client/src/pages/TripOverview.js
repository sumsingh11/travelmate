import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import ActionButtons from "../components/TripOverview/ActionButtons"
import AdditionalExpenses from "../components/TripOverview/AdditionalExpenses"
import BudgetAndCosts from "../components/TripOverview/BudgetAndCosts"
import Flights from "../components/TripOverview/Flights"
import Stay from "../components/TripOverview/Stay"
import ToDoList from "../components/TripOverview/ToDoList"
import TripDays from "../components/TripOverview/TripDays"
import TripHeader from "../components/TripOverview/TripHeader"
// Material-UI imports
import { Alert, Container, Grid } from "@mui/material"

function TripOverview() {
  const navigate = useNavigate();
  const [updateBudget, setUpdateBudget] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("danger");

  // Function to trigger budget update
  const handleExpensesUpdate = () => {
    setUpdateBudget((prev) => !prev);
  };

  // Function to refresh trip details when edited
  const refreshTripDetails = useCallback(() => {
    const updatedTrip = JSON.parse(localStorage.getItem("tripDetails")) || {};
    setTripDetails(updatedTrip);
    setForceRender((prev) => !prev);
    handleExpensesUpdate();
  }, []);

  // Function to show alerts
  const showAlert = (message, variant = "danger") => {
    setAlertMessage(message);
    setAlertVariant(variant);

    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const storedTrip = JSON.parse(localStorage.getItem("tripDetails"));
    if (!storedTrip || !storedTrip.destination) {
      navigate("/");
    } else {
      setTripDetails(storedTrip);
    }
  }, [navigate]);

  return (
    <div key={forceRender}>
      <TripHeader tripDetails={tripDetails} />

      {/* Pass showAlert to ActionButtons */}
      <ActionButtons refreshTripDetails={refreshTripDetails} showAlert={showAlert} />

      {/* Show alert below action buttons */}
      {alertMessage && (
        <Container sx={{ mt: 3 }}>
          <Alert severity={alertVariant} sx={{ textAlign: "center" }}>
            {alertMessage}
          </Alert>
        </Container>
      )}

      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Flights & Stays Section */}
        <Grid container spacing={0} alignItems="stretch">
          <Grid item md={6} xs={12} display="flex">
            <div style={{ width: "100%", height: "100%" }}>
              <Flights onBudgetUpdate={handleExpensesUpdate} />
            </div>
          </Grid>
          <Grid item md={6} xs={12} display="flex">
            <div style={{ width: "100%", height: "100%" }}>
              <Stay onBudgetUpdate={handleExpensesUpdate} />
            </div>
          </Grid>
          {/* Expenses, Budget & To-Do */}
          <Grid item md={4} xs={12} display="flex">
            <div style={{ width: "100%", height: "100%" }}>
              <AdditionalExpenses onExpensesUpdate={handleExpensesUpdate} />
            </div>
          </Grid>
          <Grid item md={4} xs={12} display="flex">
            <div style={{ width: "100%", height: "100%" }}>
              <BudgetAndCosts updateTrigger={updateBudget} />
            </div>
          </Grid>
          <Grid item md={4} xs={12} display="flex">
            <div style={{ width: "100%", height: "100%" }}>
              <ToDoList />
            </div>
          </Grid>
        </Grid>

        {/* Trip Days Section */}
        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <TripDays key={forceRender} />
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
}

export default TripOverview;
