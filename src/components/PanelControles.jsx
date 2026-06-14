/**
 * components/PanelControles.jsx
 * Panel izquierdo con herramientas para manipular el grafo.
 */

import { useState } from "react";

/* ── Sub-componente: Botón de acción ─────────────────────── */
function ActionButton({
  id,
  onClick,
  children,
  variant = "primary",
  disabled = false,
  title,
}) {
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #1f6feb, #388bfd)",
      color: "#fff",
      border: "1px solid rgba(88,166,255,0.3)",
      hoverBg: "linear-gradient(135deg, #388bfd, #58a6ff)",
    },
    success: {
      background: "linear-gradient(135deg, #1a7f37, #2ea043)",
      color: "#fff",
      border: "1px solid rgba(63,185,80,0.3)",
      hoverBg: "linear-gradient(135deg, #2ea043, #3fb950)",
    },
    warning: {
      background: "linear-gradient(135deg, #9e4c00, #d18616)",
      color: "#fff",
      border: "1px solid rgba(240,136,62,0.3)",
      hoverBg: "linear-gradient(135deg, #d18616, #f0883e)",
    },
    danger: {
      background: "linear-gradient(135deg, #7d1a1a, #b91c1c)",
      color: "#fff",
      border: "1px solid rgba(248,81,73,0.3)",
      hoverBg: "linear-gradient(135deg, #b91c1c, #f85149)",
    },
    ghost: {
      background: "transparent",
      color: "#8b949e",
      border: "1px solid #30363d",
      hoverBg: "#21262d",
    },
  };

  const v = variants[variant];

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: v.background,
        color: v.color,
        border: v.border,
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px",
        fontWeight: "500",
        fontFamily: "Inter, sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.15s ease",
        lineHeight: "1.4",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = v.hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = v.background;
      }}
    >
      {children}
    </button>
  );
}

/* ── Sub-componente: Sección del panel ───────────────────── */
function PanelSection({ title, icon, children }) {
  return (
    <div
      style={{
        background: "#1c2333",
        border: "1px solid #30363d",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid #30363d",
          background: "#21262d",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "14px" }}>{icon}</span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#8b949e",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {children}
      </div>
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

  const inputStyle = {
    background: "#0d1117",
    border: "1px solid #30363d",
    borderRadius: "6px",
    color: "#e6edf3",
    padding: "7px 10px",
    fontSize: "13px",
    fontFamily: "Inter, sans-serif",
    width: "100%",
    outline: "none",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b949e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    paddingRight: "30px",
  };

  const labelStyle = {
    fontSize: "11px",
    color: "#8b949e",
    fontWeight: "500",
    marginBottom: "4px",
    display: "block",
  };

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
    <aside
      id="panel-controles"
      style={{
        width: "220px",
        minWidth: "220px",
        height: "100%",
        overflowY: "auto",
        background: "#161b22",
        borderRight: "1px solid #30363d",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "14px 10px",
      }}
    >
      {/* Logo / Título */}
      <div
        style={{
          textAlign: "center",
          padding: "4px 0 10px",
          borderBottom: "1px solid #30363d",
        }}
      >
        <div style={{ fontSize: "20px", marginBottom: "2px" }}>🕸️</div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#58a6ff",
            letterSpacing: "-0.01em",
          }}
        >
          Generador de Grafos
        </div>
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
        <div>
          <label style={labelStyle} htmlFor="sel-renombrar-vertice">
            Renombrar vértice
          </label>
          <select
            id="sel-renombrar-vertice"
            style={{ ...selectStyle, marginBottom: "6px" }}
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
            style={{ ...inputStyle, marginBottom: "6px" }}
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
        <div>
          <label style={labelStyle} htmlFor="sel-eliminar-arista">
            Eliminar arista
          </label>
          <select
            id="sel-eliminar-arista"
            style={selectStyle}
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
      <div
        style={{
          fontSize: "11px",
          color: "#484f58",
          textAlign: "center",
          marginTop: "auto",
          paddingTop: "8px",
          lineHeight: "1.5",
        }}
      >
        Doble click en el canvas para eliminar elementos
      </div>
    </aside>
  );
}
