import { useQuery } from "@tanstack/react-query";
import { SystemSimple } from "../models/systemSimple";
import { supabase } from "../services/supabase-client";

// useGetAllSystemsHook **********************************************************
const getAllSystems = async (): Promise<SystemSimple[]> => {
    const {data, error} = await supabase.rpc("get_simple_systems");

    if(error) throw new Error(error.message);
    
    return data as SystemSimple[];
};

export const useGetAllSystemsHook = () => {
    return useQuery<SystemSimple[], Error>({
        queryKey: ['getCostumerRecords'],
        queryFn: () => getAllSystems(),
    });
};
//*******************************************************************************