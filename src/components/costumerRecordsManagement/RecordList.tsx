import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useGetAllCostumerRecordsHook } from "../../hooks/CostumerRecordsHooks";
import { Box } from "@mui/material";
import SmartHiveOutlineBtnXS from "../utils/btns/SmartHiveOutlineBtnXS";
import { useState } from "react";
import { DetailsEditRecordModal } from "./DetailsEditRecordModal";
import SmartHiveDangerBtnXS from "../utils/btns/SmartHiveDangerBtnXS";
import { DeleteRecordModal } from "./DeleteRecordModal";

export const RecordList = () => {
    const { data, error, isLoading } = useGetAllCostumerRecordsHook();
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
            field: 'name',
            headerName: 'Name',
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
    

    const rows = data?.map((record: any, index: number) => ({
        id: record.id ?? index,
        name: record.Name,
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
                        noRowsLabel: "No customer records found.",
                    }}
                />      
            </Box>

            <DetailsEditRecordModal
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                recordId={selectedId}
            />

            <DeleteRecordModal 
                open={openDeleteModal} 
                onClose={handleCloseDeleteModal} 
                recordId={selectedId} 
            />
        </div>
    );
        
   
}