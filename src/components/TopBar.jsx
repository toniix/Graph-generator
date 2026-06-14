/**
 * components/TopBar.jsx
 * Chips de estadísticas del grafo que flotan de manera elegante en el canvas.
 * Muestra: vértices, aristas, grado total y el grado del vértice seleccionado.
 */

import { useMemo } from 'react';
import { calcularGradoVertice, calcularGradoTotal } from '../utils/grafoUtils';

/* ── Chip base con Glassmorphism ────────────────────────────── */
function Chip({ icon, label, value, color, accent = false, pulse = false, badge }) {
  return (
    <div
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        gap:            '8px',
        padding:        '6px 14px',
        borderRadius:   '999px',
        background:     accent
          ? `linear-gradient(135deg, ${color}20, ${color}08)`
          : 'rgba(22, 27, 34, 0.65)',
        backdropFilter: 'blur(12px)',
        border:         `1px solid ${accent ? color + '66' : 'rgba(255, 255, 255, 0.08)'}`,
        boxShadow:      accent
          ? `0 4px 12px ${color}15, 0 2px 4px rgba(0,0,0,0.15)`
          : '0 4px 12px rgba(0,0,0,0.2)',
        transition:     'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position:       'relative',
        overflow:       'hidden',
        pointerEvents:  'auto',
        userSelect:     'none',
      }}
    >
      {/* Shimmer animado para el chip activo */}
      {pulse && (
        <span
          style={{
            position:   'absolute',
            inset:      0,
            background: `linear-gradient(90deg, transparent, ${color}15, transparent)`,
            animation:  'shimmer 1.8s ease-in-out infinite',
          }}
        />
      )}

      {/* Icono */}
      <span style={{ fontSize: '13px', lineHeight: 1 }}>{icon}</span>

      {/* Texto */}
      <span
        style={{
          fontSize:   '12px',
          color:      '#8b949e',
          fontWeight: '500',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>

      {/* Valor principal */}
      <span
        style={{
          fontSize:    '15px',
          fontWeight:  '700',
          color:       accent ? color : '#e6edf3',
          fontFamily:  "'JetBrains Mono', monospace",
          lineHeight:  1,
        }}
      >
        {value}
      </span>

      {/* Badge opcional (ej: "MAX" / "MIN") */}
      {badge && (
        <span
          style={{
            fontSize:     '9px',
            fontWeight:   '700',
            color:        color,
            background:   `${color}20`,
            border:       `1px solid ${color}40`,
            borderRadius: '4px',
            padding:      '1px 5px',
            letterSpacing: '0.05em',
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
    <>
      {/* Keyframe para el shimmer */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%);  }
        }
      `}</style>

      <div
        id="top-bar-overlay"
        style={{
          position:      'absolute',
          top:           '16px',
          left:          '50%',
          transform:     'translateX(-50%)',
          zIndex:        10,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '8px',
          pointerEvents: 'none',
          width:         'max-content',
        }}
      >
        {/* Fila principal de chips */}
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
          }}
        >
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
            <span
              style={{
                fontSize:       '10px',
                color:          '#8b949e',
                background:     'rgba(22, 27, 34, 0.7)',
                backdropFilter: 'blur(8px)',
                border:         '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius:   '6px',
                padding:        '3px 10px',
                pointerEvents:  'auto',
                boxShadow:      '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              💡 Selecciona un vértice para ver su grado
            </span>
          )}

          {gradoSeleccionado && grados.length >= 2 && (
            <div
              style={{
                display:       'flex',
                gap:           '6px',
                alignItems:    'center',
                pointerEvents: 'auto',
              }}
            >
              <span
                style={{
                  fontSize:       '10px',
                  color:          '#f0883e',
                  background:     'rgba(240, 136, 62, 0.12)',
                  border:         '1px solid rgba(240, 136, 62, 0.25)',
                  borderRadius:   '4px',
                  padding:        '2px 7px',
                  backdropFilter: 'blur(8px)',
                  boxShadow:      '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                🔥 MAX = {maxGrado}
              </span>
              <span
                style={{
                  fontSize:       '10px',
                  color:          '#3fb950',
                  background:     'rgba(63, 185, 80, 0.12)',
                  border:         '1px solid rgba(63, 185, 80, 0.25)',
                  borderRadius:   '4px',
                  padding:        '2px 7px',
                  backdropFilter: 'blur(8px)',
                  boxShadow:      '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                ❄️ MIN = {minGrado}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
