import { useNotifications } from "@toolpad/core";
import { ContactForm } from "../models/contactForm";
import { ContactFormData } from "../models/contactFormData";
import { FormsBase } from "../models/formsBase";
import { supabase } from "../services/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InterventionRequestFormData } from "../models/interventionRequestFormData";
import { EndServiceRequestFormData } from "../models/endServiceRequestFormData";
import { InterventionAppointmentFormData } from "../models/interventionAppointmentFormData";
import { InterventionAppointment } from "../models/interventionAppointment";

// usePostContactFormHook *******************************************************************
const postContactForm = async (formResponse: ContactFormData) => {

    const base: FormsBase = {
        Type: "contact",
        Audience: "Admin",
        Name: formResponse.name,
        Email: formResponse.email
    }

    const {data: baseData, error: baseError } = await supabase
        .from("FormsBase")
        .insert(base)
        .select()
        .single();

    if (baseError) throw new Error(baseError.message);

    const data: ContactForm = {
        phone: formResponse.phone,
        location: formResponse.location,
        notes: formResponse.notes,
        base: baseData.id
    }

    const {data: dataData, error: dataError} = await supabase
        .from("ContactFormData")
        .insert(data);
    
    if(dataError) throw new Error(dataError.message);
}

export const usePostContactFormHook = ()  => {
    const notifications = useNotifications();

    return useMutation({
        mutationFn: postContactForm
    })
}
// ******************************************************************************************

// useGetFormsAdminHook ***********************************************************************
const getFormsAdmin = async (limit = 10, offset = 0): Promise<{ data: FormsBase[]; count: number }> => {
    const { data, error, count } = await supabase
        .from("FormsBase")
        .select("*", { count: 'exact' }) // fetch count
        .eq("Audience", "Admin")
        .order("created_at", { ascending: false }) 
        .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return { data: data as FormsBase[], count: count ?? 0 };
};

export const useGetFormsAdminHook = (limit: number, offset: number) => {
    return useQuery({
        queryKey: ['getFormsAdmin', limit, offset],
        queryFn: () => getFormsAdmin(limit, offset),
    });
};
//******************************************************************************************* 

// useGetContactFormDataHook ****************************************************************
const getContactFormData = async (id: number) : Promise<ContactForm> => {
    const { data, error } = await supabase.from("ContactFormData").select("*").eq("base", id).single();
    const { data: seenData, error: seenError } = await supabase.from("FormsBase").update({ Seen: true }).eq("id", id); 

    if (error) throw new Error(error.message);

    return data as ContactForm;
}

export const useGetContactFormDataHook = (id: number) => {
    return useQuery({
        queryKey: ['getContactFormData', id],
        queryFn: () => getContactFormData(id),
        enabled: false
    });
}
// ******************************************************************************************

// useMarkFormAsSeenHook ********************************************************************
const limit: number = 10;
const offset: number = 0;

const markFormAsSeen = async (id: number) => {
    const { data, error } = await supabase.from("FormsBase").update({ Seen: true }).eq("id", id).select();       

    if (error) throw new Error(error.message);

    return data;
}

export const useMarkFormAsSeenHook = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: markFormAsSeen,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getFormsAdmin', limit, offset] });
        }
    });
}
// ******************************************************************************************

// useDeleteFormHook ************************************************************************
const deleteForm = async (id: number) => {
    const { data, error } = await supabase.from("FormsBase").delete().eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}

export const useDeleteFormHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      notifications.show('Form response deleted successfully!', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ['getFormsAdmin', limit, offset] });
    },
    onError: (error: Error) => {
      notifications.show(`Failed to delete form response: ${error.message}`, {
        severity: 'error',
        autoHideDuration: 5000,
      });
    },
  });
};
// ******************************************************************************************

// usePostInterventionRequestFormHook *******************************************************************
const postInterventionRequest = async ({ formBase, formResponse, }: { formBase: FormsBase; formResponse: InterventionRequestFormData; }) => {
    const {data: baseData, error: baseError } = await supabase
        .from("FormsBase")
        .insert(formBase)
        .select()
        .single();

    if (baseError) throw new Error(baseError.message);

    formResponse.base = baseData.id;

    const {data: dataData, error: dataError} = await supabase
        .from("InterventionRequestFormData")
        .insert(formResponse);
    
    if(dataError) throw new Error(dataError.message);
}

