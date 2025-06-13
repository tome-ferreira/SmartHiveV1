import { useNotifications } from "@toolpad/core";
import { ContactForm } from "../models/contactForm";
import { ContactFormData } from "../models/contactFormData";
import { FormsBase } from "../models/formsBase";
import { supabase } from "../services/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { InterventionRequestFormData } from "../models/interventionRequestFormData";

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