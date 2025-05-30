import { Container } from "@mui/material";
import { FullSystemDetails } from "../../models/SystemDetails";

interface RemoteAccesIFrameProps {
  system: FullSystemDetails;
}

export const RemoteAccesIFrame = ({ system }: RemoteAccesIFrameProps) => {
  return (
    <Container sx={{ mt: 4 }}>
      <iframe
        src={system.remoteaccesslink || ""} 
        title={`Remote access to ${system.name}`}
        style={{
          width: '100%',
          height: '600px', 
          border: 'none',
        }}
        allowFullScreen
      />
    </Container>
  );
};
