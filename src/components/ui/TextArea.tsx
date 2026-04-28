interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}

export default function TextArea({
  label,
  required,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        autoComplete="off"
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black ${className}`}
      />
    </div>
  );
}