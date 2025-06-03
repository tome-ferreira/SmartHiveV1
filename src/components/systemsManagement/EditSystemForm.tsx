import {
  Autocomplete,
  Box,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoMdCloseCircle } from "react-icons/io";
import { RiUserAddFill } from "react-icons/ri";

import currencies from "../../data/currencies";
import paymentMethods from "../../data/paymentMethods";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import { AddFromCostumerModal } from "./SelectCostumerModal";
import { CostumerRecordSimple } from "../../models/costumerRecordSimple";
import { useUpdateSystemHook } from "../../hooks/SystemsHooks";
import currencySymbols from "../../data/currencySymbols";
import { FullSystemDetails } from "../../models/systemDetails";

interface EditSystemFormProps {
  system: FullSystemDetails;
  onSuccess: () => void;
}

type CurrencyOption = {
  code: string;
  label: string;
};

export const EditSystemForm = ({ system, onSuccess }: EditSystemFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FullSystemDetails>({
    defaultValues: { ...system },
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedCostumer, setSelectedCostumer] = useState<CostumerRecordSimple | null>(null);
  const { mutateAsync: updateSystem } = useUpdateSystemHook();
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState("");

  const currencyOptions: CurrencyOption[] = currencies.map((code) => ({
    code,
    label: `${currencySymbols[code] || ""} - ${code}`,
  }));

  useEffect(() => {
    if (system.clientid) {
      setSelectedCostumer({ id: system.clientid, Name: system.clientname });
    }
    if (system.currency) {
      setSelectedCurrencySymbol(
        currencySymbols[system.currency as keyof typeof currencySymbols] || ""
      );
    }
  }, [system]);

  const handleCloseModal = () => setOpenModal(false);

  const onSubmit = async (data: FullSystemDetails) => {
    if (!data.clientid) data.clientid = undefined!;
    await updateSystem({ oldSystem: system, newSystem: { ...data, id: system.id } });
    onSuccess();
  };


  const costumerIcon = selectedCostumer ? <IoMdCloseCircle color="red" /> : <RiUserAddFill />;

  const isDownpaymentMade =
    !system.installation_product_active && !system.isactive && !system.maintenance_product_active;
  const isMaintenancePhase =
    !system.installation_product_active && system.isactive && system.maintenance_product_active;
  const isNothingPaidYet =
    system.installation_product_active && system.isactive && !system.maintenance_product_active;

  const disableCoreFields = isDownpaymentMade || isMaintenancePhase;
  const disableMaintenanceSwitch = !isDownpaymentMade || isMaintenancePhase;

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
                  <Tooltip title={selectedCostumer ? "Remove selected costumer" : "Add a costumer"}>
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
                      disabled={disableCoreFields || false}
                    >
                      {costumerIcon}
                    </IconButton>
                  </Tooltip>
                ),
              }}
              error={!!errors.clientid}
              helperText={errors.clientid?.message}
              value={selectedCostumer?.Name ?? "Select a costumer"}
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
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Description"
                  fullWidth
                  {...field}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>

          {/* RemoteAccessLink */}
          <Grid item xs={12}>
            <Controller
              name="remoteaccesslink"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Remote Access Link"
                  fullWidth
                  {...field}
                  error={!!errors.remoteaccesslink}
                  helperText={errors.remoteaccesslink?.message}
                />
              )}
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
              disabled={disableCoreFields || false}
            />
          </Grid>

          {/* Currency Autocomplete */}
          <Grid item xs={12} md={6}>
            <Controller
              name="currency"
              control={control}
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
                <Autocomplete
                  disabled={true}
                  options={currencyOptions}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    typeof value === "string" ? option.code === value : option.code === value.code
                  }
                  onChange={(_, value) => {
                    field.onChange(value?.code ?? "");
                    setSelectedCurrencySymbol(
                      currencySymbols[value?.code as keyof typeof currencySymbols] || ""
                    );
                  }}
                  value={currencyOptions.find((opt) => opt.code === field.value) || null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Currency"
                      fullWidth
                      error={!!errors.currency}
                      helperText={errors.currency?.message}
                      disabled={true}
                    />
                  )}
                />
              )}
            />
          </Grid>

          {/* YearlyPayment + Symbol */}
          <Grid item xs={9} md={5}>
            <TextField
              label="Yearly payment"
              fullWidth
              {...register("yearlypayment", { required: "Yearly payment is required" })}
              error={!!errors.yearlypayment}
              helperText={errors.yearlypayment?.message}
              type="number"
            />
          </Grid>
          <Grid item xs={3} md={1}>
            <TextField
              fullWidth
              value={selectedCurrencySymbol}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* MonthlyPayment + Symbol */}
          <Grid item xs={9} md={5}>
            <TextField
              label="Monthly payment"
              fullWidth
              {...register("monthlypayment", { required: "Monthly payment is required" })}
              error={!!errors.monthlypayment}
              helperText={errors.monthlypayment?.message}
              type="number"
            />
          </Grid>
          <Grid item xs={3} md={1}>
            <TextField
              fullWidth
              value={selectedCurrencySymbol}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* IsActive Switch */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Controller
                name="isactive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                        disabled={disableMaintenanceSwitch || false}
                      />
                    }
                    label="Maintenance phase"
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }} className="mt-3">
              <SmartHivePrimaryBtn type="submit" text="Update system" disabled={!isDirty} />
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