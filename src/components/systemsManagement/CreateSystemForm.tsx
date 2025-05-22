import { Autocomplete, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { System } from "../../models/system";
import currencies from "../../data/currencies";
import paymentMethods from "../../data/paymentMethods";

interface CreateSystemFormProps{
    onSuccess: () => void;
}

export const CreateSystemForm = ({ onSuccess }: CreateSystemFormProps) => {
    const { register, handleSubmit, control, setValue, formState: { errors }, } = useForm<Omit<System, "id" | "created_at">>();
    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const onSubmit = (data: Omit<System, "id" | "created_at">) => {
        console.log(data);

        onSuccess();
    }

    return (
        <Container sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Create System Form
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3}>
                    {/* ClientId */}
                    <input
                        type="hidden"
                        {...register("ClientId")}
                        //value={selectedUser?.user_id || ""}
                    />

                    {/* Name */}
                    <Grid item xs={12} md={12}>
                        <TextField
                            label="Name"
                            fullWidth
                            {...register("Name", { required: "Name is required" })}
                            error={!!errors.Name}
                            helperText={errors.Name?.message}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={12}>
                        <TextField
                            label="Description"
                            fullWidth
                            {...register("Description")}
                            error={!!errors.Description}
                            helperText={errors.Description?.message}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid item xs={12} md={12}>
                        <TextField
                            label="Remote Access Link"
                            fullWidth
                            {...register("RemoteAccessLink")}
                            error={!!errors.RemoteAccessLink}
                            helperText={errors.RemoteAccessLink?.message}
                        />
                    </Grid>

                    {/* Currency (Autocomplete Dropdown) */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="Currency"
                            control={control}
                            rules={{ required: "Currency is required" }}
                            render={({ field }) => (
                                <Autocomplete
                                    options={currencies}
                                    onChange={(_, value) => field.onChange(value ?? "")}
                                    value={field.value || ""}
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                        label="Currency"
                                        fullWidth
                                        error={!!errors.Currency}
                                        helperText={errors.Currency?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    {/* Payment method (Autocomplete Dropdown) */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="PaymentMethod"
                            control={control}
                            rules={{ required: "Payment method is required" }}
                            render={({ field }) => (
                                <Autocomplete
                                    options={paymentMethods}
                                    onChange={(_, value) => field.onChange(value ?? "")}
                                    value={field.value || ""}
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                        label="Payment Method"
                                        fullWidth
                                        error={!!errors.PaymentMethod}
                                        helperText={errors.PaymentMethod?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>

                    {/* Downpayment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                        label="Downpayment"
                        fullWidth
                        {...register("Downpayment", { required: "Downpayment is required" })}
                        error={!!errors.Downpayment}
                        helperText={errors.Downpayment?.message}
                        />
                    </Grid>

                    {/* MonthlyPayment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                        label="Monthly payment"
                        fullWidth
                        {...register("MonthlyPayment", { required: "Monthly payment is required" })}
                        error={!!errors.MonthlyPayment}
                        helperText={errors.MonthlyPayment?.message}
                        />
                    </Grid>

                    {/* YearlyPayment */}
                    <Grid item xs={12} md={4}>
                        <TextField
                        label="Yearly payment"
                        fullWidth
                        {...register("YearlyPayment", { required: "Yearly payment is required" })}
                        error={!!errors.YearlyPayment}
                        helperText={errors.YearlyPayment?.message}
                        />
                    </Grid>


                </Grid>
            </form>
        </Container>
    );
}