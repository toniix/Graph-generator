import { useState } from "react";
import "../styles/ModalConfirmacionArista.css";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {string} props.source
 * @param {string} props.target
 * @param {Function} props.onSelectType - Callback al seleccionar tipo (true: dirigida, false: no dirigida, remember: boolean)
 * @param {Function} props.onCancel - Callback para cancelar la creación de la arista
 */
export default function ModalConfirmacionArista({
  isOpen,
  source,
  target,
  onSelectType,
  onCancel,
}) {
  const [rememberChoice, setRememberChoice] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      {/* Tarjeta del Modal */}
      <div className="modal-card">
        {/* Cabecera */}
        <div className="modal-card__header">
          <span className="modal-card__header-icon">🔗</span>
          <span className="modal-card__header-title">Nueva Conexión</span>
        </div>

        {/* Descripción de la conexión */}
        <div className="modal-card__description">
          Selecciona el tipo de arista para conectar el vértice{" "}
          <strong className="modal-card__vertex--source">{source}</strong> con
          el vértice{" "}
          <strong className="modal-card__vertex--target">{target}</strong>.
        </div>

        {/* Opción de Recordar Elección */}
        <label className="modal-card__remember">
          <input
            type="checkbox"
            className="modal-card__checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
          />
          Recordar elección para las siguientes aristas
        </label>

        {/* Botones de Selección */}
        <div className="modal-card__options">
          {/* Opción Dirigida */}
          <button
            onClick={() => onSelectType(true, rememberChoice)}
            className="modal-btn--directed"
          >
            <span>➡️</span> Arista Dirigida (Con Flecha)
          </button>

          {/* Opción No Dirigida */}
          <button
            onClick={() => onSelectType(false, rememberChoice)}
            className="modal-btn--undirected"
          >
            <span>➖</span> Arista No Dirigida
          </button>
        </div>

        {/* Botón de Cancelar */}
        <button onClick={onCancel} className="modal-btn--cancel">
          Cancelar conexión
        </button>
      </div>
    </div>
  );
}
