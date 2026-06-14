import { useState } from "react";
import "../styles/PanelControles.css";

/* ── Sub-componente: Botón de acción ─────────────────────── */
function ActionButton({
  id,
  onClick,
  children,
  variant = "primary",
  disabled = false,
  title,
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`action-btn action-btn--${variant}`}
    >
      {children}
    </button>
  );
}

/* ── Sub-componente: Sección del panel ───────────────────── */
function PanelSection({ title, icon, children }) {
  return (
    <div className="panel-section">
      <div className="panel-section__header">
        <span className="panel-section__icon">{icon}</span>
        <span className="panel-section__title">{title}</span>
      </div>
      <div className="panel-section__body">{children}</div>
    </div>
  );
}

/**
 * @param {Object}   props
 * @param {string}   props.modoVertice
 * @param {Function} props.onIniciarVertice
 * @param {Function} props.onCancelarVertice
 * @param {Function} props.onEliminarVertice
 * @param {Function} props.onRenombrarVertice
 * @param {Function} props.onIniciarArista     - Inicia modo de creación de arista
 * @param {Function} props.onCancelarArista    - Cancela modo de creación de arista
 * @param {Function} props.onEliminarArista
 * @param {Function} props.onReiniciar
 * @param {Array}    props.vertices
 * @param {Array}    props.aristas
 * @param {string}   props.modoArista
 */
export default function PanelControles({
  modoVertice,
  onIniciarVertice,
  onCancelarVertice,
  modoEliminarVertice,
  onIniciarEliminarVertice,
  onCancelarEliminarVertice,
  onRenombrarVertice,
  onIniciarArista,
  onCancelarArista,
  onEliminarArista,
  onReiniciar,
  vertices,
  aristas,
  modoArista,
}) {
  const [verticeRenNuevo, setVerticeRenNuevo] = useState("");
  const [verticeRenViejo, setVerticeRenViejo] = useState("");
  const [aristaEliminar, setAristaEliminar] = useState("");

  /* ── Handlers ──────────────────────────────────────── */
  const handleRenombrar = () => {
    if (!verticeRenViejo || !verticeRenNuevo.trim()) return;
    onRenombrarVertice(verticeRenViejo, verticeRenNuevo.trim());
    setVerticeRenNuevo("");
    setVerticeRenViejo("");
  };

  const handleEliminarArista = () => {
    if (!aristaEliminar) return;
    onEliminarArista(aristaEliminar);
    setAristaEliminar("");
  };

  return (
    <aside id="panel-controles" className="panel-controles">
      {/* Logo / Título */}
      <div className="panel-controles__header">
        <div className="panel-controles__logo">🕸️</div>
        <div className="panel-controles__title">Generador de Grafos</div>
      </div>

      {/* ── VÉRTICES ──────────────────── */}
      <PanelSection title="Vértices" icon="⬤">
        {/* Agregar Vértice */}
        {modoVertice === "none" ? (
          <ActionButton
            id="btn-agregar-vertice"
            onClick={onIniciarVertice}
            variant="primary"
            disabled={modoEliminarVertice !== "none"}
          >
            ＋ Agregar Vértice
          </ActionButton>
        ) : (
          <ActionButton
            id="btn-cancelar-vertice"
            onClick={onCancelarVertice}
            variant="ghost"
          >
            ✕ Cancelar Vértice
          </ActionButton>
        )}

        {/* Eliminar Vértice */}
        {modoEliminarVertice === "none" ? (
          <ActionButton
            id="btn-iniciar-eliminar-vertice"
            onClick={onIniciarEliminarVertice}
            variant="danger"
            disabled={modoVertice !== "none" || vertices.length === 0}
            title={vertices.length === 0 ? "No hay vértices para eliminar" : ""}
          >
            🗑️ Eliminar Vértice
          </ActionButton>
        ) : (
          <ActionButton
            id="btn-cancelar-eliminar-vertice"
            onClick={onCancelarEliminarVertice}
            variant="ghost"
          >
            ✕ Cancelar
          </ActionButton>
        )}

        {/* Renombrar vértice */}
        <div className="panel-field">
          <label className="panel-label" htmlFor="sel-renombrar-vertice">
            Renombrar vértice
          </label>
          <select
            id="sel-renombrar-vertice"
            className="panel-select"
            value={verticeRenViejo}
            onChange={(e) => setVerticeRenViejo(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {vertices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
          <input
            id="input-nuevo-nombre"
            className="panel-input"
            type="text"
            placeholder="Nuevo nombre..."
            maxLength={4}
            value={verticeRenNuevo}
            onChange={(e) => setVerticeRenNuevo(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleRenombrar()}
          />
          <ActionButton
            id="btn-renombrar-vertice"
            onClick={handleRenombrar}
            variant="warning"
            disabled={!verticeRenViejo || !verticeRenNuevo.trim()}
          >
            ✏️ Renombrar
          </ActionButton>
        </div>
      </PanelSection>

      {/* ── ARISTAS ───────────────────── */}
      <PanelSection title="Aristas" icon="—">
        {modoArista === "none" ? (
          <ActionButton
            id="btn-agregar-arista"
            onClick={onIniciarArista}
            variant="success"
            disabled={vertices.length < 2}
            title={vertices.length < 2 ? "Necesitas al menos 2 vértices" : ""}
          >
            ＋ Agregar Arista
          </ActionButton>
        ) : (
          <ActionButton
            id="btn-cancelar-arista"
            onClick={onCancelarArista}
            variant="ghost"
          >
            ✕ Cancelar
          </ActionButton>
        )}

        {/* Eliminar arista */}
        <div className="panel-field">
          <label className="panel-label" htmlFor="sel-eliminar-arista">
            Eliminar arista
          </label>
          <select
            id="sel-eliminar-arista"
            className="panel-select"
            value={aristaEliminar}
            onChange={(e) => setAristaEliminar(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {aristas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.source} — {a.target}
              </option>
            ))}
          </select>
          <ActionButton
            id="btn-eliminar-arista"
            onClick={handleEliminarArista}
            variant="danger"
            disabled={!aristaEliminar}
          >
            🗑 Eliminar
          </ActionButton>
        </div>
      </PanelSection>

      {/* ── GRAFO ─────────────────────── */}
      <PanelSection title="Grafo" icon="⚙">
        <ActionButton
          id="btn-reiniciar-grafo"
          onClick={onReiniciar}
          variant="ghost"
        >
          🔄 Reiniciar Grafo
        </ActionButton>
      </PanelSection>

      {/* Tip */}
      <div className="panel-controles__tip">
        Doble click en el canvas para eliminar elementos
      </div>
    </aside>
  );
}
