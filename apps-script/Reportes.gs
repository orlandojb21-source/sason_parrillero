/**
 * payload: { desde?, hasta? } fechas ISO (inclusive). Sin pestaña propia:
 * ingresos = suma de Ventas.total, egresos = suma de Gastos.monto, ambos
 * filtrados por rango y agrupados por día para la serie del gráfico.
 */
function Reportes_resumen(payload) {
  var desde = payload && payload.desde ? new Date(payload.desde) : null;
  var hasta = payload && payload.hasta ? new Date(payload.hasta) : null;

  function enRango(fechaValor) {
    var fecha = new Date(fechaValor);
    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;
    return true;
  }

  var ventas = listObjects_("Ventas").filter(function (v) {
    return enRango(v.fecha);
  });
  var gastos = listObjects_("Gastos").filter(function (g) {
    return enRango(g.fecha);
  });

  var ingresos = ventas.reduce(function (sum, v) {
    return sum + (Number(v.total) || 0);
  }, 0);
  var egresos = gastos.reduce(function (sum, g) {
    return sum + (Number(g.monto) || 0);
  }, 0);

  var porDia = {};
  function acumular(fechaValor, campo, monto) {
    var key = Utilities.formatDate(new Date(fechaValor), Session.getScriptTimeZone(), "yyyy-MM-dd");
    if (!porDia[key]) porDia[key] = { fecha: key, ingresos: 0, egresos: 0 };
    porDia[key][campo] += monto;
  }
  ventas.forEach(function (v) {
    acumular(v.fecha, "ingresos", Number(v.total) || 0);
  });
  gastos.forEach(function (g) {
    acumular(g.fecha, "egresos", Number(g.monto) || 0);
  });

  var serie = Object.keys(porDia)
    .sort()
    .map(function (k) {
      return porDia[k];
    });

  return {
    ingresos: ingresos,
    egresos: egresos,
    neto: ingresos - egresos,
    serie: serie,
  };
}
