import { Modal } from "@mui/material";
import { useEffect, useState } from "react";
import SmartHivePrimaryBtnXS from "../utils/btns/SmartHivePrimaryBtnXS";
import { useAddUserToRoleMutation } from "../../hooks/AuthHooks";
import SmartHiveDangerBtnXS from "../utils/btns/SmartHiveDangerBtnXS";
import { useQueryClient } from "@tanstack/react-query";


interface ManageUserModalProps {
  open: boolean;
  onClose: () => void;
  userData: any;
}

const ManageUserModal = ({ open, onClose, userData }: ManageUserModalProps) => {
  const [role, setRole] = useState("");
  const [originalRole, setOriginalRole] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: addUserToRole } = useAddUserToRoleMutation();

  useEffect(() => {
    if (userData) {
      const userRole = userData.role_name ?? "User";
      setRole(userRole);
      setOriginalRole(userRole);
      setIsChanged(false);
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    setIsChanged(role !== originalRole);
  }, [role, originalRole]);

  const handleSaveChanges = async () => {
  try {
    await addUserToRole({
      userEmail: userData.email,
      role,
    });

    setOriginalRole(role);
    setIsChanged(false);
    queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    onClose(); 
  } catch (err) {
    console.error("Failed to update role:", err);
  }
};

  if (!userData) return null;

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <div className="fixed inset-0 flex items-center justify-center bg-opacity-70 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 outline-none font-sans">
          <h2 className="text-2xl font-bold text-eucalyptus-500 mb-4">Manage User</h2>
          <hr className="mb-6 border-gray-300" />

          <div className="space-y-4">
            {/* Static Name */}
            <div className="flex items-center">
              <span className="text-gray-500 font-semibold min-w-[90px]">Name:</span>
              <span className="ml-2 text-gray-900 font-medium break-words">{userData.name}</span>
            </div>

            {/* Static Email */}
            <div className="flex items-center">
              <span className="text-gray-500 font-semibold min-w-[90px]">Email:</span>
              <span className="ml-2 text-gray-900 font-medium break-words">{userData.email}</span>
            </div>

            {/* Static Provider */}
            <div className="flex items-center">
              <span className="text-gray-500 font-semibold min-w-[90px]">Provider:</span>
              <span className="ml-2 text-gray-900 font-medium break-words">{userData.provider}</span>
            </div>

            {/* Static Created At */}
            <div className="flex items-center">
              <span className="text-gray-500 font-semibold min-w-[90px]">Created At:</span>
              <span className="ml-2 text-gray-900 font-medium break-words">{userData.created_at}</span>
            </div>

            {/* Static Last Login */}
            <div className="flex items-center">
              <span className="text-gray-500 font-semibold min-w-[90px]">Last Login:</span>
              <span className="ml-2 text-gray-900 font-medium break-words">{userData.last_login}</span>
            </div>

            {/* Editable Role Dropdown */}
            <div className="flex flex-col">
              <label className="text-gray-500 font-semibold mb-1">Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-eucalyptus-400"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-2">
            {isChanged ? (
                <>
                    <SmartHivePrimaryBtnXS label="Save Changes" onClick={handleSaveChanges} />
                    <SmartHiveDangerBtnXS label="Cancel" onClick={onClose} />
                </>
                ) : (
                    <SmartHivePrimaryBtnXS label="Close" onClick={onClose} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManageUserModal;
