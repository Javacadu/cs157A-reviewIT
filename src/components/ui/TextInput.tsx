interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

export default function TextInput({
  label,
  required,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        autoComplete="off"
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black ${className}`}
      />
    </div>
  );
}