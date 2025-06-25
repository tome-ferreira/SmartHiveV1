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
import { updateStripeProduct } from "../edge-functions-triggers/update_stripe_product_trigger";
import { UserSystemMini } from "../models/userSystemMini";

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

// useUpdateSystemHook **********************************************************
var systemId: any = "";

interface UpdateSystemPayload {
  oldSystem: FullSystemDetails;
  newSystem: FullSystemDetails;
}

const updateSystem = async ({ oldSystem, newSystem }: UpdateSystemPayload) => {
  const updateStripePayloads: UpdateStripePayload[] = [];

  // Handle Installation Product
  if (
    oldSystem.name !== newSystem.name ||
    oldSystem.description !== newSystem.description ||
    oldSystem.installation_product_active !== newSystem.installation_product_active ||
    oldSystem.downpayment !== newSystem.downpayment
  ) {
    const payload: UpdateStripePayload = {
      productId: newSystem.installation_product_id,
      type: 'installation',
      updatedFields: {
        name: newSystem.name + " - Instalation",
        description: newSystem.description,
        active: newSystem.installation_product_active ?? true,
        prices: newSystem.downpaymentpaymentid
          ? [
              {
                id: newSystem.downpaymentpaymentid,
                amount: newSystem.downpayment! * 100,
              },
            ]
          : [],
      },
    };
    updateStripePayloads.push(payload);
  }

  // Handle Maintenance Product
  if (
    oldSystem.maintenance_product_active !== newSystem.maintenance_product_active ||
    oldSystem.monthlypayment !== newSystem.monthlypayment ||
    oldSystem.yearlypayment !== newSystem.yearlypayment
  ) {
    const prices = [];

    if (newSystem.monthlypaymentpaymentid) {
      prices.push({
        id: newSystem.monthlypaymentpaymentid,
        amount: newSystem.monthlypayment! * 100,
      });
    }

    if (newSystem.yearlypaymentpaymentid) {
      prices.push({
        id: newSystem.yearlypaymentpaymentid,
        amount: newSystem.yearlypayment! * 100,
      });
    }

    updateStripePayloads.push({
      productId: newSystem.maintenance_product_id,
      type: 'maintenance',
      updatedFields: {
        name: newSystem.name + " - Maintenence",
        description: newSystem.description,
        active: true,
        prices,
      },
    });
  }

  // Update system in Supabase
  const { data, error } = await supabase
    .from("Systems")
    .update({
      ClientId: newSystem.clientid,
      Name: newSystem.name,
      Description: newSystem.description,
      RemoteAccessLink: newSystem.remoteaccesslink,
      maintenance_active: newSystem.isactive,
    })
    .eq("id", newSystem.id);

  if (error) throw new Error(error.message);

  // Call Edge Function
  for (const payload of updateStripePayloads) {
    await updateStripeProduct(payload);
  }

  return data;
};


export const useUpdateSystemHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSystem,
    onSuccess: () => {
      notifications.show("System updated successfully!", {
        severity: "success",
        autoHideDuration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ['getSystem'] });
      queryClient.invalidateQueries({ queryKey: ['getAllSystems'] });
    },
    onError: (error: Error) => {
      notifications.show(`Failed to update system: ${error.message}`, {
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

// useGetAllUserSystemsHook *****************************************************
const getAllUserSystems = async (userId: string): Promise<UserSystemMini[]> => {
  const { data: recordData, error: recordError } = await supabase.from("CostumerRecords").select("id").eq("UserId", userId).single();

  if (recordError) throw new Error(recordError.message);

  const  {data: systemsData, error: systemsError} = await supabase.from("Systems").select("id, Name").eq("ClientId", recordData.id);

  if (systemsError) throw new Error(systemsError.message);

  return systemsData as UserSystemMini[];
};

export const useGetAllUserSystemsHook = (userId: string ) => {
  return useQuery<UserSystemMini[], Error>({
    queryKey: ['getAllUserSystems', userId],
    queryFn: () => getAllUserSystems(userId!),
    enabled: !!userId, 
  });
};
//*******************************************************************************

// useDeactivateDownpaimentHook *************************************************
const deactivateDownpaiment = async (systemId: string) => {
  const { data, error } = await supabase.rpc('deactivate_installation_product', { system_id: systemId });

  if (error) throw new Error(error.message);
}

export const useDeactivateDownpaimentHook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateDownpaiment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getSystem'] });
    },
  });
};
// ***************************************************************************
