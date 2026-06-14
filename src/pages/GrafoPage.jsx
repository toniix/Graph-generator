import { useState, useCallback, useMemo, useEffect } from "react";
import { useGrafo } from "../hooks/useGrafo";
import GrafoCanvas from "../components/GrafoCanvas";
import PanelControles from "../components/PanelControles";
import PanelInfo from "../components/PanelInfo";
import TopBar from "../components/TopBar";
import ModalConfirmacionArista from "../components/ModalConfirmacionArista";
import {
  findConnectedComponents,
  generateRandomGraph,
} from "../utils/graphAlgorithms";
import GraphRandomGenerator from "../components/GraphRandomGenerator";
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
    cargarGrafo,
  } = useGrafo();

  /* Estado del flujo de creación de arista */
  const [modoArista, setModoArista] = useState("none");
  const [aristaSource, setAristaSource] = useState(null);

  /* Estado del modo agregar vértice */
  const [modoVertice, setModoVertice] = useState("none"); // 'none' | 'adding'

  /* Estado para el modal de confirmación de arista (pendiente de selección de tipo) */
  const [pendingEdge, setPendingEdge] = useState(null); // { source, target }

  /* Estado para recordar la elección del tipo de arista */
  const [rememberedType, setRememberedType] = useState(null); // null | 'directed' | 'undirected'

  /* Estado para la generación aleatoria de grafos */
  const [numGenVertices, setNumGenVertices] = useState(6);
  const [numGenAristas, setNumGenAristas] = useState(7);

  /* Estado del modo eliminar vértice */
  const [modoEliminarVertice, setModoEliminarVertice] = useState('none'); // 'none' | 'deleting'

  /* Estado de vértice seleccionado en el canvas */
  const [verticeSeleccionado, setVerticeSeleccionado] = useState(null);

  /* ── Paleta de colores para las componentes conexas ── */
  const COMPONENT_COLORS = useMemo(
    () => [
      "#58a6ff", // Azul
      "#3fb950", // Verde
      "#f0883e", // Naranja/Ámbar
      "#bc8cff", // Morado
      "#39c5cf", // Turquesa/Cian
      "#d29922", // Amarillo/Oro
      "#db61a2", // Magenta/Rosa
      "#ff7b72", // Coral/Rojo
    ],
    [],
  );

  /* ── Detección y coloreado de Componentes Conexas ── */
  const componentesConexas = useMemo(() => {
    return findConnectedComponents(vertices, aristas);
  }, [vertices, aristas]);

  const { mappingColoresNodos, mappingColoresAristas, componentesConColores } =
    useMemo(() => {
      const nodeColorMap = {};
      const edgeColorMap = {};

      const comps = componentesConexas.map((comp, idx) => {
        const color = COMPONENT_COLORS[idx % COMPONENT_COLORS.length];
        comp.vertices.forEach((vId) => {
          nodeColorMap[vId] = color;
        });
        return {
          ...comp,
          color,
        };
      });

      aristas.forEach((edge) => {
        const color = nodeColorMap[edge.source] || "#444c56";
        edgeColorMap[edge.id] = color;
      });

      return {
        mappingColoresNodos: nodeColorMap,
        mappingColoresAristas: edgeColorMap,
        componentesConColores: comps,
      };
    }, [componentesConexas, aristas, COMPONENT_COLORS]);

  /* Enriquecer vértices y aristas con color antes de enviar al Canvas */
  const verticesConColor = useMemo(() => {
    return vertices.map((v) => ({
      ...v,
      color: mappingColoresNodos[v.id] || "#58a6ff",
    }));
  }, [vertices, mappingColoresNodos]);

  const aristasConColor = useMemo(() => {
    return aristas.map((a) => ({
      ...a,
      color: mappingColoresAristas[a.id] || "#444c56",
    }));
  }, [aristas, mappingColoresAristas]);

  /* ── Handlers de herramientas (arista, vértice, eliminar) ──── */

  const handleIniciarVertice = useCallback(() => {
    setModoVertice('adding');
    setModoArista('none');
    setAristaSource(null);
    setModoEliminarVertice('none');
  }, []);

  const handleCancelarVertice = useCallback(() => {
    setModoVertice('none');
  }, []);

  const handleIniciarArista = useCallback(() => {
    setModoArista('selecting-source');
    setAristaSource(null);
    setModoVertice('none');
    setModoEliminarVertice('none');
  }, []);

  const handleCancelarArista = useCallback(() => {
    setModoArista('none');
    setAristaSource(null);
    setRememberedType(null);
  }, []);

  const handleIniciarEliminarVertice = useCallback(() => {
    setModoEliminarVertice('deleting');
    setModoVertice('none');
    setModoArista('none');
    setAristaSource(null);
    setRememberedType(null);
  }, []);

  const handleCancelarEliminarVertice = useCallback(() => {
    setModoEliminarVertice('none');
  }, []);

  /**
   * Lógica de selección de nodo en modo creación de arista.
   * Primer click → nodo origen; Segundo click → nodo destino (crea arista).
   */
  const handleSeleccionarNodo = useCallback(
    (nodeId) => {
      if (modoArista === "selecting-source") {
        setAristaSource(nodeId);
        setModoArista("selecting-target");
      } else if (modoArista === "selecting-target") {
        if (nodeId !== aristaSource) {
          if (rememberedType !== null) {
            // Si hay una elección recordada, agregar de inmediato sin abrir modal
            agregarArista(aristaSource, nodeId, rememberedType === "directed");
            setModoArista("selecting-source");
            setAristaSource(null);
          } else {
            // Guardar arista pendiente para abrir el modal interactivo
            setPendingEdge({ source: aristaSource, target: nodeId });
          }
        } else {
          setModoArista("selecting-source");
          setAristaSource(null);
        }
      }
    },
    [modoArista, aristaSource, rememberedType, agregarArista],
  );

  /* Handler cuando el usuario elige el tipo de arista en el modal */
  const handleSelectEdgeType = useCallback(
    (esDirigida, recordar) => {
      if (pendingEdge) {
        agregarArista(pendingEdge.source, pendingEdge.target, esDirigida);
      }
      if (recordar) {
        setRememberedType(esDirigida ? "directed" : "undirected");
      }
      setPendingEdge(null);
      setModoArista("selecting-source");
      setAristaSource(null);
    },
    [pendingEdge, agregarArista],
  );

  /* Handler para cancelar el modal de confirmación */
  const handleCancelEdgeCreation = useCallback(() => {
    setPendingEdge(null);
    setRememberedType(null); // Limpiar tipo recordado al cancelar
    setModoArista("selecting-source");
    setAristaSource(null);
  }, []);

  /* Handler para generar un grafo aleatorio */
  const handleGenerarGrafoAleatorio = useCallback(
    (numVertices, numAristas, esDirigido = false) => {
      const { vertices: nuevosVertices, aristas: nuevasAristas } =
        generateRandomGraph(numVertices, numAristas, esDirigido);
      cargarGrafo(nuevosVertices, nuevasAristas);

      // Cancelar todos los estados activos e interactivos
      setModoVertice("none");
      setModoArista("none");
      setModoEliminarVertice("none");
      setAristaSource(null);
      setRememberedType(null);
      setVerticeSeleccionado(null);
    },
    [cargarGrafo],
  );

  /**
   * Callback general de selección de nodo (siempre dispara).
   * Limpia la selección si el vértice fue eliminado.
   */
  const handleNodoSeleccionado = useCallback((nodeId) => {
    // nodeId puede ser null (deselección al click en fondo)
    setVerticeSeleccionado(nodeId);
  }, []);

  // Limpiar selección si el vértice seleccionado fue eliminado
  const verticeSeleccionadoValido =
    verticeSeleccionado && vertices.some((v) => v.id === verticeSeleccionado)
      ? verticeSeleccionado
      : null;

  /* Escuchar la tecla Escape para cancelar modos activos */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (pendingEdge) {
          handleCancelEdgeCreation();
          return;
        }
        if (modoVertice !== 'none') {
          handleCancelarVertice();
        }
        if (modoArista !== 'none') {
          handleCancelarArista();
        }
        if (modoEliminarVertice !== 'none') {
          handleCancelarEliminarVertice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modoVertice, modoArista, modoEliminarVertice, pendingEdge, handleCancelarVertice, handleCancelarArista, handleCancelarEliminarVertice, handleCancelEdgeCreation]);

  return (
    <div
      id="grafo-page"
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#0d1117",
      }}
    >
      {/* Panel izquierdo — Controles */}
      <PanelControles
        vertices={vertices}
        aristas={aristas}
        modoArista={modoArista}
        modoVertice={modoVertice}
        onIniciarVertice={handleIniciarVertice}
        onCancelarVertice={handleCancelarVertice}
        modoEliminarVertice={modoEliminarVertice}
        onIniciarEliminarVertice={handleIniciarEliminarVertice}
        onCancelarEliminarVertice={handleCancelarEliminarVertice}
        onRenombrarVertice={renombrarVertice}
        onIniciarArista={handleIniciarArista}
        onCancelarArista={handleCancelarArista}
        onEliminarArista={eliminarArista}
        onReiniciar={reiniciarGrafo}
      />

      {/* Área central: Canvas con chips flotantes */}
      <main
        id="grafo-canvas-area"
        style={{ flex: 1, position: "relative", overflow: "hidden" }}
      >
        {/* Barra superior con chips flotantes (centro) */}
        <TopBar
          vertices={vertices}
          aristas={aristas}
          verticeSeleccionado={verticeSeleccionadoValido}
        />

        {/* Generador de grafo aleatorio (esquina superior derecha, estilo chips flotantes con Tailwind) */}
        <GraphRandomGenerator
          numGenVertices={numGenVertices}
          setNumGenVertices={setNumGenVertices}
          numGenAristas={numGenAristas}
          setNumGenAristas={setNumGenAristas}
          handleGenerarGrafoAleatorio={handleGenerarGrafoAleatorio}
        />

        {/* Canvas Cytoscape */}
        <GrafoCanvas
          vertices={verticesConColor}
          aristas={aristasConColor}
          onMoverVertice={moverVertice}
          onEliminarVertice={eliminarVertice}
          onEliminarArista={eliminarArista}
          modoArista={modoArista}
          modoVertice={modoVertice}
          modoEliminarVertice={modoEliminarVertice}
          onAgregarVerticeCanvas={agregarVertice}
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
        componentesConColores={componentesConColores}
      />

      {/* Modal de confirmación de tipo de arista */}
      <ModalConfirmacionArista
        isOpen={pendingEdge !== null}
        source={pendingEdge?.source || ""}
        target={pendingEdge?.target || ""}
        onSelectType={handleSelectEdgeType}
        onCancel={handleCancelEdgeCreation}
      />
    </div>
  );
}
