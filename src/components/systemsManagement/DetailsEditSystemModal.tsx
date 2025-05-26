import { useEffect, useState } from "react";
import { useGetSystemHook } from "../../hooks/SystemsHooks";
import { Box, Grid, Modal, Paper, Typography } from "@mui/material";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { SystemDetails } from "./SystemDetails";
import { EditSystemForm } from "./EditSystemForm";

interface DetailsEditSystemModalProps {
    open: boolean;
    onClose: () => void;
    systemId: any;
}

export const DetailsEditSystemModal = ({ open, onClose, systemId} : DetailsEditSystemModalProps) => {
    const {data: System, error, isLoading, refetch} = useGetSystemHook(systemId);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        if(open){
            refetch();
        }
    }, [open]);

    return (<div>
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

                {System && (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs={8} md={9}>
                                <Typography variant="h4">System details</Typography>
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
                            <EditSystemForm system={System} onSuccess={() => setIsEdit(false)} />
                        ) : (
                            <SystemDetails system={System} />
                        )}
                    </>
                )}
                </Paper>
            </Box>
        </Modal>
    </div>);
}