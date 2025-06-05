import { useState } from "react";
import FormResponseFilter, { FilterValues } from "../../components/formResponses/formFilter";
import { useGetFormsAdminHook } from "../../hooks/FormsHooks";
import SmartHiveLoading from "../../components/utils/loading/SmartHiveLoading";
import { Paper } from "@mui/material";
import { WiMoonFull } from "react-icons/wi";
import FormResponseMini from "../../components/formResponses/formResponseMini";

const PAGE_SIZE = 10;

const FormResponsesPage = () => {
    const [filters, setFilters] = useState<FilterValues>({
        search: '',
        seen: '',
        type: ''
    });

    const [currentPage, setCurrentPage] = useState(0);
    const offset = currentPage * PAGE_SIZE;

    const { data, error: formsError, isLoading: formsLoading } = useGetFormsAdminHook(PAGE_SIZE, offset);

    const forms = data?.data || [];
    const totalCount = data?.count || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
        setCurrentPage(0); 
    };

    const handleNextPage = () => setCurrentPage((prev) => prev + 1);
    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

    const filteredForms = forms.filter((form) => {
        const { search, seen, type } = filters;

        if (type && form.Type !== type) return false;
        if (seen === 'true' && !form.Seen) return false;
        if (seen === 'false' && form.Seen) return false;

        if (search) {
            const searchLower = search.toLowerCase();
            const nameMatch = form.Name?.toLowerCase().includes(searchLower);
            const emailMatch = form.Email?.toLowerCase().includes(searchLower);
            if (!nameMatch && !emailMatch) return false;
        }

        return true;
    });

    return (
        <>
            <FormResponseFilter filters={filters} onChange={handleFilterChange} />

            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-3 mb-2">
                <div className="text-sm text-gray-600">
                    Showing {filteredForms.length} of {totalCount} forms &nbsp;|&nbsp;
                    Page {currentPage + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={(currentPage + 1) >= totalPages}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Form list */}
            <div>
                {formsLoading && <SmartHiveLoading />}
                {formsError && <p className="text-red-500">Error loading forms</p>}
                {!formsLoading && filteredForms.length === 0 && (
                    <p className="text-gray-500">No forms found.</p>
                )}
                {filteredForms.map((form) => (
                    <FormResponseMini key={form.id} form={form} />
                ))}
            </div>
        </>
    );
};

export default FormResponsesPage;
