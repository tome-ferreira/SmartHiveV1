import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField, Stack, Snackbar, Alert, } from "@mui/material";
import { useState } from "react";
import { FormsBase } from "../../models/formsBase";
import { InterventionRequestFormData } from "../../models/interventionRequestFormData";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { usePostInterventionRequestFormHook } from "../../hooks/FormsHooks";
import { useMutation } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userId: string;
  systemId: number;
}

const InterventionRequestFormModal = ({
  open,
  onClose,
  userName,
  userEmail,
  userId,
  systemId,
}: Props) => {
  const [type, setType] = useState<"fix" | "change">("change");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ type?: string; notes?: string }>({});
  const mutation = usePostInterventionRequestFormHook();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!type) newErrors.type = "Type is required";
    if (!notes) newErrors.notes = "Notes are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formBase: FormsBase = {
      Type: "interventionRequest",
      Audience: "Admin",
      Name: userName,
      Email: userEmail,
      user_id: userId,
    };

    const formResponse: InterventionRequestFormData = {
      type,
      notes,
      system: systemId,
      base: 0, 
    };

    mutation.mutate(
      { formBase, formResponse },
    );

    onClose();
    setType("change");
    setNotes("");
  };

  const getPlaceholder = () => {
    switch (type) {
      case "fix":
        return "Please describe the problem you wish to see fixed";
      case "change":
        return "Please describe your desired modification";
      default:
        return "";
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Request System Intervention</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              select
              label="Intervention Type"
              value={type}
              onChange={(e) => setType(e.target.value as "fix" | "change")}
              error={!!errors.type}
              helperText={errors.type}
              fullWidth
            >
              <MenuItem value="fix">Fix a problem</MenuItem>
              <MenuItem value="change">Modify the system</MenuItem>
            </TextField>

            <TextField
              label="Notes"
              placeholder={getPlaceholder()}
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
          <SmartHivePrimaryBtn onClick={handleSubmit} text="Submit"/>
       </DialogActions>
      </Dialog>
    </>
  );
};

export default InterventionRequestFormModal;
