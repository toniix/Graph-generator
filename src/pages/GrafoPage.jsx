/**
 * pages/GrafoPage.jsx
 * Página principal — orquesta los tres paneles y el estado global del grafo.
 * Gestiona el flujo de creación de aristas en dos pasos
 * y el estado de selección de vértice para el TopBar.
 */

import { useState, useCallback } from 'react';
import { useGrafo }       from '../hooks/useGrafo';
import GrafoCanvas        from '../components/GrafoCanvas';
import PanelControles     from '../components/PanelControles';
import PanelInfo          from '../components/PanelInfo';
import TopBar             from '../components/TopBar';

/**
 * Estados del flujo de creación de arista:
 *  'none'             — modo normal
 *  'selecting-source' — esperando click en nodo origen
 *  'selecting-target' — esperando click en nodo destino
 */

export default function GrafoPage() {
  const {
    vertices,
    aristas,
    agregarVertice,
    eliminarVertice,
    renombrarVertice,
    moverVertice,
    agregarArista,
    eliminarArista,
    reiniciarGrafo,
  } = useGrafo();

  /* Estado del flujo de creación de arista */
  const [modoArista,   setModoArista]   = useState('none');
  const [aristaSource, setAristaSource] = useState(null);

  /* Estado de vértice seleccionado en el canvas */
  const [verticeSeleccionado, setVerticeSeleccionado] = useState(null);

  /* ── Handlers de arista ────────────────────────────── */

  const handleIniciarArista = useCallback(() => {
    setModoArista('selecting-source');
    setAristaSource(null);
  }, []);

  const handleCancelarArista = useCallback(() => {
    setModoArista('none');
    setAristaSource(null);
  }, []);

  /**
   * Lógica de selección de nodo en modo creación de arista.
   * Primer click → nodo origen; Segundo click → nodo destino (crea arista).
   */
  const handleSeleccionarNodo = useCallback(
    (nodeId) => {
      if (modoArista === 'selecting-source') {
        setAristaSource(nodeId);
        setModoArista('selecting-target');
      } else if (modoArista === 'selecting-target') {
        if (nodeId !== aristaSource) {
          agregarArista(aristaSource, nodeId);
        }
        setModoArista('none');
        setAristaSource(null);
      }
    },
    [modoArista, aristaSource, agregarArista]
  );

  /**
   * Callback general de selección de nodo (siempre dispara).
   * Limpia la selección si el vértice fue eliminado.
   */
  const handleNodoSeleccionado = useCallback(
    (nodeId) => {
      // nodeId puede ser null (deselección al click en fondo)
      setVerticeSeleccionado(nodeId);
    },
    []
  );

  // Limpiar selección si el vértice seleccionado fue eliminado
  const verticeSeleccionadoValido =
    verticeSeleccionado && vertices.some((v) => v.id === verticeSeleccionado)
      ? verticeSeleccionado
      : null;

  return (
    <div
      id="grafo-page"
      style={{
        display:       'flex',
        height:        '100vh',
        width:         '100vw',
        overflow:      'hidden',
        background:    '#0d1117',
      }}
    >
      {/* Panel izquierdo — Controles */}
      <PanelControles
        vertices={vertices}
        aristas={aristas}
        modoArista={modoArista}
        onAgregarVertice={agregarVertice}
        onEliminarVertice={eliminarVertice}
        onRenombrarVertice={renombrarVertice}
        onIniciarArista={handleIniciarArista}
        onCancelarArista={handleCancelarArista}
        onEliminarArista={eliminarArista}
        onReiniciar={reiniciarGrafo}
      />

      {/* Área central: Canvas con chips flotantes */}
      <main
        id="grafo-canvas-area"
        style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
      >
        {/* Barra superior con chips flotantes */}
        <TopBar
          vertices={vertices}
          aristas={aristas}
          verticeSeleccionado={verticeSeleccionadoValido}
        />

        {/* Canvas Cytoscape */}
        <GrafoCanvas
          vertices={vertices}
          aristas={aristas}
          onMoverVertice={moverVertice}
          onEliminarVertice={eliminarVertice}
          onEliminarArista={eliminarArista}
          modoArista={modoArista}
          aristaSource={aristaSource}
          onSeleccionarNodo={handleSeleccionarNodo}
          onNodoSeleccionado={handleNodoSeleccionado}
        />
      </main>

      {/* Panel derecho — Análisis */}
      <PanelInfo
        vertices={vertices}
        aristas={aristas}
        verticeSeleccionado={verticeSeleccionadoValido}
      />
    </div>
  );
}
