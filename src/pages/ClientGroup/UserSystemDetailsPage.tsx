import { useParams } from 'react-router-dom';

const UserSystemDetailsPage = () => {
  const { systemId } = useParams();

  return (
    <div>
      <h1>System Details</h1>
      <p>Viewing details for system ID: <strong>{systemId}</strong></p>
      {/* You can fetch and display system data based on this ID */}
    </div>
  );
};

export default UserSystemDetailsPage;
