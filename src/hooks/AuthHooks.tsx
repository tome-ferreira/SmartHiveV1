import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { User } from "../models/user";
import { userRole } from "../models/userRole";

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

// useIsClientHook **************************************************************
const isClient = async () => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return false;

  const userId = userData.user.id;

  const { data, error } = await supabase
  .from('UserRoles')
  .select('id, Roles(name)')
  .eq('userId', userId)

  if (error || !data) return false;

  return data.some((entry: any) => entry.Roles?.name?.toLowerCase() === 'user');
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

// useAddUserToRoleHook *********************************************************
type AddUserToRoleInput = {
  userEmail: string;
  role: string;
};

const addUserToRoleMutation = async ({ userEmail, role }: AddUserToRoleInput) => {
  const { data: roleData , error: roleError } = await supabase.from("Roles").select("id").eq("name", role).maybeSingle();
  if (roleError) throw new Error(roleError.message);

  const { data: userIdData, error: userIdError } = await supabase.rpc('get_user_id_by_email', { p_email: userEmail });
  if (userIdError) throw new Error(userIdError.message);

  const { data: removeRoleData , error: removeRoleError } = await supabase.from("UserRoles").delete().eq("userId", userIdData);
  if (removeRoleData) throw new Error(removeRoleError?.message);

  const ur: userRole = {
    userId: userIdData,
    roleId: roleData?.id,
  };

  const { error, data } = await supabase.from("UserRoles").insert(ur);
  if (error) throw new Error(error.message);
  
  return data;
};

export const useAddUserToRoleMutation = () =>{
  return useMutation({
    mutationFn: addUserToRoleMutation,
  });
}
//*******************************************************************************

// useGetAllUsersHook ***********************************************************
const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.rpc('get_all_users_info');

  if(error) throw new Error(error.message);

  return data as User[];
}

export const useGetAllUsersHook = () => {
  return useQuery<User[], Error>({
    queryKey: ['getAllUsers'],
    queryFn: () => getAllUsers(),
  });
};
//*******************************************************************************
