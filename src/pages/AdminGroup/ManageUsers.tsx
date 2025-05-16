import { Box, Chip } from "@mui/material";
import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { useGetAllUsersHook } from "../../hooks/AuthHooks";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SmartHiveOutlineBtn from "../../components/utils/btns/SmartHiveOutlineBtn";
import SmartHiveOutlineBtnXS from "../../components/utils/btns/SmartHiveOutlineBtnXS";
import { useState } from "react";
import ManageUserModal from "../../components/userManagement/ManageUserModal";
import { useAuth } from "../../contexts/AuthContext";

const ManageUsers = () => {
    const { data, error, isLoading } = useGetAllUsersHook();

    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const { user } = useAuth();

    const handleManageClick = (user: any) => {
        setSelectedUser(user);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUser(null);
    };

    const columns: GridColDef<(typeof rows)[number]>[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 100
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1.5,
            minWidth: 150
        },
        {
            field: 'provider',
            headerName: 'Provider',
            flex: 1,
            minWidth: 100
        },
        {
            field: 'created_at',
            headerName: 'Created at',
            flex: 1,
            minWidth: 120
        },
        {
            field: 'last_login',
            headerName: 'Last login',
            flex: 1,
            minWidth: 120
        },
        {
            field: 'role_name',
            headerName: 'Role',
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                const value = params.value?.toLowerCase();
                let color: "default" | "success" | "error" = "default";

                if (value === "admin") color = "success";
                else if (value === "user") color = "error";

                return (
                    <Chip 
                        label={params.value ?? "Undefined"} 
                        color={color} 
                        size="small"
                    />
                );
            }
        },
        {
            field: 'manage',
            headerName: '',
            flex: 1,
            minWidth: 100,
            renderCell: (params) =>{
                if (params.row.email === user?.email) return null;

                return(
                    <SmartHiveOutlineBtnXS
                        label="Manage"
                        onClick={() => handleManageClick(params.row)}
                    />
                );
            }    
        }
    ];

    const rows = data?.map((user: any, index: number) => ({
        id: user.id ?? index,
        name: user.name_email ?? user.name_google ?? "Unknown",
        email: user.email,
        provider: user.provider.charAt(0).toUpperCase() + user.provider.slice(1),
        created_at: new Date(user.created_at).toLocaleString(),
        last_login: user.last_login ? new Date(user.last_login).toLocaleString() : "Never",
        role_name: user.role_name ?? "Undefined"
    })) || [];

    return (
        <div>
            {isLoading ? (
                <p>Loading users...</p>
            ) : error ? (
                <p className="text-red-500">Failed to load users.</p>
            ) : (
                <Box sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        pageSizeOptions={[5]}
                        disableRowSelectionOnClick
                    />
                    <ManageUserModal
                        open={openModal}
                        onClose={handleCloseModal}
                        userData={selectedUser}
                    />
                </Box>
            )}
        </div>
    );
};

export default ManageUsers;
