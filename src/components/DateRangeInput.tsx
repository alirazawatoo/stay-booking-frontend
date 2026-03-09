import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangeInputProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

// The picker selects a range in one control, so start can never be after end.
const DateRangeInput: React.FC<DateRangeInputProps> = ({ startDate, endDate, onChange }) => (
  <label className="block w-full sm:w-auto">
    <span className="sr-only">Date range</span>
    <DatePicker
      selectsRange
      selected={startDate}
      startDate={startDate}
      endDate={endDate}
      onChange={([start, end]) => onChange(start, end)}
      placeholderText="Select date range"
      className="w-full rounded-lg border bg-gray-50 p-2"
      todayButton="Today"
      isClearable
    />
  </label>
);

export default DateRangeInput;