export const usePostInterventionRequestFormHook = ()  => {
    const notifications = useNotifications();

    return useMutation({
        mutationFn: postInterventionRequest,
        onSuccess: () => {
            notifications.show('Message sent successfully!', {
                severity: 'success',
                autoHideDuration: 3000,
            });
        },
        onError: (error: Error) => {
            notifications.show(`Failed send message: ${error.message}`, {
                severity: 'error',
                autoHideDuration: 5000,
            });
        },
    })
}
// ******************************************************************************************

// usePostEndServiceRequestFormHook *******************************************************************
const postEndServiceRequest = async ({ formBase, formResponse, }: { formBase: FormsBase; formResponse: EndServiceRequestFormData; }) => {
    const {data: baseData, error: baseError } = await supabase
        .from("FormsBase")
        .insert(formBase)
        .select()
        .single();

    if (baseError) throw new Error(baseError.message);

    formResponse.base = baseData.id;

    const {data: dataData, error: dataError} = await supabase
        .from("EndServiceRequestFormData")
        .insert(formResponse);
    
    if(dataError) throw new Error(dataError.message);
}

export const usePostEndServiceRequestFormHook = ()  => {
    const notifications = useNotifications();

    return useMutation({
        mutationFn: postEndServiceRequest,
        onSuccess: () => {
            notifications.show('Message sent successfully!', {
                severity: 'success',
                autoHideDuration: 3000,
            });
        },
        onError: (error: Error) => {
            notifications.show(`Failed send message: ${error.message}`, {
                severity: 'error',
                autoHideDuration: 5000,
            });
        },
    })
}
// ******************************************************************************************

// usePostInterventionAppointmentFormHook *******************************************************************
const postInterventionAppointment = async ({ formBase, formResponse, }: { formBase: FormsBase; formResponse: InterventionAppointmentFormData; }) => {
    const {data: baseData, error: baseError } = await supabase
        .from("FormsBase")
        .insert(formBase)
        .select()
        .single();

    if (baseError) throw new Error(baseError.message);

    formResponse.base = baseData.id;

    const {data: dataData, error: dataError} = await supabase
        .from("InterventionAppointmentFormData")
        .insert(formResponse);
    
    if(dataError) throw new Error(dataError.message);
}

export const usePostInterventionAppointmentFormHook = ()  => {
    const notifications = useNotifications();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postInterventionAppointment,
        onSuccess: () => {
            notifications.show('Message sent successfully!', {
                severity: 'success',
                autoHideDuration: 3000,
            });
            queryClient.invalidateQueries({ queryKey: ['getSystemInterventionAppointments'] });
        },
        onError: (error: Error) => {
            notifications.show(`Failed send message: ${error.message}`, {
                severity: 'error',
                autoHideDuration: 5000,
            });
        },
    })
}
// ******************************************************************************************

// useGetSystemsInterventionAppointmentsHook ************************************************
const getSystemInterventionAppointments = async (systemId: number): Promise<InterventionAppointment[]> => {
    const { data, error } = await supabase.rpc('get_interventions_by_system', { system_id: systemId });

    if (error) throw new Error(error.message);

    return data as InterventionAppointment[];
};

export const useGetSystemsInterventionAppointmentsHook = (systemId: number) => {
    return useQuery<InterventionAppointment[], Error>({
        queryKey: ['getSystemInterventionAppointments'],
        queryFn: () => getSystemInterventionAppointments(systemId),
        enabled: !!systemId, 
    });
};

// ******************************************************************************************

// useAcceptInterventionAppointmentHook *****************************************************
type AcceptMutationArgs = {
    appointmentId: number;
    systemId: string;
};

const acceptInterventionAppointment = async ({ appointmentId }: AcceptMutationArgs): Promise<void> => {
    const { error } = await supabase.rpc("accept_intervention_appointment", { appointment_id: appointmentId });

    if (error) {
        throw new Error(error.message);
    }
};

export const useAcceptInterventionAppointmentHook = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, AcceptMutationArgs>({
        mutationFn: acceptInterventionAppointment,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['getSystemInterventionAppointments'] });
        },
    });
};
// ******************************************************************************************

// useRefuseInterventionAppointmentHook *****************************************************
type RefuseMutationArgs = {
    appointmentId: number;
    systemId: string;
};

const refuseInterventionAppointment = async ({ appointmentId }: RefuseMutationArgs): Promise<void> => {
    const { error } = await supabase.rpc("refuse_intervention_appointment", { appointment_id: appointmentId });

    if (error) {
        throw new Error(error.message);
    }
};

export const useRefuseInterventionAppointmentHook = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, RefuseMutationArgs>({
        mutationFn: refuseInterventionAppointment,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['getSystemInterventionAppointments'] });
        },
    });
};
// ******************************************************************************************