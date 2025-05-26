import { Container } from "@mui/material";
import { SystemWithClientName } from "../../models/systemWithClientName";

interface RemoteAccesIFrameProps {
  system: SystemWithClientName;
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
