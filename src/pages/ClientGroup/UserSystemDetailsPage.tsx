import { PageContainer } from '@toolpad/core';
import { useParams } from 'react-router-dom';
import { useGetSystemHook } from '../../hooks/SystemsHooks';
import { Box, Typography } from '@mui/material';
import SmartHiveLoading from '../../components/utils/loading/SmartHiveLoading';
import { UserSystemDetails } from '../../components/userSystems/UserSystemDetails';

const UserSystemDetailsPage = () => {
  const { systemId } = useParams();
  const breadcrumbs = [
    { title: "My systems", href: "/Client/Systems" },
    { title: "System details" },
  ];
  const {data: System, error, isLoading} = useGetSystemHook(systemId || null);

  return (
    <>
        <PageContainer title={System?.name} breadcrumbs={breadcrumbs}>
            {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <SmartHiveLoading />
                </Box>
            )}
            
            {error && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <Typography color="error">Error loading system</Typography>
                </Box>
            )}

            {System && (
                <UserSystemDetails system={System} />
            )}
        </PageContainer>
    </>
  );
};

export default UserSystemDetailsPage;

