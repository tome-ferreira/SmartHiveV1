import { Grid, Box, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useGetAllUserSystemsHook } from "../../hooks/SystemsHooks";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import { SystemGalleryItem } from "./SystemGalleryItem";


export const UserSystemsGallery = () => {
    const { user } = useAuth();
    const { data, error, isLoading } = useGetAllUserSystemsHook(user?.id || "");
    console.log("Costumer record: ", data);

    return (
        <>
            {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <SmartHiveLoading />
                </Box>
            )}

            {error && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Typography color="error">Error loading systems</Typography>
                </Box>
            )}

            
            {!isLoading && data?.length === 0 && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Typography color="textSecondary">No systems found.</Typography>
                </Box>
            )}

            <Grid container spacing={3}>
                {data?.map((sys) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={sys.id}>
                        <SystemGalleryItem id={sys.id} name={sys.Name} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
