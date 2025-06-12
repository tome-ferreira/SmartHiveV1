import { Divider, Grid, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { FullSystemDetails } from "../../models/systemDetails";
import { useEffect, useState } from "react";
import currencySymbols from "../../data/currencySymbols";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import SmartHiveDangerBtn from "../utils/btns/SmartHiveDangerBtn";

interface Props {
    system: FullSystemDetails
}

export const UserSystemDetails = ({ system }: Props) => {
    const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState("");
    var status: string = "";
    var statusColor: string = "";
    var statusTextColor: string = "000";

    if(system.installation_product_active && !system.isactive && !system.maintenance_product_active){
        status = "Awaiting installation downpayment";
        statusColor = "#f44336";
        statusTextColor = "#fff";
    }else if(!system.installation_product_active && !system.isactive && !system.maintenance_product_active){
        status = "Awaiting installation";
        statusColor = "#fdd835";
    }else if(!system.installation_product_active && system.isactive && system.maintenance_product_active){
        status = "Maintnence fase";
        statusColor = "#00e676";
    }

    useEffect(() => {
        if (system.currency) {
          setSelectedCurrencySymbol(
            currencySymbols[system.currency as keyof typeof currencySymbols] || ""
          );
        }
    }, [system]);

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Typography variant="subtitle1" className="mb-3">
                        {system?.description}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Divider />
                </Grid>

                <Grid item xs={3} md={3}>
                    <Typography variant="h4">
                        Status:
                    </Typography>
                </Grid>
                <Grid item xs={9} md={9}>
                    <Paper sx={{ backgroundColor: statusColor, padding: 2, color: statusTextColor }}>
                    <Typography variant="h6">
                        {status}
                    </Typography>
                </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Divider />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Typography variant="h4">
                        Pricing:
                    </Typography>
                </Grid>

                {/* Downpayment */}
                <Grid item xs={12} md={4}>
                    <Paper className="p-2">
                        <Typography variant="h6">
                            Downpayment:
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={9} md={9}>
                                <TextField
                                    fullWidth
                                    value={system.downpayment}
                                    InputProps={{ readOnly: true, sx: { cursor: "default" }}}
                                />
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <TextField
                                    fullWidth
                                    value={selectedCurrencySymbol}
                                    InputProps={{ readOnly: true, sx: { cursor: "default" }}}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Yearly price */}
                <Grid item xs={12} md={4}>
                    <Paper className="p-2">
                        <Typography variant="h6">
                            Yearly payment:
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={9} md={9}>
                                <TextField
                                    fullWidth
                                    value={system.yearlypayment}
                                    InputProps={{ readOnly: true, sx: { cursor: "default" }}}
                                />
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <TextField
                                    fullWidth
                                    value={selectedCurrencySymbol}
                                    InputProps={{ readOnly: true, sx: { cursor: "default" }}}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Monthly price */}
                <Grid item xs={12} md={4}>
                    <Paper className="p-2">
                        <Typography variant="h6">
                            Monthly payment:
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={9} md={9}>
                                <TextField
                                    fullWidth
                                    value={system.monthlypayment}
                                    InputProps={{ readOnly: true, sx: { cursor: "default" }}}
                                />
                            </Grid>
                            <Grid item xs={3} md={3}>
                                <TextField
                                    fullWidth
                                    value={selectedCurrencySymbol}
                                    InputProps={{ readOnly: true, sx: { cursor: "default" }}}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Divider />
                </Grid>

                <Paper>
                   <Grid container spacing={3} className="p-3">
                         <Grid item xs={12} md={12}>
                            <Typography variant="h4">
                                Costumer suport
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SmartHivePrimaryBtn text="Request system intervation" className="w-100"/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SmartHiveDangerBtn label="Request end of service" className="w-100"/>
                        </Grid>
                   </Grid>
                </Paper>
                

            </Grid>
        </>
    );
};