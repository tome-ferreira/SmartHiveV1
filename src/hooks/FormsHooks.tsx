import { useNotifications } from "@toolpad/core";
import { ContactForm } from "../models/contactForm";
import { ContactFormData } from "../models/contactFormData";
import { FormsBase } from "../models/formsBase";
import { supabase } from "../services/supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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