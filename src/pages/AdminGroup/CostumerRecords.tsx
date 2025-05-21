import { useState } from "react";
import SmartHivePrimaryBtn from "../../components/utils/btns/SmartHivePrimaryBtn";
import { CreateRecordForm } from "../../components/costumerRecordsManagement/CreateRecordForm";
import { RecordList } from "../../components/costumerRecordsManagement/RecordList";

const CostumerRecordsPage = () => {
    const [isCreate, setIsCreate] = useState<boolean>(false);

    return (
        <div>
            <SmartHivePrimaryBtn
                text={isCreate ? "Go back" : "Add record"}
                onClick={() => setIsCreate(!isCreate)}
            />

            {isCreate ? (
                <CreateRecordForm onSuccess={() => setIsCreate(false)} />
            ) : (
                <RecordList />
            )}
        </div>
    );
}

export default CostumerRecordsPage;