import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField, Stack, Snackbar, Alert, } from "@mui/material";
import { useState } from "react";
import { FormsBase } from "../../models/formsBase";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { EndServiceRequestFormData } from "../../models/endServiceRequestFormData";
import { usePostEndServiceRequestFormHook } from "../../hooks/FormsHooks";

interface Props {
  open: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userId: string;
  systemId: number;
}

const EndServiceRequestFormModal = ({
  open,
  onClose,
  userName,
  userEmail,
  userId,
  systemId,
}: Props) => {
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{notes?: string }>({});
  const mutation = usePostEndServiceRequestFormHook();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!notes) newErrors.notes = "Notes are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const formBase: FormsBase = {
      Type: "endService",
      Audience: "Admin",
      Name: userName,
      Email: userEmail,
      user_id: userId,
    };

    const formResponse: EndServiceRequestFormData = {
      notes,
      system: systemId,
      base: 0, 
    };

    mutation.mutate(
      { formBase, formResponse },
    );

    onClose();
    setNotes("");
  };


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Request End of Service</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Notes"
              placeholder="Please let us now of your reasoning"
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

export default EndServiceRequestFormModal;
