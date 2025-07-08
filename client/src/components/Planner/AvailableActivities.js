import AdsClickIcon from '@mui/icons-material/AdsClick'
import EditNoteIcon from '@mui/icons-material/EditNote'
import MoneyIcon from '@mui/icons-material/Money'
import { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import ListGroup from "react-bootstrap/ListGroup"
import { useNavigate } from "react-router-dom"
function AvailableActivities({ activities, dayPlan }) {
  const navigate = useNavigate();
  const [unscheduledActivities, setUnscheduledActivities] = useState([]);

  useEffect(() => {
    // Filter out activities that are already scheduled
    const filteredActivities = activities.filter(
      (act) => !dayPlan.some((scheduledAct) => scheduledAct.id === act.id)
    );
    setUnscheduledActivities(filteredActivities);
  }, [activities, dayPlan]);

  return (
    <Card className="shadow-sm p-4">
      <Card.Body>
        <h4 className="text-center"><AdsClickIcon/> Available Activities</h4>
        <ListGroup className="mt-3">
          {unscheduledActivities.length > 0 ? (
            unscheduledActivities.map((activity) => (
              <ListGroup.Item
  key={activity.id}
  className="d-flex justify-content-between align-items-center"
  draggable
  onDragStart={(e) => {
    e.dataTransfer.setData("activity", JSON.stringify(activity));
  }}
>
  <div className="text-start">
    <strong>{activity.title}</strong>
    <p className="mb-1">{activity.description || "No description available"}</p>
    <span className="text-muted"><MoneyIcon /> Cost Per Person: ${parseFloat(activity.cost).toFixed(2)}</span>
  </div>
  <span className="text-muted">📌 Drag to schedule</span>
</ListGroup.Item>

            ))
          ) : (
            <p className="text-muted text-center">No available activities.</p>
          )}
        </ListGroup>

        {/* Manage Activities Button */}
        <div className="text-center mt-4">
          <Button onClick={() => navigate("/activities")}>
             <EditNoteIcon /> Manage Activities
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default AvailableActivities;
