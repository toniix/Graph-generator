import { useMemo, useState } from "react";
import {
  calcularGradoVertice,
  calcularGradoTotal,
  generarListaAdyacencia,
  generarMatrizAdyacencia,
} from "../utils/grafoUtils";
import "../styles/PanelInfo.css";

/* ── Sub-componente: Cabecera de sección ─────────────────── */
function SectionHeader({ title, icon, isOpen, onToggle }) {
  return (
    <button onClick={onToggle} className="section-header">
      <span className="section-header__left">
        <span>{icon}</span> {title}
      </span>
      <span
        className={`section-header__chevron${isOpen ? " section-header__chevron--open" : ""}`}
      >
        ▾
      </span>
    </button>
  );
}

/**
 * @param {Object}      props
 * @param {Array}       props.vertices
 * @param {Array}       props.aristas
 * @param {string|null} props.verticeSeleccionado - ID del vértice activo
 */
export default function PanelInfo({
  vertices,
  aristas,
  verticeSeleccionado,
  componentesConColores = [],
}) {
  const [openComponentes, setOpenComponentes] = useState(true);
  const [openGrados, setOpenGrados] = useState(true);
  const [openLista, setOpenLista] = useState(true);
  const [openMatriz, setOpenMatriz] = useState(true);

  /* ── Métricas derivadas ────────────────────────────────── */
  const gradoTotal = useMemo(() => calcularGradoTotal(aristas), [aristas]);

  const grados = useMemo(
    () =>
      vertices.map((v) => ({
        ...v,
        grado: calcularGradoVertice(v.id, aristas),
      })),
    [vertices, aristas],
  );

  /* Valores máximo y mínimo de grado */
  const { maxGrado, minGrado } = useMemo(() => {
    if (grados.length === 0) return { maxGrado: null, minGrado: null };
    const vals = grados.map((g) => g.grado);
    return { maxGrado: Math.max(...vals), minGrado: Math.min(...vals) };
  }, [grados]);

  const listaAdyacencia = useMemo(
    () => generarListaAdyacencia(vertices, aristas),
    [vertices, aristas],
  );

  const { labels: matrizLabels, matrix } = useMemo(
    () => generarMatrizAdyacencia(vertices, aristas),
    [vertices, aristas],
  );

  return (
    <aside id="panel-info" className="panel-info">
      {/* Título */}
      <div className="panel-info__header">
        <div className="panel-info__title">Análisis del Grafo</div>
        <div className="panel-info__subtitle">Actualización en tiempo real</div>
      </div>

      {/* Tarjeta de Componentes Conexas */}
      <div className="info-card--components">
        <div className="info-card__icon">🧩</div>
        <div>
          <div className="info-card__count">{componentesConColores.length}</div>
          <div className="info-card__label">Componentes conexas</div>
        </div>
      </div>

      {/* Teorema del apretón de manos */}
      {aristas.length > 0 && (
        <div className="info-theorem">
          <span className="info-theorem__label">📐 Teorema:</span> Grado total =
          2 × |E| = 2 × {aristas.length} ={" "}
          <strong className="info-theorem__value">{gradoTotal}</strong>
        </div>
      )}

      {/* ── Componentes Conexas ─────── */}
      <SectionHeader
        title="Componentes Conexas"
        icon="📌"
        isOpen={openComponentes}
        onToggle={() => setOpenComponentes((o) => !o)}
      />
      {openComponentes && (
        <div className="info-content-card info-content-card--componentes info-content-card--padded">
          {vertices.length === 0 ? (
            <div className="info-empty">Sin vértices</div>
          ) : (
            <div className="components-list">
              {componentesConColores.map((comp) => (
                <div key={comp.id} className="component-item">
                  <div className="component-item__header">
                    <span
                      className="component-item__dot"
                      style={{ background: comp.color }}
                    />
                    <span className="component-item__name">
                      Componente {comp.id}
                    </span>
                    <span className="component-item__count">
                      ({comp.vertices.length}{" "}
                      {comp.vertices.length === 1 ? "vértice" : "vértices"})
                    </span>
                  </div>
                  <div className="component-item__vertices">
                    {comp.vertices.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Grados por vértice ─────── */}
      <SectionHeader
        title="Grados"
        icon="📊"
        isOpen={openGrados}
        onToggle={() => setOpenGrados((o) => !o)}
      />
      {openGrados && (
        <div className="info-content-card info-content-card--grados">
          {vertices.length === 0 ? (
            <div className="info-empty">Sin vértices</div>
          ) : (
            <table className="degrees-table">
              <thead>
                <tr>
                  <th>Vértice</th>
                  <th>Grado</th>
                  <th>Barra</th>
                </tr>
              </thead>
              <tbody>
                {grados.map((v, i) => {
                  const pct = maxGrado > 0 ? (v.grado / maxGrado) * 100 : 0;
                  const esMax = v.grado === maxGrado && grados.length > 1;
                  const esMin =
                    v.grado === minGrado &&
                    grados.length > 1 &&
                    minGrado !== maxGrado;
                  const esSelected = v.id === verticeSeleccionado;

                  // Color de la barra
                  const barColor = esMax
                    ? "linear-gradient(90deg, #b45309, #f0883e)"
                    : esMin
                      ? "linear-gradient(90deg, #166534, #3fb950)"
                      : "linear-gradient(90deg, #1f6feb, #58a6ff)";

                  // Color del número
                  const numColor = esMax
                    ? "#f0883e"
                    : esMin
                      ? "#3fb950"
                      : "#e6edf3";

                  // Clase de la fila
                  const rowClass = [
                    "degrees-table__row",
                    esSelected
                      ? "degrees-table__row--selected"
                      : "degrees-table__row--normal",
                    !esSelected && i % 2 !== 0 ? "degrees-table__row--odd" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <tr key={v.id} className={rowClass}>
                      {/* Vértice + badges */}
                      <td className="degrees-table__cell-vertex">
                        <div className="vertex-cell">
                          <span
                            className="vertex-label"
                            style={{
                              color: esSelected ? "#bc8cff" : "#58a6ff",
                            }}
                          >
                            {v.label}
                          </span>
                          {esMax && (
                            <span className="degree-badge degree-badge--max">
                              MAX
                            </span>
                          )}
                          {esMin && (
                            <span className="degree-badge degree-badge--min">
                              MIN
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Valor numérico del grado */}
                      <td
                        className="degrees-table__cell-value"
                        style={{
                          color: numColor,
                          fontWeight: esMax || esMin ? "700" : "400",
                        }}
                      >
                        {v.grado}
                      </td>

                      {/* Barra de progreso */}
                      <td className="degrees-table__cell-bar">
                        <div className="degree-bar-track">
                          <div
                            className="degree-bar-fill"
                            style={{ width: `${pct}%`, background: barColor }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Lista de adyacencia ────── */}
      <SectionHeader
        title="Lista de Adyacencia"
        icon="📋"
        isOpen={openLista}
        onToggle={() => setOpenLista((o) => !o)}
      />
      {openLista && (
        <div className="info-content-card info-content-card--lista info-content-card--padded">
          {vertices.length === 0 ? (
            <div className="info-empty">Sin vértices</div>
          ) : (
            <div className="adjacency-list">
              {vertices.map((v) => {
                const vecinos = listaAdyacencia[v.id] || [];
                return (
                  <div key={v.id} className="adjacency-row">
                    <span className="adjacency-row__key">{v.label}</span>
                    <span className="adjacency-row__arrow">→</span>
                    <span
                      className={
                        vecinos.length > 0
                          ? "adjacency-row__value--filled"
                          : "adjacency-row__value--empty"
                      }
                    >
                      {vecinos.length > 0 ? vecinos.sort().join(", ") : "∅"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Matriz de adyacencia (comentada) ─────── */}
      {/* <SectionHeader ... /> */}

      {/* Pie */}
      <div className="panel-info__footer">
        <div className="panel-info__footer-text">
          G = (V, E) — Grafo no dirigido
        </div>
      </div>
    </aside>
  );
}
