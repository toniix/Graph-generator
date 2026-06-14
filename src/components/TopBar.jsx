/**
 * components/TopBar.jsx
 * Chips de estadísticas del grafo que flotan de manera elegante en el canvas.
 * Muestra: vértices, aristas, grado total y el grado del vértice seleccionado.
 */

import { useMemo } from 'react';
import { calcularGradoVertice, calcularGradoTotal } from '../utils/grafoUtils';
import '../styles/TopBar.css';

/* ── Chip base con Glassmorphism ────────────────────────────── */
function Chip({ icon, label, value, color, accent = false, pulse = false, badge }) {
  const chipClass = `chip ${accent ? 'chip--accent' : 'chip--default'}`;

  // Estilos dinámicos que dependen del color (necesariamente inline)
  const accentStyle = accent ? {
    background: `linear-gradient(135deg, ${color}20, ${color}08)`,
    border: `1px solid ${color}66`,
    boxShadow: `0 4px 12px ${color}15, 0 2px 4px rgba(0,0,0,0.15)`,
  } : {};

  return (
    <div className={chipClass} style={accentStyle}>
      {/* Shimmer animado para el chip activo */}
      {pulse && (
        <span
          className="chip__shimmer"
          style={{ background: `linear-gradient(90deg, transparent, ${color}15, transparent)` }}
        />
      )}

      {/* Icono */}
      <span className="chip__icon">{icon}</span>

      {/* Texto */}
      <span className="chip__label">{label}</span>

      {/* Valor principal */}
      <span
        className="chip__value"
        style={{ color: accent ? color : undefined }}
      >
        {value}
      </span>

      {/* Badge opcional (ej: "MAX" / "MIN") */}
      {badge && (
        <span
          className="chip__badge"
          style={{
            color,
            background: `${color}20`,
            border: `1px solid ${color}40`,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

/**
 * @param {Object}      props
 * @param {Array}       props.vertices
 * @param {Array}       props.aristas
 * @param {string|null} props.verticeSeleccionado - ID del vértice activo en el canvas
 */
export default function TopBar({ vertices, aristas, verticeSeleccionado }) {
  const gradoTotal = useMemo(() => calcularGradoTotal(aristas), [aristas]);

  /* Calcular grados de todos los vértices */
  const grados = useMemo(
    () =>
      vertices.map((v) => ({
        id:    v.id,
        label: v.label,
        grado: calcularGradoVertice(v.id, aristas),
      })),
    [vertices, aristas]
  );

  /* Grado del vértice seleccionado */
  const gradoSeleccionado = useMemo(() => {
    if (!verticeSeleccionado) return null;
    const encontrado = grados.find((g) => g.id === verticeSeleccionado);
    return encontrado ?? null;
  }, [verticeSeleccionado, grados]);

  /* Máximo y mínimo grado */
  const { maxGrado, minGrado } = useMemo(() => {
    if (grados.length === 0) return { maxGrado: null, minGrado: null };
    const valores = grados.map((g) => g.grado);
    return {
      maxGrado: Math.max(...valores),
      minGrado: Math.min(...valores),
    };
  }, [grados]);

  /* ¿El vértice seleccionado tiene grado máximo / mínimo? */
  const esMax = gradoSeleccionado !== null && gradoSeleccionado.grado === maxGrado;
  const esMin = gradoSeleccionado !== null && gradoSeleccionado.grado === minGrado && gradoSeleccionado.grado !== maxGrado;

  /* Color del chip de selección */
  const colorSeleccion = esMax ? '#f0883e' : esMin ? '#3fb950' : '#bc8cff';
  const badgeSeleccion = esMax ? 'MAX' : esMin ? 'MIN' : null;

  return (
    <div id="top-bar-overlay" className="topbar-overlay">
      {/* Fila principal de chips */}
      <div className="topbar-chips-row">
        <Chip
          icon="⬤"
          label="Vértices"
          value={vertices.length}
          color="#58a6ff"
        />
        <Chip
          icon="〰"
          label="Aristas"
          value={aristas.length}
          color="#bc8cff"
        />
        <Chip
          icon="∑"
          label="Grado total"
          value={gradoTotal}
          color="#f0883e"
        />

        {/* Chip de vértice seleccionado */}
        {gradoSeleccionado && (
          <Chip
            icon={esMax ? '🔥' : esMin ? '❄️' : '📍'}
            label={`δ(${gradoSeleccionado.label})`}
            value={gradoSeleccionado.grado}
            color={colorSeleccion}
            accent
            pulse
            badge={badgeSeleccion}
          />
        )}
      </div>

      {/* Fila secundaria de hints y límites (MAX / MIN) */}
      <div>
        {grados.length >= 2 && !verticeSeleccionado && (
          <span className="topbar-hint">
            💡 Selecciona un vértice para ver su grado
          </span>
        )}

        {gradoSeleccionado && grados.length >= 2 && (
          <div className="topbar-hints-row">
            <span className="topbar-stat-pill topbar-stat-pill--max">
              🔥 MAX = {maxGrado}
            </span>
            <span className="topbar-stat-pill topbar-stat-pill--min">
              ❄️ MIN = {minGrado}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
