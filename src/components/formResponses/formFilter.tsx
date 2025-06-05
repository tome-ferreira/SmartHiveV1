import React, { useEffect, useState } from 'react';
import {
  Box, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent,
} from '@mui/material';

export interface FilterValues {
  search: string;
  seen: string;
  type: string;
}

interface Props {
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
}

const FormResponseFilter: React.FC<Props> = ({ filters, onChange }) => {
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ ...filters, search: localSearch });
    }, 400); 

    return () => clearTimeout(timeout);
  }, [localSearch]);

  const handleSeenChange = (e: SelectChangeEvent<string>) => {
    onChange({ ...filters, seen: e.target.value });
  };

  const handleTypeChange = (e: SelectChangeEvent<string>) => {
    onChange({ ...filters, type: e.target.value });
  };

  return (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
      <TextField
        label="Search Name or Email"
        variant="outlined"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Seen</InputLabel>
        <Select
          value={filters.seen}
          label="Seen"
          onChange={handleSeenChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Seen</MenuItem>
          <MenuItem value="false">Not Seen</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Type</InputLabel>
        <Select
          value={filters.type}
          label="Type"
          onChange={handleTypeChange}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="contact">Contact</MenuItem>
          <MenuItem value="interventionRequest">Intervention Request</MenuItem>
          <MenuItem value="endService">End Service</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FormResponseFilter;
