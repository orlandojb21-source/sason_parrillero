export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  step,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-brasa-cream/80">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        step={step}
        placeholder={placeholder}
        className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-brasa-cream/80">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextareaField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-brasa-cream/80">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-brasa-cream outline-none focus:border-brasa-flame"
      />
    </label>
  );
}
