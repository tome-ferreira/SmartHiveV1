import {
  Autocomplete,
  Box,
  Container,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdCloseCircle } from "react-icons/io";
import { RiUserAddFill } from "react-icons/ri";

import currencies from "../../data/currencies";
import paymentMethods from "../../data/paymentMethods";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { AddFromCostumerModal } from "./SelectCostumerModal";
import { System } from "../../models/system";
import { CostumerRecordSimple } from "../../models/costumerRecordSimple";
import { SystemWithClientName } from "../../models/systemWithClientName";
import { useUpdateSystemHook } from "../../hooks/SystemsHooks";
import { FullSystemDetails } from "../../models/systemDetails";
import currencySymbols from "../../data/currencySymbols";
import { FullSystemFormData } from "../../models/fullSystemFormData";


interface EditSystemFormProps {
  system: FullSystemDetails;
  onSuccess: () => void;
}

export const EditSystemForm = ({ system, onSuccess }: EditSystemFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FullSystemDetails>({
    defaultValues: { ...system },
  });

  console.log("System info: ", system)

  const [openModal, setOpenModal] = useState(false);
  const [selectedCostumer, setSelectedCostumer] = useState<CostumerRecordSimple | null>(null);
  const { mutateAsync: updateSystem } = useUpdateSystemHook();
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>("");

  const currencyOptions = currencies.map((code) => ({
          code,
          label: `${currencySymbols[code] || ""} - ${code} `
      }));

  useEffect(() => {
    if (system.clientid) {
      setSelectedCostumer({
        id: system.clientid,
        Name: system.clientname,
      });
    }
  }, [system]);

  const handleCloseModal = () => setOpenModal(false);

  const onSubmit = (data: FullSystemDetails) => {
    if (!data.clientid) {
      data.clientid = undefined!;
    }

    console.log("Edited", { ...data });
    updateSystem({ ...data, id: system.id });
    onSuccess();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {/* Hidden ClientId */}
          <input
            type="hidden"
            {...register("clientid", { required: "Please select a costumer" })}
            value={selectedCostumer?.id || ""}
          />

          {/* Costumer name display */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Costumer"
              fullWidth
              disabled
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <Tooltip
                    title={
                      selectedCostumer ? "Remove selected costumer" : "Add a costumer"
                    }
                  >
                    <IconButton
                      edge="end"
                      onClick={() => {
                        if (selectedCostumer) {
                          setSelectedCostumer(null);
                          setValue("clientid", -1);
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
              error={!!errors.clientid}
              helperText={errors.clientid?.message}
              value={
                selectedCostumer?.Name ?? "Select a costumer"
              }
            />
          </Grid>

          {/* Name */}
          <Grid item xs={12} md={6}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <TextField
                  label="Name"
                  fullWidth
                  {...field}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>

          {/* RemoteAccessLink */}
          <Grid item xs={12}>
            <TextField
              label="Remote Access Link"
              fullWidth
              {...register("remoteaccesslink")}
              error={!!errors.remoteaccesslink}
              helperText={errors.remoteaccesslink?.message}
            />
          </Grid>

          {/* Downpayment */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Downpayment"
              fullWidth
              {...register("downpayment", { required: "Downpayment is required" })}
              error={!!errors.downpayment}
              helperText={errors.downpayment?.message}
              type="number"
            />
          </Grid>

          {/* Currency (Autocomplete Dropdown) */}
          <Grid item xs={12} md={6}>
            <Controller
              name="currency"
              control={control}
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
              <Autocomplete
                  options={currencyOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => {
                    if (typeof value === "string") {
                      return option.code === value;
                    }
                    return option.code === value.code;
                  }}
                  onChange={(_, value) => {
                    field.onChange(value?.code ?? "");
                    setSelectedCurrencySymbol(currencySymbols[value?.code as keyof typeof currencySymbols] || "");
                  }}
                  value={currencyOptions.find(opt => opt.code === field.value) || null}
                  renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Currency"
                    fullWidth
                    error={!!errors.currency}
                    helperText={errors.currency?.message}
                  />
                )}
              />
            )}
          />
          </Grid>

          {/* YearlyPayment */}
          <Grid item xs={10} md={5}>
           <TextField
              label="Yearly payment"
              fullWidth
              {...register("yearlypayment", { required: "Yearly payment is required" })}
              error={!!errors.yearlypayment}
              helperText={errors.yearlypayment?.message}
              type="number"
            />
          </Grid>
          {/* Symbol */}
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              value={selectedCurrencySymbol}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* MonthlyPayment */}
          <Grid item xs={10} md={5}>
            <TextField
              label="Monthly payment"
              fullWidth
              {...register("monthlypayment", { required: "Monthly payment is required" })}
              error={!!errors.monthlypayment}
              helperText={errors.monthlypayment?.message}
              type="number"
            />
          </Grid>
          {/* Symbol */}
          <Grid item xs={2} md={1}>
            <TextField
              fullWidth
              value={selectedCurrencySymbol}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />        
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <SmartHivePrimaryBtn type="submit" text="Update system" />
            </Box>
          </Grid>
        </Grid>
      </form>

      <AddFromCostumerModal
        open={openModal}
        onClose={handleCloseModal}
        onCostumerSelected={(costumer) => {
          setSelectedCostumer(costumer);
          setValue("clientid", costumer.id ?? -1);
          setOpenModal(false);
        }}
      />
    </Container>
  );
};
