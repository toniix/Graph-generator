/**
 * components/GrafoCanvas.jsx
 * Canvas principal que renderiza el grafo con Cytoscape.js.
 * Gestiona la sincronización bidireccional entre el estado React y Cytoscape.
 */

import { useEffect, useRef, useCallback } from "react";
import cytoscape from "cytoscape";

/* ── Paleta de colores del tema ─────────────────────────────── */
const COLORS = {
  nodeBg: "#1c2333",
  nodeBorder: "#58a6ff",
  nodeSelected: "#bc8cff",
  nodeHover: "#388bfd",
  nodeLabel: "#e6edf3",
  edgeColor: "#444c56",
  edgeSelected: "#f0883e",
  bgCanvas: "#0d1117",
};

/* ── Estilos de Cytoscape ───────────────────────────────────── */
const cytoscapeStyle = [
  {
    selector: "node",
    style: {
      "background-color": COLORS.nodeBg,
      "border-color": "data(color)",
      "border-width": 2.5,
      label: "data(label)",
      color: COLORS.nodeLabel,
      "font-family": "Inter, sans-serif",
      "font-size": "14px",
      "font-weight": "600",
      "text-valign": "center",
      "text-halign": "center",
      width: 44,
      height: 44,
      "shadow-blur": 12,
      "shadow-color": "data(color)",
      "shadow-opacity": 0.4,
      "shadow-offset-x": 0,
      "shadow-offset-y": 0,
      "transition-property": "background-color, border-color, shadow-blur",
      "transition-duration": "0.15s",
    },
  },
  {
    selector: "node:selected",
    style: {
      "background-color": "#2a3441",
      "border-color": COLORS.nodeSelected,
      "border-width": 3,
      "shadow-color": COLORS.nodeSelected,
      "shadow-opacity": 0.6,
      "shadow-blur": 20,
    },
  },
  {
    selector: "node:active",
    style: {
      "overlay-opacity": 0,
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "line-color": "data(color)",
      "curve-style": "bezier",
      "line-cap": "round",
      opacity: 0.8,
      "transition-property": "line-color, width, opacity",
      "transition-duration": "0.15s",
    },
  },
  {
    selector: "edge:selected",
    style: {
      "line-color": COLORS.edgeSelected,
      width: 3,
      opacity: 1,
    },
  },
  {
    selector: "edge[?directed]",
    style: {
      "target-arrow-shape": "triangle",
      "target-arrow-color": "data(color)",
      "arrow-scale": 1.2,
    },
  },
  {
    selector: "edge[?directed]:selected",
    style: {
      "target-arrow-color": COLORS.edgeSelected,
    },
  },
  {
    selector: 'node.deleting-mode',
    style: {
      'border-color': '#ff7b72',
      'shadow-color': '#ff7b72',
      'shadow-opacity': 0.6,
    },
  },
  {
    selector: ".highlighted",
    style: {
      "border-color": "#3fb950",
      "shadow-color": "#3fb950",
      "shadow-opacity": 0.5,
    },
  },
];

/**
 * @param {Object} props
 * @param {Array}    props.vertices              - Lista de vértices
 * @param {Array}    props.aristas               - Lista de aristas
 * @param {Function} props.onMoverVertice        - Callback al arrastrar vértice
 * @param {Function} props.onEliminarVertice
 * @param {Function} props.onEliminarArista
 * @param {string}   props.modoArista            - 'none' | 'selecting-source' | 'selecting-target'
 * @param {string|null} props.aristaSource       - ID del vértice fuente seleccionado
 * @param {Function} props.onSeleccionarNodo     - Callback al click en nodo (modo arista)
 * @param {Function} props.onNodoSeleccionado    - Callback de selección general (siempre dispara)
 */
