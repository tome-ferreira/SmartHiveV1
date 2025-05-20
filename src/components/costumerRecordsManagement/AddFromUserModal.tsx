import { useEffect, useState } from "react";
import { Modal, Paper, Slide } from "@mui/material";
import { useGetAllUsersSimpleHook } from "../../hooks/CostumerRecordsHooks";
import SmartHivePrimaryBtnXS from "../utils/btns/SmartHivePrimaryBtnXS";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import { UserSimple } from "../../models/userSimple";

interface AddFromUserModalProps {
    open: boolean;
    onClose: () => void;
    onUserSelected: (user: UserSimple) => void;
}


export const AddFromUserModal = ({ open, onClose, onUserSelected }: AddFromUserModalProps) => {
    const { data, error, isLoading, refetch } = useGetAllUsersSimpleHook();
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState<UserSimple | null>(null);

    useEffect(() => {
        if (open) {
            refetch(); // Refetch users when modal opens
            setSearchTerm(""); // Reset search
        }
    }, [open]);

    const filteredUsers = (data ?? []).filter((user: any) => {
        const name = (user.name_email ?? user.name_google ?? "").toLowerCase();
        const email = user.email?.toLowerCase() ?? "";
        const term = searchTerm.toLowerCase();
        return name.includes(term) || email.includes(term);
    });

    return (
        <Modal open={open} onClose={onClose}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 outline-none">
                    <Paper className="h-full p-6 rounded-none flex flex-col font-sans">
                        <div className="flex-1 overflow-y-auto">
                            <h1 className="text-lg font-semibold mb-3">Select a user</h1>
                            
                            {/* 🔍 Search Input */}
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 mb-4 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                            {/* 🔄 Loading / Error / List */}
                            {isLoading && <SmartHiveLoading />}
                            {error && <p className="text-red-500">Error loading users</p>}

                            {filteredUsers?.length > 0 ? (
                                filteredUsers.map((user: any) => (
                                    <div
                                        key={user.user_id}
                                        onClick={() => setSelected(user)}
                                        className={`mb-2 p-3 rounded-md cursor-pointer transition-colors ${
                                            selected?.user_id === user.user_id
                                            ? "bg-blue-100 border border-blue-500"
                                            : "hover:bg-gray-100"
                                        }`}
                                    >
                                        <p className="text-base font-semibold">
                                            {user.name_email ?? user.name_google ?? "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                ))
                            ) : (
                                !isLoading && (
                                    <p className="text-gray-500">No users found.</p>
                                )
                            )}
                        </div>

                        {/* Footer Buttons */}
                        <div className="mt-6 flex justify-end gap-2">
                            <SmartHivePrimaryBtnXS label="Cancel" onClick={onClose} />
                            {selected && (
                                <SmartHivePrimaryBtnXS
                                label="Select"
                                onClick={() => {
                                    onUserSelected(selected);
                                    setSelected(null); 
                                }}
                                />
                            )}
                        </div>
                    </Paper>
                </div>
            </Slide>
        </Modal>
    );
};
