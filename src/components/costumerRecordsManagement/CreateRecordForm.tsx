import { Autocomplete, Box, Button, Container, Grid, TextField, Typography } from "@mui/material";
import { CostumerRecord } from "../../models/costumerRecord";
import { useForm, Controller } from "react-hook-form";
import countries from "../../data/countries";
import { useState } from "react";
import { AddFromUserModal } from "./AddFromUserModal";
import { UserSimple } from "../../models/userSimple";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { usePostCostumerRecordHook } from "../../hooks/CostumerRecordsHooks";

/*ICONS*/
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
/*******/
interface CreateRecordFormProps {
    onSuccess: () => void;
}


export const CreateRecordForm = ({ onSuccess }: CreateRecordFormProps) => {
    const { register, handleSubmit, control, setValue, formState: { errors }, } = useForm<Omit<CostumerRecord, "id" | "created_at">>();
    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserSimple | null>(null);
    const { mutateAsync: addUserToRole } = usePostCostumerRecordHook();
    

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const onSubmit = (data: Omit<CostumerRecord, "id" | "created_at">) => {
        if(data.UserId === ""){
            data.UserId = null
        }
        addUserToRole(data);
        onSuccess();
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Customer Record Form
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    {/* Name */}
                    <Grid item xs={12} md={5}>
                        <TextField
                            label="Name"
                            fullWidth
                            disabled={!!selectedUser}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                            endAdornment: selectedUser ? <LockOutlinedIcon color="disabled" /> : null,
                            style: selectedUser ? { backgroundColor: "#f5f5f5" } : {},
                            }}
                            {...register("Name", { required: "Name is required" })}
                            error={!!errors.Name}
                            helperText={errors.Name?.message}
                        />
                    </Grid>

                    {/* Email */}
                    <Grid item xs={12} md={5}>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            disabled={!!selectedUser}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                            endAdornment: selectedUser ? <LockOutlinedIcon color="disabled" /> : null,
                            style: selectedUser ? { backgroundColor: "#f5f5f5" } : {},
                            }}
                            {...register("Email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email format",
                            },
                            })}
                            error={!!errors.Email}
                            helperText={errors.Email?.message}
                        />
                    </Grid>
                    <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'stretch' }}>
                        <SmartHivePrimaryBtn
                            className="w-100"
                            text={selectedUser ? "Clear user selection" : "Add from user"}
                            onClick={() => {
                                if (selectedUser) {
                                    setSelectedUser(null);
                                    setValue("Name", "");
                                    setValue("Email", "");
                                    setValue("UserId", undefined);
                                } else {
                                    setOpenModal(true);
                                }
                            }} 
                        />
                    </Grid>

                    {/* Country (Autocomplete Dropdown) */}
                    <Grid item xs={12} md={4}>
                        <Controller
                        name="Country"
                        control={control}
                        rules={{ required: "Country is required" }}
                        render={({ field }) => (
                            <Autocomplete
                            options={countries}
                            onChange={(_, value) => field.onChange(value ?? "")}
                            value={field.value || ""}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Country"
                                fullWidth
                                error={!!errors.Country}
                                helperText={errors.Country?.message}
                                />
                            )}
                            />
                        )}
                        />
                    </Grid>

                    {/* NIF */}
                    <Grid item xs={12} md={4}>
                        <TextField
                        label="NIF"
                        fullWidth
                        {...register("NIF", { required: "NIF is required" })}
                        error={!!errors.NIF}
                        helperText={errors.NIF?.message}
                        />
                    </Grid>

                    {/* Phone Number (optional) */}
                    <Grid item xs={12} md={4}>
                        <TextField
                        label="Phone Number"
                        type="number"
                        fullWidth
                        {...register("PhoneNumber", {
                            valueAsNumber: true,
                        })}
                        error={!!errors.PhoneNumber}
                        helperText={errors.PhoneNumber?.message}
                        />
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <SmartHivePrimaryBtn type="submit" text="Create record" />
                        </Box>
                    </Grid>
                </Grid>

                <input
                    type="hidden"
                    {...register("UserId")}
                    value={selectedUser?.user_id || ""}
                />
            </form>

            <AddFromUserModal
                open={openModal}
                onClose={handleCloseModal}
                onUserSelected={(user) => {
                    setSelectedUser(user);
                    setValue("Name", user.name_email ?? user.name_google ?? "");
                    setValue("Email", user.email);
                    setValue("UserId", user.user_id);
                    setOpenModal(false);
                }}
            />                 
        </Container>
    );
};