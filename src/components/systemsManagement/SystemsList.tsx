import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useGetAllSystemsHook } from "../../hooks/SystemsHooks";
import { Box } from "@mui/material";

export const SystemsList = () => {
    const { data, error, isLoading } = useGetAllSystemsHook();

    console.log("Systems", data)

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
            minWidth: 50
        },
        {
            field: 'delete',
            headerName: '',
            flex: 1,
            minWidth: 50
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
        </div>
    );
}