import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CostumerRecord } from "../models/costumerRecord";
import { supabase } from "../services/supabase-client";
import { UserSimple } from "../models/userSimple";
import { useNotifications } from "@toolpad/core";

// useGetAllCostumerRecordsHook *************************************************
const getAllCostumerRecords = async (): Promise<CostumerRecord[]> => {
    const {data, error} = await supabase.from("CostumerRecords").select("*");

    if(error) throw new Error(error.message);
    
    return data as CostumerRecord[];
};

export const useGetAllCostumerRecordsHook = () => {
    return useQuery<CostumerRecord[], Error>({
        queryKey: ['getCostumerRecords'],
        queryFn: () => getAllCostumerRecords(),
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