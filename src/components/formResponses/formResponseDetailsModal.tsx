import { useEffect } from "react";
import {
  Box,
  Grid,
  Modal,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { FormsBase } from "../../models/formsBase";
import { useGetContactFormDataHook, useMarkFormAsSeenHook } from "../../hooks/FormsHooks";
import { getDisplayType } from "./formResponseMini";

interface FormResponseDetailsModalProps {
  open: boolean;
  onClose: () => void;
  formBase: FormsBase;
}

export const FormResponseDetailsModal = ({ open, onClose, formBase, }: FormResponseDetailsModalProps) => {
  const { data: dataContact, error: errorContact, isLoading: loadingContact, refetch: contactRefetch, } = useGetContactFormDataHook(formBase.id || -1);
  const { mutateAsync: markAsSeen } = useMarkFormAsSeenHook();

    useEffect(() => {
        if (open && formBase.Type === "contact") {
            contactRefetch();

            if (formBase.Seen === false) {
            markAsSeen(formBase.id || -1);
            }
        }

        const handleSeen = async () => {
            if (formBase.Seen === false) {
                markAsSeen(formBase.id || -1);
            }
        };

        handleSeen();
    }, [open, formBase, markAsSeen]);


  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Box
        className="flex items-center justify-center"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "48rem",
          outline: "none",
        }}
      >
        <Paper elevation={6} sx={{ borderRadius: 3, p: 4, width: "100%" }}>
          <Typography variant="h5" gutterBottom>
            Sender Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Name
              </Typography>
              <Typography>{formBase.Name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography>{formBase.Email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Type
              </Typography>
              <Typography>{getDisplayType(formBase.Type)}</Typography>
            </Grid>
          </Grid>

          {formBase.Type === "contact" && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Contact Details
              </Typography>

              {loadingContact ? (
                <Box className="flex justify-center items-center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : errorContact ? (
                <Typography color="error">Failed to load contact details.</Typography>
              ) : (
                dataContact && (
                  <Grid container spacing={2}>
                    {dataContact.phone && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography>{dataContact.phone}</Typography>
                      </Grid>
                    )}
                    {dataContact.location && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography>{dataContact.location}</Typography>
                      </Grid>
                    )}
                    {dataContact.notes && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography>{dataContact.notes}</Typography>
                      </Grid>
                    )}
                  </Grid>
                )
              )}
            </>
          )}
        </Paper>
      </Box>
    </Modal>
  );
};
