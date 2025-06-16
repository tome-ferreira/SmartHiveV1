import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from "react";
import { FormsBase } from "../../models/formsBase";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { InterventionAppointmentFormData } from "../../models/interventionAppointmentFormData";
import { usePostInterventionAppointmentFormHook } from "../../hooks/FormsHooks";

interface Props {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userId: string;
  systemId: number;
}

const InterventionScheduleModal = ({ open, onClose, userName, userEmail, userId, systemId, }: Props) => {
  const [notes, setNotes] = useState("");
  const [interventionStart, setInterventionStart] = useState<Date | null>(null);
  const [interventionEnd, setInterventionEnd] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{
    notes?: string;
    interventionStart?: string;
    interventionEnd?: string;
  }>({});

  const mutation = usePostInterventionAppointmentFormHook();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!notes) newErrors.notes = "Notes are required";
    if (!interventionStart) newErrors.interventionStart = "Start time required";
    if (!interventionEnd) newErrors.interventionEnd = "End time required";
    else if (interventionStart && interventionEnd <= interventionStart)
      newErrors.interventionEnd = "End must be after start";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formBase: FormsBase = {
      Type: "interventionAppointment",
      Audience: "User",
      Name: userName,
      Email: userEmail,
      user_id: userId,
    };

    const formResponse: InterventionAppointmentFormData = {
      intervention_start: interventionStart!,
      intervention_end: interventionEnd!,
      notes,
      accepted: false,
      refused: false,
      system: systemId,
      base: 0,
    };

    mutation.mutate({ formBase, formResponse });

    onClose();
    setNotes("");
    setInterventionStart(null);
    setInterventionEnd(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Intervention</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <DateTimePicker
              label="Intervention Start"
              value={interventionStart}
              onChange={(value) => setInterventionStart(value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.interventionStart,
                  helperText: errors.interventionStart,
                },
              }}
            />
            <DateTimePicker
              label="Intervention End"
              value={interventionEnd}
              onChange={(value) => setInterventionEnd(value)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.interventionEnd,
                  helperText: errors.interventionEnd,
                },
              }}
            />
            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              error={!!errors.notes}
              helperText={errors.notes}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <SmartHivePrimaryBtn onClick={handleSubmit} text="Submit" />
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default InterventionScheduleModal;
