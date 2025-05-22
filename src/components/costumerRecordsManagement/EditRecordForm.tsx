import { Autocomplete, Box, Container, Grid, TextField, Typography, } from "@mui/material";
import { CostumerRecord } from "../../models/costumerRecord";
import { Controller, useForm } from "react-hook-form";
import countries from "../../data/countries";
import { useEffect, useState } from "react";
import { AddFromUserModal } from "./AddFromUserModal";
import { UserSimple } from "../../models/userSimple";
import SmartHivePrimaryBtn from "../utils/btns/SmartHivePrimaryBtn";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useUpdateCostumerRecordHook } from "../../hooks/CostumerRecordsHooks";

interface EditRecordFormProps {
  record: CostumerRecord;
  onSuccess: () => void;
}

export const EditRecordForm = ({ record, onSuccess }: EditRecordFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Omit<CostumerRecord, "created_at">>({
    defaultValues: { ...record },
  });

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSimple | null>(null);
  const { mutateAsync: updateRecord } = useUpdateCostumerRecordHook();
  

  useEffect(() => {
    if (record.UserId) {
      setSelectedUser({
        user_id: record.UserId,
        name_email: record.Name,
        name_google: record.Name,
        email: record.Email,
      });
    }
  }, [record]);

  const handleCloseModal = () => setOpenModal(false);

  const onSubmit = (data: Omit<CostumerRecord, "created_at">) => {
    if (data.UserId === "") {
      data.UserId = null;
    }
    updateRecord({ ...data, id: record.id });
    console.log({ ...data, id: record.id });
    onSuccess();
  };

  return (
    <Container sx={{ mt: 4 }}>
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
                endAdornment: selectedUser ? (
                  <LockOutlinedIcon color="disabled" />
                ) : null,
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
                endAdornment: selectedUser ? (
                  <LockOutlinedIcon color="disabled" />
                ) : null,
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

          {/* Link/Unlink User Button */}
          <Grid item xs={12} md={2} sx={{ display: "flex", alignItems: "stretch" }}>
            <SmartHivePrimaryBtn
              className="w-100"
              text={selectedUser ? "Clear user" : "Link user"}
              onClick={() => {
                if (selectedUser) {
                  setSelectedUser(null);
                  setValue("Name", "");
                  setValue("Email", "");
                  setValue("UserId", null);
                } else {
                  setOpenModal(true);
                }
              }}
            />
          </Grid>

          {/* Country */}
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

          {/* Phone */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Phone Number"
              type="number"
              fullWidth
              {...register("PhoneNumber", { valueAsNumber: true })}
              error={!!errors.PhoneNumber}
              helperText={errors.PhoneNumber?.message}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <SmartHivePrimaryBtn type="submit" text="Save Changes" />
            </Box>
          </Grid>
        </Grid>

        {/* Hidden input for UserId */}
        <input
          type="hidden"
          {...register("UserId")}
          value={selectedUser?.user_id || ""}
        />
      </form>

      {/* Modal */}
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
