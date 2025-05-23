import { useEffect, useState } from "react";
import { Modal, Paper, Slide } from "@mui/material";
import SmartHivePrimaryBtnXS from "../utils/btns/SmartHivePrimaryBtnXS";
import SmartHiveLoading from "../utils/loading/SmartHiveLoading";
import { CostumerRecordSimple } from "../../models/costumerRecordSimple";
import { useGetAllCostumerRecordsSimpleHook } from "../../hooks/CostumerRecordsHooks";

interface AddFromCostumerModalProps {
    open: boolean;
    onClose: () => void;
    onCostumerSelected: (costumer: CostumerRecordSimple) => void;
}

export const AddFromCostumerModal = ({ open, onClose, onCostumerSelected }: AddFromCostumerModalProps) => {
    const { data, error, isLoading, refetch } = useGetAllCostumerRecordsSimpleHook();
    const [searchTerm, setSearchTerm] = useState("");
    const [selected, setSelected] = useState<CostumerRecordSimple | null>(null);

    useEffect(() => {
        if (open) {
            refetch();
            setSearchTerm("");
            setSelected(null);
        }
    }, [open]);

    const filteredCostumers = (data ?? []).filter((costumer: CostumerRecordSimple) => {
        const name = costumer.Name?.toLowerCase() ?? "";
        const email = costumer.Email?.toLowerCase() ?? "";
        const term = searchTerm.toLowerCase();
        return name.includes(term) || email.includes(term);
    });

    return (
        <Modal open={open} onClose={onClose}>
            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 outline-none">
                    <Paper className="h-full p-6 rounded-none flex flex-col font-sans">
                        <div className="flex-1 overflow-y-auto">
                            <h1 className="text-lg font-semibold mb-3">Select a customer</h1>

                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 mb-4 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                            />

                            {isLoading && <SmartHiveLoading />}
                            {error && <p className="text-red-500">Error loading customers</p>}

                            {filteredCostumers.length > 0 ? (
                                filteredCostumers.map((costumer) => (
                                    <div
                                        key={costumer.id}
                                        onClick={() => setSelected(costumer)}
                                        className={`mb-2 p-3 rounded-md cursor-pointer transition-colors ${
                                            selected?.id === costumer.id
                                                ? "bg-blue-100 border border-blue-500"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        <p className="text-base font-semibold">{costumer.Name ?? "Unnamed"}</p>
                                        <p className="text-sm text-gray-600">{costumer.Email}</p>
                                    </div>
                                ))
                            ) : (
                                !isLoading && <p className="text-gray-500">No customers found.</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <SmartHivePrimaryBtnXS label="Cancel" onClick={onClose} />
                            {selected && (
                                <SmartHivePrimaryBtnXS
                                    label="Select"
                                    onClick={() => {
                                        onCostumerSelected(selected);
                                        setSelected(null);
                                    }}
                                />
                            )}
                        </div>
                    </Paper>
                </div>
            </Slide>
        </Modal>
    );
};
