import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemSimple } from "../models/systemSimple";
import { supabase } from "../services/supabase-client";
import { System } from "../models/system";
import { useNotifications } from "@toolpad/core";

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

// usePostSystemHook ************************************************************
const postSystem = async (system: System) => {
    const {data, error} = await supabase.from("Systems").insert(system);

    if(error) throw new Error(error.message);

    return data;
}

export const usePostSystemHook = () => {
    const notifications = useNotifications();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postSystem,
        onSuccess: () => {
            notifications.show('System created successfully!', {
            severity: 'success',
            autoHideDuration: 3000,
            });

            queryClient.invalidateQueries({ queryKey: ["getCostumerRecords"] });
        },
        onError: (error: Error) => {
            notifications.show(`Failed to create system: ${error.message}`, {
            severity: 'error',
            autoHideDuration: 5000,
            });
        },
    });
}
//*******************************************************************************