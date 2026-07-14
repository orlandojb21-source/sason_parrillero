"use client";

export function DeleteButton({
  action,
  label = "Eliminar",
  confirmMessage = "¿Eliminar este registro? Esta acción no se puede deshacer.",
}: {
  action: (formData: FormData) => Promise<void>;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-xs text-brasa-ember hover:underline">
        {label}
      </button>
    </form>
  );
}
