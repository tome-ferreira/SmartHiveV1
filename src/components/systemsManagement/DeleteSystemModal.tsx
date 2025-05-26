import { useEffect, useState } from "react";
import { useDeleteCostumerRecordHook } from "../../hooks/CostumerRecordsHooks";
import { Box, Button, Modal, Paper, TextField, Typography } from "@mui/material";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import SmartHiveDangerBtn from "../utils/btns/SmartHiveDangerBtn";
import { useDeleteSystemHook, useGetSystemHook } from "../../hooks/SystemsHooks";

interface DeleteSystemModalProps {
  open: boolean;
  onClose: () => void;
  systemId: any;
}

export const DeleteSystemModal = ({ open, onClose, systemId }: DeleteSystemModalProps) => {
  const { data: System, error, isLoading, refetch } = useGetSystemHook(systemId);
  const { mutateAsync: deleteSystem } = useDeleteSystemHook();

  const [confirmInput, setConfirmInput] = useState("");

  useEffect(() => {
    if (open) {
      refetch();
      setConfirmInput(""); 
    }
  }, [open]);

  const handleDelete = async () => {
    if (System?.name + " " + System?.clientname === confirmInput) {
      await deleteSystem(systemId);
      onClose();
    }
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
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <SmartHiveLoading />
            </Box>
          )}

          {error && <p className="text-red-500">Error loading system</p>}

          {System && (
            <>
              <Typography variant="h6" gutterBottom>
                Confirm deletion
              </Typography>
              <Typography variant="body1" gutterBottom>
                Please type the name and client's name of the system to confirm deletion. "<strong>{System.name} {System.clientname}</strong>"
              </Typography>

              <TextField
                label="Email confirmation"
                fullWidth
                margin="normal"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                inputProps={{ autoComplete: "off" }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <SmartHivePrimaryBtn onClick={onClose} text="Cancel" />
                <SmartHiveDangerBtn onClick={handleDelete} disabled={confirmInput !== System?.name + " " + System?.clientname  } label="Delete" />
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Modal>
  );
};
