import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemSimple } from "../models/systemSimple";
import { supabase } from "../services/supabase-client";
import { System } from "../models/system";
import { useNotifications } from "@toolpad/core";
import { SystemWithClientName } from "../models/systemWithClientName";
import { FullSystemFormData } from "../models/fullSystemFormData";

// useGetAllSystemsHook *********************************************************
const getAllSystems = async (): Promise<SystemSimple[]> => {
    const {data, error} = await supabase.rpc("get_simple_systems");

    if(error) throw new Error(error.message);
    
    return data as SystemSimple[];
};

export const useGetAllSystemsHook = () => {
    return useQuery<SystemSimple[], Error>({
        queryKey: ['getAllSystems'],
        queryFn: () => getAllSystems(),
    });
};
//*******************************************************************************

// useGetSystemHook *************************************************************
const getSystem = async (id: string): Promise<SystemWithClientName> => {
    const { data, error } = await supabase
        .rpc('get_full_system_by_id', { sys_id: parseInt(id)}).single();

    if (error) throw new Error(error.message);
    return data as SystemWithClientName;
};

export const useGetSystemHook = (systemId: string | null) => {
    return useQuery<SystemWithClientName, Error>({
        queryKey: ['getSystem'],
        queryFn: () => getSystem(systemId!),
        enabled: !!systemId,
    });
};
//*******************************************************************************

// usePostSystemHook ************************************************************
export const postSystem = async (data: FullSystemFormData) => {
  const { ClientId, Name, Description, RemoteAccessLink } = data

  const { data: insertData, error } = await supabase
    .from("Systems")
    .insert({ ClientId, Name, Description, RemoteAccessLink })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const system_id = insertData.id

  console.log(
    JSON.stringify({
      system_id: system_id,
      name: Name,
      description: Description,
      downpayment: data.Downpayment,
      monthly: data.MonthlyPayment,
      yearly: data.YearlyPayment
    })
  );

  // 🎯 Trigger Edge Function
  const response = await fetch(`http://127.0.0.1:54321/functions/v1/create_stripe_product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      system_id: system_id,
      name: Name,
      description: Description,
      currency: data.Currency,
      downpayment: data.Downpayment,
      monthly: data.MonthlyPayment,
      yearly: data.YearlyPayment
    })
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || "Failed to create Stripe product")
  }

  return insertData
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

            queryClient.invalidateQueries({ queryKey: ["getAllSystems"] });
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

// useUpdateCostumerRecordHook **************************************************
var systemId: any = "";

const updateSystem = async (system: SystemWithClientName) => {
  const { data, error } = await supabase
    .from("Systems")
    .update({
      ClientId: system.clientid,
      Name: system.name,
      Description: system.description,
      RemoteAccessLink: system.remoteaccesslink,
      Downpayment: system.downpayment,
      MonthlyPayment: system.monthlypayment,
      YearlyPayment: system.yearlypayment,
      Currency: system.currency,
      PaymentMethod: system.paymentmethod,
    })
    .eq("id", system.id);

    systemId = system.id

  if (error) throw new Error(error.message);

  return data;
};

export const useUpdateSystemHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSystem,
    onSuccess: () => {
      notifications.show("Customer record updated successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ['getSystem'] })
      queryClient.invalidateQueries({ queryKey: ['getAllSystems'] });
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

// useDeleteSystemHook *************************************************
const deleteSystem = async (systemId: string) => {
  const { error } = await supabase
    .from("Systems")
    .delete()
    .eq("id", systemId);

  if (error) throw new Error(error.message);

  return systemId;
};

export const useDeleteSystemHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSystem,
    onSuccess: () => {
      notifications.show('System deleted successfully!', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["getAllSystems"] });
    },
    onError: (error: Error) => {
      notifications.show(`Failed to delete system: ${error.message}`, {
        severity: 'error',
        autoHideDuration: 5000,
      });
    },
  });
};
// ****************************************************************************