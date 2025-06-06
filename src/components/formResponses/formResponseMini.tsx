import { Paper } from "@mui/material"
import { WiMoonFull } from "react-icons/wi";
import { FormsBase } from "../../models/formsBase";
import { FormResponseDetailsModal } from "./formResponseDetailsModal";
import { useState } from "react";
import { useMarkFormAsSeenHook } from "../../hooks/FormsHooks";

type FormResponseMiniProps = {
    form: FormsBase
}

export const getDisplayType = (type: string) => {
  const typeMap: Record<string, string> = {
    contact: "Contact",
    interventionRequest: "Intervention Request",
    endService: "End Service",
  };
  return typeMap[type] || type;
};


const FormResponseMini: React.FC<FormResponseMiniProps> = ({form}) =>{
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const { mutateAsync: markAsSeen } = useMarkFormAsSeenHook();

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
    };

    const handleDetailsClick = async () => {
        setOpenDetailsModal(!openDetailsModal);
        await markAsSeen(form.id || -1);
    }

    return (<>
        <Paper key={form.id} onClick={() => handleDetailsClick()} className="mb-2 p-3 rounded-md cursor-pointer transition-colors">
            <div className="flex flex-col md:flex-row md:gap-4">
            {/* Column 1: */}
            <div className="mb-4 md:mb-0 md:flex-1">
                <p className="text-base font-semibold">{form.Name ?? "Unnamed"}</p>
                <p className="text-sm text-gray-600">{form.Email}</p>
            </div>

            {/* Columns 2 e 3*/}
                <div className="flex gap-4 md:flex-1">
                    {/* Column 2 */}
                    <div className="flex-1">
                        <p className="text-sm">{getDisplayType(form.Type)}</p>
                    </div>

                    {/* Column 3 */}
                    <div className="flex-1">
                        {form.Seen ? (
                            <p ></p>
                        ) : (
                            <p><WiMoonFull className="inline-block text-eucalyptus-500" /> </p>
                        )}
                    </div>
                </div>
            </div>
        </Paper>

        <FormResponseDetailsModal 
            open={openDetailsModal} 
            onClose={handleCloseDetailsModal} 
            formBase={form} />
    </>);
}
export default FormResponseMini