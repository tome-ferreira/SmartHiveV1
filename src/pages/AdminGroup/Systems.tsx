import { useState } from "react";
import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { CreateRecordForm } from "../../components/costumerRecordsManagement/CreateRecordForm";
import { SystemsList } from "../../components/systemsManagement/SystemsList";
import { CreateSystemForm } from "../../components/systemsManagement/CreateSystemForm";

export const SystemsPage = () => {
    const [isCreate, setIsCreate] = useState<boolean>(false);

    return (
        <div>
            <SmartHivePrimaryBtn
                text={isCreate ? "Go back" : "Add record"}
                onClick={() => setIsCreate(!isCreate)}
            />

            {isCreate ? (
                <CreateSystemForm onSuccess={() => setIsCreate(false)} />
            ) : (
                <SystemsList />
            )}
        </div>
    );
}

