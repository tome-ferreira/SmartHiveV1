import { Box, Button, Modal, Paper, TextField, Typography } from "@mui/material";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import SmartHiveDangerBtn from "../utils/btns/SmartHiveDangerBtn";
import { useDeleteSystemHook, useGetSystemHook } from "../../hooks/SystemsHooks";
import { useDeleteFormHook } from "../../hooks/FormsHooks";

interface DeleteFormModalProps {
  open: boolean;
  onClose: () => void;
  formId: any;
}

export const DeleteFormModal = ({ open, onClose, formId }: DeleteFormModalProps) => {
  const { mutateAsync: deleteForm } = useDeleteFormHook();
  
  const handleDelete = async () => {
      await deleteForm(formId);
      onClose();
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Box
        className="flex items-center justify-center"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '36rem',
          outline: 'none',
        }}
      >
        <Paper className="rounded-xl shadow-xl w-full p-6 font-sans">
          
              <Typography variant="h6" gutterBottom>
                Confirm deletion
              </Typography>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this form response?
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <SmartHivePrimaryBtn onClick={onClose} text="Cancel" />
                <SmartHiveDangerBtn onClick={handleDelete} label="Delete" />
              </Box>

        </Paper>
      </Box>
    </Modal>
  );
};
