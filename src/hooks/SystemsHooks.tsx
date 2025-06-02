import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SystemSimple } from "../models/systemSimple";
import { supabase } from "../services/supabase-client";
import { System } from "../models/system";
import { useNotifications } from "@toolpad/core";
import { SystemWithClientName } from "../models/systemWithClientName";
import { FullSystemFormData } from "../models/fullSystemFormData";
import { createStripeProduct } from "../edge-functions-triggers/create_stripe_product_trigger";
import { FullSystemDetails } from "../models/systemDetails";
import { deleteStripeProduct } from "../edge-functions-triggers/delete_stripe_product_trigger";

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
const getSystem = async (id: string): Promise<FullSystemDetails> => {
    const { data, error } = await supabase
        .rpc('get_system_by_id', { sys_id: parseInt(id) }).single();

    if (error) throw new Error(error.message);

    const system = data as FullSystemDetails;

    const adjustedData: FullSystemDetails = {
        ...system,
        downpayment: system.downpayment ? system.downpayment / 100 : null,
        monthlypayment: system.monthlypayment ? system.monthlypayment / 100 : null,
        yearlypayment: system.yearlypayment ? system.yearlypayment / 100 : null,
        currency: system.currency?.toUpperCase() || null,
    };

    return adjustedData;
};


export const useGetSystemHook = (systemId: string | null) => {
    return useQuery<FullSystemDetails, Error>({
        queryKey: ['getSystem'],
        queryFn: () => getSystem(systemId!),
        enabled: !!systemId,
    });
};
//*******************************************************************************

// usePostSystemHook ************************************************************
export const postSystem = async (data: FullSystemFormData) => {
  const { ClientId, Name, Description, RemoteAccessLink } = data;

  const { data: insertData, error } = await supabase
    .from("Systems")
    .insert({ ClientId, Name, Description, RemoteAccessLink })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const system_id = insertData.id;

  await createStripeProduct(
    system_id,
    Name,
    Description || "",
    data.Currency,
    data.Downpayment,
    data.MonthlyPayment,
    data.YearlyPayment
  );

  return insertData;
};

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
const deleteSystem = async (systemId: number) => {
  await deleteStripeProduct(systemId);
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