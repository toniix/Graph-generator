import { useState, useEffect } from "react";
import "../styles/GraphRandomGenerator.css";

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

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="generator-trigger"
        title="Configurar y generar un grafo aleatorio"
      >
        <span>🎲</span> Generador Aleatorio
      </button>
    );
  }

  return (
    <div id="random-generator-overlay" className="generator-panel">
      {/* Cabecera */}
      <div className="generator-panel__header">
        <div>
          <h3 className="generator-panel__title">🎲 Generar Grafo</h3>
          <span className="generator-panel__subtitle">
            Configura los parámetros del nuevo grafo
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="generator-panel__close"
        >
          ✕
        </button>
      </div>

      <div className="generator-panel__body">
        {/* Selector de Tipo (Dirigido / No Dirigido) */}
        <div>
          <span className="generator-label">Tipo de Conexión</span>
          <div className="generator-segment">
            <button
              onClick={() => setEsDirigido(false)}
              className={`generator-segment__btn${!esDirigido ? " generator-segment__btn--active" : ""}`}
            >
              No Dirigido
            </button>
            <button
              onClick={() => setEsDirigido(true)}
              className={`generator-segment__btn${esDirigido ? " generator-segment__btn--active" : ""}`}
            >
              Dirigido
            </button>
          </div>
        </div>

        {/* Control Vértices */}
        <div className="generator-control-row">
          <span className="generator-label">Vértices</span>
          <div className="generator-picker">
            <button
              onClick={() => setNumGenVertices((prev) => Math.max(1, prev - 1))}
              className="generator-picker__btn"
            >
              −
            </button>
            <span className="generator-picker__value">{numGenVertices}</span>
            <button
              onClick={() =>
                setNumGenVertices((prev) => Math.min(30, prev + 1))
              }
              className="generator-picker__btn"
            >
              +
            </button>
          </div>
        </div>

        {/* Control Aristas */}
        <div>
          <div className="generator-control-row">
            <span className="generator-label">Aristas</span>
            <div className="generator-picker">
              <button
                onClick={() =>
                  setNumGenAristas((prev) => Math.max(0, prev - 1))
                }
                className="generator-picker__btn"
              >
                −
              </button>
              <span className="generator-picker__value">{numGenAristas}</span>
              <button
                onClick={() =>
                  setNumGenAristas((prev) =>
                    Math.min(maxAristasPosibles, prev + 1),
                  )
                }
                className="generator-picker__btn"
                disabled={numGenAristas >= maxAristasPosibles}
              >
                +
              </button>
            </div>
          </div>
          <div className="generator-max-hint">
            Máximo para este grafo: {maxAristasPosibles}
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
          className="generator-action-btn"
        >
          Generar Grafo
        </button>
      </div>
    </div>
  );
}
