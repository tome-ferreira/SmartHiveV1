import { Autocomplete, Box, Container, Grid, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { System } from "../../models/system";
import currencies from "../../data/currencies";
import paymentMethods from "../../data/paymentMethods";
import { CostumerRecordSimple } from "../../models/costumerRecordSimple";

/*ICONS*/
import { IoMdCloseCircle } from "react-icons/io";
import { RiUserAddFill } from "react-icons/ri";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { usePostSystemHook } from "../../hooks/SystemsHooks";
import { AddFromCostumerModal } from "./SelectCostumerModal";
import { FullSystemFormData } from "../../models/fullSystemFormData";
/*******/

interface CreateSystemFormProps{
    onSuccess: () => void;
}

export const CreateSystemForm = ({ onSuccess }: CreateSystemFormProps) => {
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FullSystemFormData>();
    const [openModal, setOpenModal] = useState(false);
    const [selectedCostumer, setSelectedCostumer] = useState<CostumerRecordSimple | null>(null);
    const { mutateAsync: createSystem } = usePostSystemHook();

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const onSubmit = (data: FullSystemFormData) => {
        createSystem(data).then(() => {
            onSuccess();
        });
    };

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
                        {...register("ClientId", {required:"Please select a costumer"})}
                        value={selectedCostumer?.id || undefined}
                    />
                    {/* Costumer name display */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            label={"Costumer"}
                            fullWidth
                            disabled
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                endAdornment: (
                                    <Tooltip
                                        title={
                                            selectedCostumer
                                                ? "Remove selected costumer"
                                                : "Add a new costumer"
                                        }
                                    >
                                        <IconButton
                                            edge="end"
                                            onClick={() => {
                                                if (selectedCostumer) {
                                                    setSelectedCostumer(null); 
                                                    setValue("ClientId", -1);
                                                } else {
                                                    setOpenModal(true);
                                                }
                                            }}
                                        >
                                            {selectedCostumer ? (
                                                <IoMdCloseCircle color="red" />
                                            ) : (
                                                <RiUserAddFill />
                                            )}
                                        </IconButton>
                                    </Tooltip>
                                ),
                            }}
                            error={!!errors.ClientId}
                            helperText={errors.ClientId?.message}
                            value={
                                selectedCostumer ? selectedCostumer.Name : "Select a costumer"
                            }
                        />
                    </Grid>

                    {/* Name */}
                    <Grid item xs={12} md={6}>
                        <Controller
                            name="Name"
                            control={control}
                            rules={{ required: "Name is required" }}
                            render={({ field }) => (
                                <TextField
                                    label="Name"
                                    fullWidth
                                    {...field}
                                    error={!!errors.Name}
                                    helperText={errors.Name?.message}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
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
                        type="number"
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
                        type="number"
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
                        type="number"
                        />
                    </Grid>
                        
                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <SmartHivePrimaryBtn type="submit" text="Create system" />
                        </Box>
                    </Grid>

                </Grid>
            </form>

            <AddFromCostumerModal
                open={openModal}
                onClose={handleCloseModal}
                onCostumerSelected={(costumer) => {
                    setSelectedCostumer(costumer);
                    setValue("ClientId", costumer.id ?? -1); 
                    setOpenModal(false);
                    setValue("Name", costumer.Name + "'s system"); 
                }}
            />
        </Container>
    );
}