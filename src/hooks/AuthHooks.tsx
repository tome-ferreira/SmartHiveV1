import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";

// IsAdminHook *****************************************************************
const isAdmin = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return false;

  const userId = userData.user.id;

  const { data, error } = await supabase
    .from('UserRoles')
    .select('id, Roles(name)')
    .eq('userId', userId);

  if (error || !data) return false;

  console.log(data);  

  return data.some((entry: any) => entry.Roles?.name?.toLowerCase() === 'admin');
};

export const useIsAdminHook = () => {
    return useQuery({
      queryKey: ['isAdmin'],
      queryFn: () => isAdmin(),
      retry: false, 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });
  };
//*******************************************************************************

// useIsClientHook *****************************************************************
const isClient = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return false;

  const userId = userData.user.id;

  const { data, error } = await supabase
  .from('UserRoles')
  .select('id, Roles(name)')
  .eq('userId', userId)

  if (error || !data) return false;

  console.log(data);  

  return data.some((entry: any) => entry.Roles?.name?.toLowerCase() === 'client');
};

export const useIsClientHook = () => {
    return useQuery({
      queryKey: ['isClient'],
      queryFn: () => isClient(),
      retry: false, 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });
  };
//*******************************************************************************