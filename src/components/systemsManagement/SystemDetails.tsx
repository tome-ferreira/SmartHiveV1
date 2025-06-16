import { Box, Container, Divider, Grid, TextField, Typography } from "@mui/material";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { FullSystemDetails } from "../../models/systemDetails";
import { useState } from "react";
import InterventionScheduleModal from "./InterventionScheduleModal";
import { useAuth } from "../../contexts/AuthContext";
import { data } from "react-router";
import { useGetSystemsInterventionAppointmentsHook } from "../../hooks/FormsHooks";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import InterventionAppointmentMini from "./InterventionAppointmentMini";

interface SystemDetailsProps {
    system: FullSystemDetails;
}

export const SystemDetails = ({ system }: SystemDetailsProps) => {
    const [interventionModalOpen, setInterventionModalOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="mt-5">
            <Container>
                <Grid container spacing={3}>
                    {/* Client Name */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Client"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.clientname}
                        />
                    </Grid>

                    {/* Name */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="System Name"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.name}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.description}
                        />
                    </Grid>

                    {/* Remote Access */}
                    <Grid item xs={12}>
                        <TextField
                            label="Remote Access Link"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.remoteaccesslink}
                        />
                    </Grid>

                    {/* Currency */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Currency"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.currency || ""}
                        />
                    </Grid>

                    {/* Is Active */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Active"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.isactive ? "Yes" : "No"}
                        />
                    </Grid>

                    {/* Downpayment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Downpayment"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.downpayment ?? ""}
                        />
                    </Grid>

                    {/* Monthly Payment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Monthly Payment"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.monthlypayment ?? ""}
                        />
                    </Grid>

                    {/* Yearly Payment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Yearly Payment"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ readOnly: true }}
                            value={system?.yearlypayment ?? ""}
                        />
                    </Grid>

                    {/* Intervention schedule */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" className="text-center md:text-left">
                            Interventions schedule
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className="flex justify-center md:justify-end">
                            <SmartHivePrimaryBtn text="Schedule a intervention" onClick={() => setInterventionModalOpen(true)}/>
                        </div>
                    </Grid>

                    {/* Appointments list */}
                    <Grid item xs={12}>
                        <Divider className="my-4" />

                        {/** Fetch and display appointments */}
                        {(() => {
                            const { data, isLoading, error } = useGetSystemsInterventionAppointmentsHook(system.id);

                            console.log(system.id);

                            if (isLoading) {
                                return (<Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <SmartHiveLoading />
                                        </Box>);

                            }

                            if (error) {
                            return <p className="text-red-500">Error loading record</p>;
                            }

                            if (!data || data.length === 0) {
                            return <Typography>No upcoming appointments.</Typography>;
                            }

                            return (
                            <div className="flex flex-col gap-3 mt-2">
                                {data.map((appointment) => (
                                    <InterventionAppointmentMini key={appointment.intervention_id} appointment={appointment} />
                                ))}
                            </div>
                            );
                        })()}
                    </Grid>
                </Grid>
            </Container>

            <InterventionScheduleModal 
                open={interventionModalOpen}
                onClose={() => setInterventionModalOpen(false)}
                userName={user?.user_metadata.display_name ||""}        
                userEmail={user?.email || ""} 
                userId={user?.id || ""} 
                systemId={system.id}
            />
        </div>
    );
};
