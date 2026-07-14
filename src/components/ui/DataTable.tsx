export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = "Sin registros todavía.",
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-brasa-cream/60">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full min-w-max text-left text-sm">
        <thead className="bg-white/5 text-brasa-cream/70">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className="px-4 py-2 font-medium whitespace-nowrap">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-white/5">
              {columns.map((c) => (
                <td key={c.header} className="px-4 py-2 align-middle">
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