export default function GrafoCanvas({
  vertices,
  aristas,
  onMoverVertice,
  onEliminarVertice,
  onEliminarArista,
  modoArista,
  modoVertice,
  modoEliminarVertice,
  onAgregarVerticeCanvas,
  aristaSource,
  onSeleccionarNodo,
  onNodoSeleccionado,
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const isInternalDrag = useRef(false);

  /* ── Inicializar Cytoscape una sola vez ─────────────────────── */
  useEffect(() => {
    if (!containerRef.current || cyRef.current) return;

    cyRef.current = cytoscape({
      container: containerRef.current,
      style: cytoscapeStyle,
      elements: [],
      layout: { name: "preset" },
      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false,
      minZoom: 0.3,
      maxZoom: 3,
    });

    const cy = cyRef.current;

    /* Evento: arrastrar nodo → actualizar estado React */
    cy.on("dragfree", "node", (evt) => {
      isInternalDrag.current = true;
      const node = evt.target;
      const pos = node.position();
      onMoverVertice(node.id(), pos.x, pos.y);
      setTimeout(() => {
        isInternalDrag.current = false;
      }, 50);
    });

    /* Evento: doble click en nodo → eliminar vértice */
    cy.on("dblclick", "node", (evt) => {
      evt.preventDefault();
      onEliminarVertice(evt.target.id());
    });

    /* Evento: doble click en arista → eliminar arista */
    cy.on("dblclick", "edge", (evt) => {
      evt.preventDefault();
      onEliminarArista(evt.target.id());
    });

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Handler de tap en nodo: selección general + modo arista ── */
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const handlerNodo = (evt) => {
      const nodeId = evt.target.id();
      // Si estamos en modo de eliminar, eliminamos el vértice de inmediato
      if (modoEliminarVertice === 'deleting') {
        onEliminarVertice?.(nodeId);
        return;
      }
      // Siempre notificar selección para el TopBar (si no estamos en modo añadir)
      if (modoVertice !== "adding") {
        onNodoSeleccionado?.(nodeId);
      }
      // Solo en modo arista disparar la lógica de creación
      if (modoArista !== "none") {
        onSeleccionarNodo(nodeId);
      }
    };

    // Deseleccionar al hacer click en fondo del canvas, o agregar vértice en modo añadir
    const handlerFondo = (evt) => {
      if (evt.target === cy) {
        if (modoVertice === "adding") {
          const pos = evt.position;
          if (pos) {
            onAgregarVerticeCanvas?.(pos.x, pos.y);
          }
        } else {
          onNodoSeleccionado?.(null);
        }
      }
    };

    cy.on("tap", "node", handlerNodo);
    cy.on("tap", handlerFondo);
    return () => {
      cy.off("tap", "node", handlerNodo);
      cy.off("tap", handlerFondo);
    };
  }, [
    modoArista,
    modoVertice,
    modoEliminarVertice,
    onSeleccionarNodo,
    onNodoSeleccionado,
    onAgregarVerticeCanvas,
    onEliminarVertice,
  ]);

  /* ── Actualizar cursor según modo ───────────────────────────── */
  useEffect(() => {
    if (!containerRef.current) return;
    if (modoEliminarVertice === 'deleting') {
      containerRef.current.style.cursor = 'pointer';
    } else if (modoVertice === "adding") {
      containerRef.current.style.cursor = "cell";
    } else if (modoArista !== "none") {
      containerRef.current.style.cursor = "crosshair";
    } else {
      containerRef.current.style.cursor = "default";
    }
  }, [modoArista, modoVertice, modoEliminarVertice]);

  /* ── Resaltar vértice fuente seleccionado ───────────────────── */
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.nodes().removeClass("highlighted");
    if (aristaSource) {
      cy.getElementById(aristaSource).addClass("highlighted");
    }
  }, [aristaSource]);

  /* ── Sincronizar clase para modo eliminar ────────────────────── */
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    if (modoEliminarVertice === 'deleting') {
      cy.nodes().addClass('deleting-mode');
    } else {
      cy.nodes().removeClass('deleting-mode');
    }
  }, [modoEliminarVertice, vertices]);

  /* ── Sincronizar elementos: vértices y aristas ──────────────── */
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy || isInternalDrag.current) return;

    /* — Nodos — */
    const verticesIds = new Set(vertices.map((v) => v.id));
    const cytoscapeNodes = cy.nodes();

    // Eliminar nodos que ya no existen
    cytoscapeNodes.forEach((node) => {
      if (!verticesIds.has(node.id())) node.remove();
    });

    // Agregar o actualizar nodos existentes
    vertices.forEach((v) => {
      const existente = cy.getElementById(v.id);
      if (existente.length === 0) {
        // Nodo nuevo
        cy.add({
          group: "nodes",
          data: { id: v.id, label: v.label, color: v.color },
          position: { x: v.x, y: v.y },
        });
      } else {
        // Actualizar label si cambió
        if (existente.data("label") !== v.label) {
          existente.data("label", v.label);
        }
        // Actualizar color si cambió
        if (existente.data("color") !== v.color) {
          existente.data("color", v.color);
        }
      }
    });

    /* — Aristas — */
    const aristasIds = new Set(aristas.map((a) => a.id));
    const cytoscapeEdges = cy.edges();

    // Eliminar aristas que ya no existen
    cytoscapeEdges.forEach((edge) => {
      if (!aristasIds.has(edge.id())) edge.remove();
    });

    // Agregar aristas nuevas
    aristas.forEach((a) => {
      const existente = cy.getElementById(a.id);
      if (existente.length === 0) {
        cy.add({
          group: "edges",
          data: {
            id: a.id,
            source: a.source,
            target: a.target,
            color: a.color,
            directed: a.directed,
          },
        });
      } else {
        // Actualizar color si cambió
        if (existente.data("color") !== a.color) {
          existente.data("color", a.color);
        }
        // Actualizar directed si cambió
        if (existente.data("directed") !== a.directed) {
          existente.data("directed", a.directed);
        }
      }
    });
  }, [vertices, aristas]);

  return (
    <div className="relative w-full h-full">
      {/* Canvas Cytoscape */}
      <div
        ref={containerRef}
        id="cytoscape-canvas"
        className="w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #161b22 0%, #0d1117 100%)",
        }}
      />

      {/* Indicador de modo vértice */}
      {modoVertice === "adding" && (
        <div
          className="absolute top-4 left-4 px-4 py-3 rounded-md text-sm font-medium pointer-events-none flex flex-col items-start shadow-lg"
          style={{
            background: "rgba(56,139,253,0.15)",
            border: "1px solid rgba(56,139,253,0.4)",
            color: "#58a6ff",
            backdropFilter: "blur(8px)",
            zIndex: 10,
          }}
        >
          <span className="font-semibold">➕ Modo Añadir Vértice</span>
          <span className="text-xs opacity-80 mt-1">
            Haz click en el canvas para colocar (Esc para salir)
          </span>
        </div>
      )}

      {/* Indicador de modo eliminar vértice */}
      {modoEliminarVertice === 'deleting' && (
        <div
          className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium pointer-events-none"
          style={{
            background: 'rgba(248,81,73,0.15)',
            border:     '1px solid rgba(248,81,73,0.4)',
            color:      '#ff7b72',
            backdropFilter: 'blur(8px)',
            zIndex:     10,
          }}
        >
          🗑️ Modo Eliminar Vértice: Haz click en un vértice para eliminarlo (Esc para salir)
        </div>
      )}

      {/* Indicador de modo arista */}
      {modoArista !== "none" && (
        <div
          className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium pointer-events-none"
          style={{
            background: "rgba(88,166,255,0.15)",
            border: "1px solid rgba(88,166,255,0.4)",
            color: "#58a6ff",
            backdropFilter: "blur(8px)",
            zIndex: 10,
          }}
        >
          {modoArista === "selecting-source"
            ? "🔵 Haz click en el vértice de origen (Esc para salir)"
            : `🟢 Origen: ${aristaSource} — Haz click en el vértice destino (Esc para salir)`}
        </div>
      )}

      {/* Leyenda de atajos */}
      <div
        className="absolute bottom-4 right-4 text-xs space-y-1 pointer-events-none"
        style={{ color: "rgba(139,148,158,0.7)" }}
      >
        <div>🖱️ Arrastrar — mover vértice</div>
        <div>✌️ Doble click — eliminar elemento</div>
        <div>🔍 Scroll — zoom</div>
      </div>
    </div>
  );
}
