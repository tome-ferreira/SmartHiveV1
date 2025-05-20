import { useQuery } from "@tanstack/react-query";
import { CostumerRecord } from "../models/costumerRecord";
import { supabase } from "../services/supabase-client";
import { UserSimple } from "../models/userSimple";

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

// useGetAllUsersSimpleHook ***********************************************************
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
//*******************************************************************************