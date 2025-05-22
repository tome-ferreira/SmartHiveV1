import { useEffect, useState } from "react";
import { useGetCostumerRecordHook } from "../../hooks/CostumerRecordsHooks";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import { Box, Grid, Modal, Paper, Typography } from "@mui/material";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { CostumerRecordDetails } from "./CostumerRecordDetails";
import { EditRecordForm } from "./EditRecordForm";

interface DetailsEditRecordModalProps {
  open: boolean;
  onClose: () => void;
  recordId: any;
}

export const DetailsEditRecordModal = ({ open, onClose, recordId} : DetailsEditRecordModalProps) => {
    const { data: Record, error, isLoading, refetch } = useGetCostumerRecordHook(recordId);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            refetch(); 
        }
    }, [open]);

    return(
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Box
                className="flex items-center justify-center"
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '96rem',
                    outline: 'none',
                }}
            >
                <Paper className="rounded-xl shadow-xl w-full p-6 font-sans">
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <SmartHiveLoading />
                    </Box>
                )}

                {error && <p className="text-red-500">Error loading record</p>}

                {Record && (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={8} md={9}>
                            <Typography variant="h4">Costumer record details</Typography>
                            </Grid>
                            <Grid item xs={4} md={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
                            <SmartHivePrimaryBtn
                                className="w-100"
                                text={isEdit ? 'Go back' : 'Edit'}
                                onClick={() => setIsEdit(!isEdit)}
                            />
                            </Grid>
                        </Grid>

                        {isEdit ? (
                            <EditRecordForm record={Record} onSuccess={() => setIsEdit(false)} />
                        ) : (
                            <CostumerRecordDetails costumerRecord={Record} />
                        )}
                    </>
                )}
                </Paper>
            </Box>
        </Modal>

    );
}