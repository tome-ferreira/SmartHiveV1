import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CostumerRecord } from "../models/costumerRecord";
import { supabase } from "../services/supabase-client";
import { UserSimple } from "../models/userSimple";
import { useNotifications } from "@toolpad/core";
import { CostumerRecordSimple } from "../models/costumerRecordSimple";

// useGetAllCostumerRecordsHook *************************************************
const getAllCostumerRecords = async (): Promise<CostumerRecordSimple[]> => {
    const {data, error} = await supabase.from("CostumerRecords").select("*id, Name");

    if(error) throw new Error(error.message);
    
    return data as CostumerRecordSimple[];
};

export const useGetAllCostumerRecordsHook = () => {
    return useQuery<CostumerRecordSimple[], Error>({
        queryKey: ['getCostumerRecords'],
        queryFn: () => getAllCostumerRecords(),
    });
};
//*******************************************************************************

// useGetCostumerRecordHook *****************************************************
const getCostumerRecord = async (id: string): Promise<CostumerRecord> => {
  const { data, error } = await supabase.from("CostumerRecords").select("*").eq("id", id).single();

  if (error) throw new Error(error.message);

  return data as CostumerRecord;
};

export const useGetCostumerRecordHook = (recordId: string | null) => {
  return useQuery<CostumerRecord, Error>({
    queryKey: ['getCostumerRecord', recordId],
    queryFn: () => getCostumerRecord(recordId!),
    enabled: !!recordId, 
  });
};
//*******************************************************************************

// usePostCostumerRecordHook ****************************************************
const postCostumerRecord = async (record: CostumerRecord) => {
  const {data, error} = await supabase.from("CostumerRecords").insert(record);

  if(error) throw new Error(error.message);

  return data;
};

export const usePostCostumerRecordHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: postCostumerRecord,
      onSuccess: () => {
        notifications.show('Customer record created successfully!', {
          severity: 'success',
          autoHideDuration: 3000,
        });

        queryClient.invalidateQueries({ queryKey: ["getCostumerRecords"] });
      },
      onError: (error: Error) => {
        notifications.show(`Failed to create customer record: ${error.message}`, {
          severity: 'error',
          autoHideDuration: 5000,
        });
      },
  });
};
// ******************************************************************************

// useUpdateCostumerRecordHook **************************************************
var recordId: any = "";

const updateCostumerRecord = async (record: CostumerRecord) => {
  const { data, error } = await supabase
    .from("CostumerRecords")
    .update({
      Name: record.Name,
      Email: record.Email,
      Country: record.Country,
      NIF: record.NIF,
      PhoneNumber: record.PhoneNumber,
      UserId: record.UserId,
    })
    .eq("id", record.id);

    recordId = record.id

  if (error) throw new Error(error.message);

  return data;
};

export const useUpdateCostumerRecordHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCostumerRecord,
    onSuccess: () => {
      notifications.show("Customer record updated successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ['getCostumerRecord', recordId] })
      queryClient.invalidateQueries({ queryKey: ['getCostumerRecords'] });
    },
    onError: (error: Error) => {
      notifications.show(`Failed to update customer record: ${error.message}`, {
        severity: "error",
        autoHideDuration: 5000,
      });
    },
  });
};
// *****************************************************************************

// useDeleteCostumerRecordHook ****************************************************
const deleteCostumerRecord = async (recordId: string) => {
  const { error } = await supabase
    .from("CostumerRecords")
    .delete()
    .eq("id", recordId);

  if (error) throw new Error(error.message);

  return recordId;
};

export const useDeleteCostumerRecordHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCostumerRecord,
    onSuccess: () => {
      notifications.show('Customer record deleted successfully!', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["getCostumerRecords"] });
    },
    onError: (error: Error) => {
      notifications.show(`Failed to delete customer record: ${error.message}`, {
        severity: 'error',
        autoHideDuration: 5000,
      });
    },
  });
};
// *******************************************************************************



// useGetAllUsersSimpleHook *****************************************************
const getAllUsersSimple = async (): Promise<UserSimple[]> => {
  const { data, error } = await supabase.rpc('get_all_users_simple');

  if(error) throw new Error(error.message);

  return data as UserSimple[];
}

export const useGetAllUsersSimpleHook = () => {
  return useQuery<UserSimple[], Error>({
    queryKey: ['getAllUsersSimple'],
    queryFn: () => getAllUsersSimple(),
    enabled: false
  });
};
//******************************************************************************