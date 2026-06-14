/**
 * components/GraphRandomGenerator.jsx
 * Panel de generación de grafos aleatorios con diseño de herramienta técnica.
 * Estilado íntegramente con CSS inline de React para evitar dependencias
 * de compilación o configuración de Tailwind CSS.
 */

import { useState, useEffect } from "react";

/**
 * @param {Object} props
 * @param {number} props.numGenVertices
 * @param {Function} props.setNumGenVertices
 * @param {number} props.numGenAristas
 * @param {Function} props.setNumGenAristas
 * @param {Function} props.handleGenerarGrafoAleatorio - Callback para invocar el algoritmo de generación
 */
export default function GraphRandomGenerator({
  numGenVertices,
  setNumGenVertices,
  numGenAristas,
  setNumGenAristas,
  handleGenerarGrafoAleatorio,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [esDirigido, setEsDirigido] = useState(false);

  // Calcular matemáticamente el número máximo posible de aristas
  const maxAristasPosibles = esDirigido
    ? numGenVertices * (numGenVertices - 1)
    : (numGenVertices * (numGenVertices - 1)) / 2;

  // Ajustar el número de aristas seleccionadas si supera el límite posible al variar vértices o modo
  useEffect(() => {
    if (numGenAristas > maxAristasPosibles) {
      setNumGenAristas(maxAristasPosibles);
    }
  }, [
    numGenVertices,
    esDirigido,
    maxAristasPosibles,
    numGenAristas,
    setNumGenAristas,
  ]);

  /* ── Estilos Inline CSS ───────────────────────────────── */
  const triggerButtonStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    zIndex: 20,
    padding: "6px 14px",
    backgroundColor: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "6px",
    color: "#8b949e",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    transition: "all 0.15s ease",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const containerStyle = {
    position: "absolute",
    top: "16px",
    right: "16px",
    zIndex: 20,
    width: "300px",
    backgroundColor: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderBottom: "1px solid #30363d",
    paddingBottom: "10px",
  };

  const titleStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#e6edf3",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: "10px",
    color: "#8b949e",
    marginTop: "2px",
    display: "block",
  };

  const closeButtonStyle = {
    width: "20px",
    height: "20px",
    background: "none",
    border: "none",
    color: "#8b949e",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    fontSize: "10px",
    transition: "all 0.15s ease",
    padding: 0,
  };

  const sectionLabelStyle = {
    fontSize: "10px",
    color: "#8b949e",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "6px",
    display: "block",
    userSelect: "none",
  };

  const segmentContainerStyle = {
    display: "flex",
    border: "1px solid #30363d",
    borderRadius: "6px",
    overflow: "hidden",
    backgroundColor: "#0d1117",
  };

  const getSegmentStyle = (active) => ({
    flex: 1,
    padding: "6px 0",
    fontSize: "11px",
    fontWeight: active ? "700" : "600",
    backgroundColor: active ? "#21262d" : "transparent",
    color: active ? "#ffffff" : "#8b949e",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
    transition: "color 0.15s ease",
  });

  const pickerContainerStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #30363d",
    borderRadius: "6px",
    backgroundColor: "#0d1117",
    overflow: "hidden",
  };

  const pickerButtonStyle = {
    padding: "4px 12px",
    background: "none",
    border: "none",
    color: "#8b949e",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    outline: "none",
  };

  const pickerValueStyle = {
    padding: "0 12px",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
    fontWeight: "700",
    color: "#e6edf3",
    minWidth: "32px",
    textAlign: "center",
    userSelect: "none",
  };

  const actionButtonStyle = {
    width: "100%",
    padding: "10px 0",
    backgroundColor: "#1f6feb",
    border: "1px solid #388bfd",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
    textAlign: "center",
    marginTop: "6px",
    fontFamily: "Inter, system-ui, sans-serif",
  };

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        style={triggerButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ffffff";
          e.currentTarget.style.borderColor = "#8b949e";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#8b949e";
          e.currentTarget.style.borderColor = "#30363d";
        }}
        title="Configurar y generar un grafo aleatorio"
      >
        <span>🎲</span> Generador Aleatorio
      </button>
    );
  }

  return (
    <div id="random-generator-overlay" style={containerStyle}>
      {/* Cabecera */}
      <div style={headerStyle}>
        <div>
          <h3 style={titleStyle}>🎲 Generar Grafo</h3>
          <span style={subtitleStyle}>
            Configura los parámetros del nuevo grafo
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#8b949e";
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {/* Selector de Tipo (Dirigido / No Dirigido) */}
        <div>
          <span style={sectionLabelStyle}>Tipo de Conexión</span>
          <div style={segmentContainerStyle}>
            <button
              onClick={() => setEsDirigido(false)}
              style={getSegmentStyle(!esDirigido)}
              onMouseEnter={(e) => {
                if (esDirigido) e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                if (esDirigido) e.currentTarget.style.color = "#8b949e";
              }}
            >
              No Dirigido
            </button>
            <button
              onClick={() => setEsDirigido(true)}
              style={getSegmentStyle(esDirigido)}
              onMouseEnter={(e) => {
                if (!esDirigido) e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                if (!esDirigido) e.currentTarget.style.color = "#8b949e";
              }}
            >
              Dirigido
            </button>
          </div>
        </div>

        {/* Control Vértices */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={sectionLabelStyle}>Vértices</span>
          <div style={pickerContainerStyle}>
            <button
              onClick={() => setNumGenVertices((prev) => Math.max(1, prev - 1))}
              style={pickerButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#8b949e";
              }}
            >
              -
            </button>
            <span style={pickerValueStyle}>{numGenVertices}</span>
            <button
              onClick={() =>
                setNumGenVertices((prev) => Math.min(30, prev + 1))
              }
              style={pickerButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#8b949e";
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Control Aristas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={sectionLabelStyle}>Aristas</span>
            <div style={pickerContainerStyle}>
              <button
                onClick={() =>
                  setNumGenAristas((prev) => Math.max(0, prev - 1))
                }
                style={pickerButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#8b949e";
                }}
              >
                -
              </button>
              <span style={pickerValueStyle}>{numGenAristas}</span>
              <button
                onClick={() =>
                  setNumGenAristas((prev) =>
                    Math.min(maxAristasPosibles, prev + 1),
                  )
                }
                style={pickerButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#8b949e";
                }}
                disabled={numGenAristas >= maxAristasPosibles}
              >
                +
              </button>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              userSelect: "none",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                color: "#484f58",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Máximo para este grafo: {maxAristasPosibles}
            </span>
          </div>
        </div>

        {/* Botón Acción */}
        <button
          onClick={() => {
            handleGenerarGrafoAleatorio(
              numGenVertices,
              numGenAristas,
              esDirigido,
            );
            setIsCollapsed(true);
          }}
          style={actionButtonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#388bfd";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#1f6feb";
          }}
        >
          Generar Grafo
        </button>
      </div>
    </div>
  );
}
