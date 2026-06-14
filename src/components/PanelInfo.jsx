/**
 * components/PanelInfo.jsx
 * Panel derecho con análisis del grafo:
 * - Estadísticas generales
 * - Grados por vértice
 * - Lista de adyacencia
 * - Matriz de adyacencia
 */

import { useMemo, useState } from 'react';
import {
  calcularGradoVertice,
  calcularGradoTotal,
  generarListaAdyacencia,
  generarMatrizAdyacencia,
} from '../utils/grafoUtils';



/* ── Sub-componente: Cabecera de sección ─────────────────── */
function SectionHeader({ title, icon, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width:         '100%',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'space-between',
        padding:       '8px 12px',
        background:    '#21262d',
        border:        '1px solid #30363d',
        borderRadius:  '8px',
        color:         '#8b949e',
        fontSize:      '11px',
        fontWeight:    '600',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        cursor:        'pointer',
        fontFamily:    'Inter, sans-serif',
        transition:    'background 0.15s ease',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#2a3441'}
      onMouseLeave={(e) => e.currentTarget.style.background = '#21262d'}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>{icon}</span> {title}
      </span>
      <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
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
export default function PanelInfo({ vertices, aristas, verticeSeleccionado }) {
  const [openGrados,  setOpenGrados]  = useState(true);
  const [openLista,   setOpenLista]   = useState(true);
  const [openMatriz,  setOpenMatriz]  = useState(true);

  /* ── Métricas derivadas ────────────────────────────────── */
  const gradoTotal = useMemo(() => calcularGradoTotal(aristas), [aristas]);

  const grados = useMemo(
    () =>
      vertices.map((v) => ({
        ...v,
        grado: calcularGradoVertice(v.id, aristas),
      })),
    [vertices, aristas]
  );

  /* Valores máximo y mínimo de grado */
  const { maxGrado, minGrado } = useMemo(() => {
    if (grados.length === 0) return { maxGrado: null, minGrado: null };
    const vals = grados.map((g) => g.grado);
    return { maxGrado: Math.max(...vals), minGrado: Math.min(...vals) };
  }, [grados]);

  const listaAdyacencia = useMemo(
    () => generarListaAdyacencia(vertices, aristas),
    [vertices, aristas]
  );

  const { labels: matrizLabels, matrix } = useMemo(
    () => generarMatrizAdyacencia(vertices, aristas),
    [vertices, aristas]
  );

  /* ── Estilos compartidos ───────────────────────────────── */
  const cardStyle = {
    background:   '#21262d',
    border:       '1px solid #30363d',
    borderRadius: '8px',
    overflow:     'hidden',
  };

  const monoStyle = {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize:   '12px',
  };

  return (
    <aside
      id="panel-info"
      style={{
        width:         '260px',
        minWidth:      '260px',
        height:        '100%',
        overflowY:     'auto',
        background:    '#161b22',
        borderLeft:    '1px solid #30363d',
        display:       'flex',
        flexDirection: 'column',
        gap:           '10px',
        padding:       '14px 10px',
      }}
    >
      {/* Título */}
      <div style={{ padding: '4px 4px 10px', borderBottom: '1px solid #30363d' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#e6edf3' }}>
          Análisis del Grafo
        </div>
        <div style={{ fontSize: '11px', color: '#484f58', marginTop: '2px' }}>
          Actualización en tiempo real
        </div>
      </div>



      {/* Teorema del apretón de manos */}
      {aristas.length > 0 && (
        <div
          style={{
            background:   'rgba(240,136,62,0.08)',
            border:       '1px solid rgba(240,136,62,0.2)',
            borderRadius: '8px',
            padding:      '8px 10px',
            fontSize:     '11px',
            color:        '#8b949e',
            lineHeight:   1.5,
          }}
        >
          <span style={{ color: '#f0883e', fontWeight: '600' }}>📐 Teorema:</span>{' '}
          Grado total = 2 × |E| = 2 × {aristas.length} = <strong style={{ color: '#f0883e' }}>{gradoTotal}</strong>
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
        <div style={cardStyle}>
          {vertices.length === 0 ? (
            <div style={{ padding: '12px', fontSize: '12px', color: '#484f58', textAlign: 'center' }}>
              Sin vértices
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #30363d' }}>
                  <th style={{ padding: '6px 12px', textAlign: 'left',  fontSize: '11px', color: '#8b949e', fontWeight: '600' }}>Vértice</th>
                  <th style={{ padding: '6px 12px', textAlign: 'center', fontSize: '11px', color: '#8b949e', fontWeight: '600' }}>Grado</th>
                  <th style={{ padding: '6px 12px', textAlign: 'left',  fontSize: '11px', color: '#8b949e', fontWeight: '600' }}>Barra</th>
                </tr>
              </thead>
              <tbody>
                {grados.map((v, i) => {
                  const pct        = maxGrado > 0 ? (v.grado / maxGrado) * 100 : 0;
                  const esMax      = v.grado === maxGrado && grados.length > 1;
                  const esMin      = v.grado === minGrado && grados.length > 1 && minGrado !== maxGrado;
                  const esSelected = v.id === verticeSeleccionado;

                  // Color de la barra y del número según prioridad
                  const barColor   = esMax ? 'linear-gradient(90deg, #b45309, #f0883e)'
                                   : esMin ? 'linear-gradient(90deg, #166534, #3fb950)'
                                   : 'linear-gradient(90deg, #1f6feb, #58a6ff)';
                  const numColor   = esMax ? '#f0883e' : esMin ? '#3fb950' : '#e6edf3';

                  // Fondo de la fila
                  const rowBg = esSelected
                    ? 'rgba(188,140,255,0.08)'
                    : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)';

                  return (
                    <tr
                      key={v.id}
                      style={{
                        background:   rowBg,
                        borderLeft:   esSelected ? '3px solid #bc8cff' : '3px solid transparent',
                        transition:   'background 0.2s ease, border-left-color 0.2s ease',
                      }}
                    >
                      {/* Vértice + badges */}
                      <td style={{ padding: '5px 12px 5px 9px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ ...monoStyle, color: esSelected ? '#bc8cff' : '#58a6ff', fontWeight: '600' }}>
                            {v.label}
                          </span>
                          {esMax && (
                            <span style={{
                              fontSize: '8px', fontWeight: '700', color: '#f0883e',
                              background: 'rgba(240,136,62,0.15)', border: '1px solid rgba(240,136,62,0.3)',
                              borderRadius: '3px', padding: '1px 4px', letterSpacing: '0.04em',
                            }}>MAX</span>
                          )}
                          {esMin && (
                            <span style={{
                              fontSize: '8px', fontWeight: '700', color: '#3fb950',
                              background: 'rgba(63,185,80,0.15)', border: '1px solid rgba(63,185,80,0.3)',
                              borderRadius: '3px', padding: '1px 4px', letterSpacing: '0.04em',
                            }}>MIN</span>
                          )}
                        </div>
                      </td>

                      {/* Valor numérico del grado */}
                      <td style={{ padding: '5px 12px', textAlign: 'center', ...monoStyle, color: numColor, fontWeight: esMax || esMin ? '700' : '400' }}>
                        {v.grado}
                      </td>

                      {/* Barra de progreso */}
                      <td style={{ padding: '5px 12px' }}>
                        <div style={{ height: '6px', borderRadius: '3px', background: '#30363d', overflow: 'hidden' }}>
                          <div
                            style={{
                              height:       '100%',
                              width:        `${pct}%`,
                              background:   barColor,
                              borderRadius: '3px',
                              transition:   'width 0.3s ease',
                            }}
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
        <div style={{ ...cardStyle, padding: '10px 12px' }}>
          {vertices.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#484f58', textAlign: 'center' }}>
              Sin vértices
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {vertices.map((v) => {
                const vecinos = listaAdyacencia[v.id] || [];
                return (
                  <div key={v.id} style={{ display: 'flex', alignItems: 'baseline', gap: '6px', ...monoStyle }}>
                    <span style={{ color: '#58a6ff', fontWeight: '600', minWidth: '24px' }}>
                      {v.label}
                    </span>
                    <span style={{ color: '#484f58' }}>→</span>
                    <span style={{ color: vecinos.length > 0 ? '#e6edf3' : '#484f58', wordBreak: 'break-all' }}>
                      {vecinos.length > 0 ? vecinos.sort().join(', ') : '∅'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Matriz de adyacencia ─────── */}
      <SectionHeader
        title="Matriz de Adyacencia"
        icon="🔢"
        isOpen={openMatriz}
        onToggle={() => setOpenMatriz((o) => !o)}
      />
      {openMatriz && (
        <div style={{ ...cardStyle, padding: '10px', overflowX: 'auto' }}>
          {vertices.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#484f58', textAlign: 'center' }}>
              Sin vértices
            </div>
          ) : vertices.length > 12 ? (
            <div style={{ fontSize: '12px', color: '#8b949e', textAlign: 'center', padding: '8px' }}>
              Matriz disponible para grafos con ≤ 12 vértices
            </div>
          ) : (
            <table style={{ borderCollapse: 'collapse', ...monoStyle, fontSize: '11px', margin: '0 auto' }}>
              <thead>
                <tr>
                  <th style={{ width: '22px' }} />
                  {matrizLabels.map((l) => (
                    <th key={l} style={{ padding: '3px 4px', color: '#58a6ff', fontWeight: '600', textAlign: 'center' }}>
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((fila, i) => (
                  <tr key={matrizLabels[i]}>
                    <td style={{ padding: '3px 4px', color: '#58a6ff', fontWeight: '600', textAlign: 'right', paddingRight: '8px' }}>
                      {matrizLabels[i]}
                    </td>
                    {fila.map((val, j) => (
                      <td
                        key={j}
                        style={{
                          padding:     '3px 4px',
                          textAlign:   'center',
                          color:       val === 1 ? '#3fb950' : '#30363d',
                          fontWeight:  val === 1 ? '700' : '400',
                          background:  i === j ? 'rgba(255,255,255,0.03)' : 'transparent',
                          borderRadius:'3px',
                        }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pie */}
      <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #21262d' }}>
        <div style={{ fontSize: '10px', color: '#484f58', textAlign: 'center', lineHeight: 1.5 }}>
          G = (V, E) — Grafo no dirigido
        </div>
      </div>
    </aside>
  );
}
