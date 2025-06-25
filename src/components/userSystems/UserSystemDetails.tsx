import { Box, Chip, Divider, Grid, Paper, Stack, TextField, Typography, } from "@mui/material";
import { useEffect, useState } from "react";
import { FullSystemDetails } from "../../models/systemDetails";
import currencySymbols from "../../data/currencySymbols";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import SmartHiveDangerBtn from "../utils/btns/SmartHiveDangerBtn";
import InterventionRequestFormModal from "./InterventionRequestFormModal";
import { useAuth } from "../../contexts/AuthContext";
import EndServiceRequestFormModal from "./EndServiceRequestFormModal";
import { useGetSystemsInterventionAppointmentsHook } from "../../hooks/FormsHooks";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import InterventionAppointmentMiniUser from "./InterventionAppointmentMiniUser";
import { handleDownpayment } from "../../edge-functions-triggers/handle_stripe_downpayment";
import { handleSubscription } from "../../edge-functions-triggers/handle_stripe_subscription";

interface Props {
    system: FullSystemDetails;
}

export const UserSystemDetails = ({ system }: Props) => {
    const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [endMoodalOpen, setEndModalOpen] = useState(false);
    const { user } = useAuth();

    let status = "";
    let statusColor = "default";

    if (system.installation_product_active && !system.isactive ) {
        status = "Awaiting installation downpayment";
        statusColor = "error";
    } else if (!system.installation_product_active && !system.isactive ) {
        status = "Awaiting installation";
        statusColor = "warning";
    } else if (!system.installation_product_active && system.isactive ) {
        status = "Maintenance phase";
        statusColor = "success";
    }

    useEffect(() => {
        if (system.currency) {
            setSelectedCurrencySymbol(
                currencySymbols[system.currency as keyof typeof currencySymbols] || ""
            );
        }
    }, [system]);

    return (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3,  width: "100%", overflowX: "hidden" }}>
            <Stack spacing={4}>
                {/* Description */}
                <Typography variant="h6" fontWeight="medium">
                    {system?.description}
                </Typography>

                <Divider />

                {/* Status */}
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h6">Status:</Typography>
                    <Chip label={status} color={statusColor as any} size="medium" />
                </Stack>

                <Divider />

                {/* Pricing Section */}
                <Box>
                    <Typography variant="h6" mb={2}>
                        Pricing
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Downpayment */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Downpayment
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={9}>
                                        <TextField
                                            fullWidth
                                            value={system.downpayment}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            value={selectedCurrencySymbol}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    {status === "Awaiting installation downpayment" && (
                                        <Grid item xs={12}>
                                            <SmartHivePrimaryBtn
                                            text="Pay Downpayment"
                                            onClick={() => handleDownpayment(system)}
                                            className="w-full"
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Yearly */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Yearly Payment
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={9}>
                                        <TextField
                                            fullWidth
                                            value={system.yearlypayment}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            value={selectedCurrencySymbol}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    {status === "Maintenance phase" && (
                                        <Grid item xs={12}>
                                            <SmartHivePrimaryBtn
                                                text="Subscribe Yearly"
                                                className="w-full"
                                                onClick={() => handleSubscription(system, "yearly")}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        </Grid>


                        {/* Monthly */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Monthly Payment
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={9}>
                                        <TextField
                                            fullWidth
                                            value={system.monthlypayment}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            fullWidth
                                            value={selectedCurrencySymbol}
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    {status === "Maintenance phase" && (
                                        <Grid item xs={12}>
                                            <SmartHivePrimaryBtn
                                                text="Subscribe Monthly"
                                                className="w-full"
                                                onClick={() => handleSubscription(system, "monthly")}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                <Divider />

                {/* Support Actions */}
                <Box>
                    <Typography variant="h6" mb={2}>
                        Customer Support
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <SmartHivePrimaryBtn text="Request System Intervention" className="w-full" onClick={() => setModalOpen(true)} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SmartHiveDangerBtn label="Request End of Service" className="w-full" onClick={() => setEndModalOpen(true)}/>
                        </Grid>
                    </Grid>
                </Box>



                <Divider />

                {/* Intervention Schedule */}
                <Box>
                    <Typography variant="h6" mb={2}>
                        Intervention Schedule
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            {/** Fetch and display appointments */}
                            {(() => {
                                const { data, isLoading, error } = useGetSystemsInterventionAppointmentsHook(system.id);
                        
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
                                            <InterventionAppointmentMiniUser key={appointment.intervention_id} appointment={appointment} systemId={system.id.toString()}/>
                                        ))}
                                    </div>
                                );
                            })()}
                        </Grid>
                    </Grid>
                </Box>
            </Stack>

            <InterventionRequestFormModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                userName={user?.user_metadata.display_name ||""}        
                userEmail={user?.email || ""} 
                userId={user?.id || ""} 
                systemId={system.id}
            />

            <EndServiceRequestFormModal 
                open={endMoodalOpen}
                onClose={() => setEndModalOpen(false)}
                userName={user?.user_metadata.display_name ||""}        
                userEmail={user?.email || ""} 
                userId={user?.id || ""} 
                systemId={system.id}
            />
        </Paper>
    );
};




