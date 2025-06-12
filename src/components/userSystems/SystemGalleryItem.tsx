import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";

interface Props {
    id: number;
    name: string;
}

export const SystemGalleryItem = ({ id, name }: Props) => {
    const navigate = useNavigate();

    const handleViewDetails = (systemId: number) => {
        navigate(`/Client/Systems/Details/${systemId}`);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 2,
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.03)',
                },
            }}
            onClick={() => handleViewDetails(id)}
        >
            <Typography variant="h6" align="center">
                {name}
            </Typography>
        </Paper>
    );
};
