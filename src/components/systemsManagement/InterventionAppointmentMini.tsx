import { Accordion, AccordionDetails, AccordionSummary, Paper } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { WiMoonFull } from "react-icons/wi";
import { useState } from "react";
import { InterventionAppointment } from "../../models/interventionAppointment";

type InterventionAppointmentMiniProps = {
  appointment: InterventionAppointment;
};

const InterventionAppointmentMini: React.FC<InterventionAppointmentMiniProps> = ({ appointment }) => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = async () => {
    setExpanded(!expanded);
  };

    const formatDate = (dateStr: string | null) => {
        return dateStr ? new Date(dateStr).toLocaleString() : "Not set";
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

            {/* Right - Seen icon */}
            <div className="flex-1 text-right">
              {!appointment.seen && (
                <WiMoonFull className="inline-block text-eucalyptus-500 text-xl" />
              )}
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

export default InterventionAppointmentMini;
