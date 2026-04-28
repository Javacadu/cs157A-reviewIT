interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export default function SelectInput({
  label,
  required,
  options,
  placeholder,
  className = "",
  ...props
}: SelectInputProps) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...props}
        autoComplete="off"
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}