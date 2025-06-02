import { Container, Grid, TextField } from "@mui/material";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { FullSystemDetails } from "../../models/systemDetails";

interface SystemDetailsProps {
    system: FullSystemDetails;
}

export const SystemDetails = ({ system }: SystemDetailsProps) => {
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
                </Grid>
            </Container>
        </div>
    );
};
