import { requireSection } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { ReportesClient } from "@/components/reportes/ReportesClient";

export default async function ReportesPage() {
  await requireSection("reportes");

  return (
    <div>
      <PageHeader title="Reportes: ingresos vs egresos" />
      <ReportesClient />
    </div>
  );
}
