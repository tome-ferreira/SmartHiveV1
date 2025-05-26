import { Container, Grid, TextField } from "@mui/material";
import { useGetCostumerRecordHook } from "../../hooks/CostumerRecordsHooks";
import { System } from "../../models/system";
import { SystemWithClientName } from "../../models/systemWithClientName";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";

interface SystemDetailsProps {
    system: SystemWithClientName;
}

export const SystemDetails = ({system}: SystemDetailsProps) => {


    return(
        <div className="mt-5">
            <Container>
                <Grid container spacing={3}>
                    {/* Costumer name display */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label={"Costumer"}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.clientname
                            }
                        />
                    </Grid>

                    {/* Name */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Name"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.name
                            }
                        />                   
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.description
                            }
                        />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={12}>
                        <TextField
                            label="Remote Access Link"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.remoteaccesslink
                            }
                        />
                    </Grid>

                    {/* Currency (Autocomplete Dropdown) */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Currency"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.currency
                            }
                        />
                    </Grid>

                    {/* Payment method (Autocomplete Dropdown) */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Payment method"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.paymentmethod
                            }
                        />
                    </Grid>

                    {/* Downpayment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Downpayment"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.downpayment
                            }
                        />
                    </Grid>

                    {/* MonthlyPayment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Monthly payment"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.monthlypayment
                            }
                        />
                    </Grid>

                    {/* YearlyPayment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Yearly payment"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                               readOnly: true,
                            }}
                            value={
                                system?.yearlypayment
                            }
                        />
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}