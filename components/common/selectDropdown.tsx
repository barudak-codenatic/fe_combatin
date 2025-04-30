'use client';

interface SelectDropdownProps<T> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  data: T[]; 
  isLoading: boolean;
  error: unknown;
  getLabel: (item: T) => string; 
  getValue: (item: T) => string; 
}

export function SelectDropdown<T>({
  value,
  onChange,
  data,
  isLoading,
  error,
  getLabel,
  getValue,
}: SelectDropdownProps<T>) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading options</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="select">Pilih</label>
      <select
        id="select"
        value={value}
        onChange={onChange}
        className="w-full outline-2 outline-gray-300 focus:outline-black outline rounded-md block p-2"
      >
        <option value="">-- Pilih --</option>
        {data.map((item, idx) => (
          <option key={idx} value={getValue(item)}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
}
