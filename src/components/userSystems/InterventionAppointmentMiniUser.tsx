import { Accordion, AccordionDetails, AccordionSummary, Button, Paper } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WiMoonFull } from "react-icons/wi";
import { useState } from "react";
import { InterventionAppointment } from "../../models/interventionAppointment";
import { useAcceptInterventionAppointmentHook, useRefuseInterventionAppointmentHook } from "../../hooks/FormsHooks";

type InterventionAppointmentMiniProps = {
  appointment: InterventionAppointment;
  systemId: string;
};

const InterventionAppointmentMiniUser: React.FC<InterventionAppointmentMiniProps> = ({ appointment, systemId }) => {
  const [expanded, setExpanded] = useState(false);
  const { mutateAsync: acceptAppointment } = useAcceptInterventionAppointmentHook();
  const { mutateAsync: refuseAppointment } = useRefuseInterventionAppointmentHook();

  const handleAccordionChange = async () => {
    setExpanded(!expanded);
  };

    const formatDate = (dateStr: string | null) => {
        return dateStr ? new Date(dateStr).toLocaleString() : "Not set";
    };

      const handleAccept = async () => {
            await acceptAppointment({
                appointmentId: appointment.intervention_id,
                systemId: systemId
            });
        };

        const handleRefuse = async () => {
            await refuseAppointment({
                appointmentId: appointment.intervention_id,
                systemId: systemId
            });
        };

  return (
    <Accordion expanded={expanded} onChange={handleAccordionChange}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} className="bg-gray-50">
        <Paper className="w-full p-3">
          <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center">
            {/* Left - Time info */}
            <div className="flex-1">
              <p className="text-sm font-medium">Start: {formatDate(appointment.intervention_start)}</p>
              <p className="text-sm font-medium">End: {formatDate(appointment.intervention_end)}</p>
            </div>

            {/* Middle - Status */}
            <div className="flex-1">
              <p className="text-sm">
                {appointment.accepted && "✅ Accepted"}
                {appointment.refused && "❌ Refused"}
                {!appointment.accepted && !appointment.refused && "⏳ Pending"}
              </p>
            </div>

             {/* Right - Buttons */}
            <div className="flex-1 flex justify-end gap-2">
              <Button
                size="small"
                variant="outlined"
                color="success"
                disabled={!!(appointment.refused || appointment.accepted)}
                onClick={(e) => {
                    e.stopPropagation();
                    handleAccept();
                }}
                >
                    Accept
                </Button>

                <Button
                size="small"
                variant="outlined"
                color="error"
                disabled={!!(appointment.refused || appointment.accepted)}
                onClick={(e) => {
                    e.stopPropagation(); 
                    handleRefuse();
                }}
                >
                    Refuse
                </Button>
            </div>
          </div>
        </Paper>
      </AccordionSummary>

      <AccordionDetails>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">
          {appointment.notes || "No notes provided."}
        </p>
      </AccordionDetails>
    </Accordion>
  );
};

export default InterventionAppointmentMiniUser;
