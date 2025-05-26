import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetAllSystemsHook } from "../../hooks/SystemsHooks";
import { Box } from "@mui/material";
import { useState } from "react";
import { DetailsEditSystemModal } from "./DetailsEditSystemModal";
import SmartHiveOutlineBtnXS from "../utils/btns/SmartHiveOutlineBtnXS";
import { DeleteSystemModal } from "./DeleteSystemModal";
import SmartHiveDangerBtnXS from "../utils/btns/SmartHiveDangerBtnXS";

export const SystemsList = () => {
    const { data, error, isLoading } = useGetAllSystemsHook();
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState<any | null>(null);

    const handleDetailsClick = (id: string) => {
        setOpenDetailsModal(true);
        setSelectedId(id);
    };

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setSelectedId(null);
    };

    const handleDeleteClick = (id: string) => {
        setOpenDeleteModal(true);
        setSelectedId(id);
    }

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
        setSelectedId(null);
    }

    const columns: GridColDef<(typeof rows)[number]>[] = [
        {
            field: 'system',
            headerName: 'System',
            flex: 1,
            minWidth: 100
        },
        {
            field: 'costumer',
            headerName: 'Costumer',
            flex: 1,
            minWidth: 100
        },
        {
            field: 'details',
            headerName: '',
            flex: 1,
            minWidth: 50,
            renderCell: (params) =>{
                return(
                    <SmartHiveOutlineBtnXS
                        label="Details"
                        onClick={() => handleDetailsClick(params.row.id)}
                    />
                );
            }
        },
        {
            field: 'delete',
            headerName: '',
            flex: 1,
            minWidth: 50,
            renderCell: (params) =>{
                return(
                    <SmartHiveDangerBtnXS 
                        label="Delete"
                        onClick={() => handleDeleteClick(params.row.id)}
                    />
                );
            }
        }
    ];

    const rows = data?.map((system: any, index: number) => ({
        id: system.id ?? index,
        system: system.name,
        costumer: system.clientname,
    })) || [];

    return(
        <div className="mt-3">
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
                    localeText={{
                        noRowsLabel: "No systems found.",
                    }}
                />      
            </Box>

            <DetailsEditSystemModal 
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                systemId={selectedId}
            />

            <DeleteSystemModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                systemId={selectedId}
            />
        </div>
    );
}