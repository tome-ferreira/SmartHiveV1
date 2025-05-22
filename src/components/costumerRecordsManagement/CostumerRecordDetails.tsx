import { Box, Container, Grid, TextField, Typography } from "@mui/material";
import { CostumerRecord } from "../../models/costumerRecord";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface CostumerRecordDetailsProps {
  costumerRecord: CostumerRecord;
}

export const CostumerRecordDetails = ({ costumerRecord }: CostumerRecordDetailsProps) => {
  const accountLinked = !!costumerRecord.UserId;

  return (
    <div className="mt-5">
        <Container>
            <Grid container spacing={3}>
                {/* Name */}
                <Grid item xs={12} md={7}>
                <TextField
                    label="Name"
                    fullWidth
                    value={costumerRecord.Name}
                    InputProps={{
                    readOnly: true,
                    
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={5}>
                <TextField
                    label="Email"
                    fullWidth
                    value={costumerRecord.Email}
                    InputProps={{
                    readOnly: true,
                    
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                </Grid>

                {/* Country */}
                <Grid item xs={12} md={4}>
                <TextField
                    label="Country"
                    fullWidth
                    value={costumerRecord.Country}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                />
                </Grid>

                {/* NIF */}
                <Grid item xs={12} md={4}>
                <TextField
                    label="NIF"
                    fullWidth
                    value={costumerRecord.NIF}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} md={4}>
                <TextField
                    label="Phone Number"
                    fullWidth
                    value={costumerRecord.PhoneNumber ?? ""}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                />
                </Grid>

                {/* Account Link Status */}
                <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1}>
                    {accountLinked ? (
                    <>
                        <CheckCircleOutlineIcon color="success" />
                        <Typography>An account is linked to this record.</Typography>
                    </>
                    ) : (
                    <>
                        <HighlightOffIcon color="error" />
                        <Typography>No account is linked to this record.</Typography>
                    </>
                    )}
                </Box>
                </Grid>
            </Grid>
            </Container>
    </div>
  );
};
