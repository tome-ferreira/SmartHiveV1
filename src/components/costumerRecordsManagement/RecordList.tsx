import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { useGetAllCostumerRecordsHook } from "../../hooks/CostumerRecordsHooks";
import { Box } from "@mui/material";

export const RecordList = () => {
    const { data, error, isLoading } = useGetAllCostumerRecordsHook();

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
            minWidth: 50
        },
        {
            field: 'delete',
            headerName: '',
            flex: 1,
            minWidth: 50
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
        </div>
    );
        
   
}