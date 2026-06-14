/**
 * components/ModalConfirmacionArista.jsx
 * Modal personalizado para elegir el tipo de arista (dirigida o no dirigida).
 * Cuenta con un diseño premium de glassmorphism y transiciones suaves.
 */

import { useState } from 'react';

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
    <div
      style={{
        position:       'fixed',
        inset:          0,
        background:     'rgba(13, 17, 23, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex:         1000,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '16px',
        animation:      'fadeIn 0.25s ease-out',
      }}
    >
      {/* Estilos para animaciones sencillas de entrada */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Tarjeta del Modal */}
      <div
        style={{
          background:     '#161b22',
          border:         '1px solid #30363d',
          borderRadius:   '12px',
          padding:        '24px',
          width:          '100%',
          maxWidth:       '380px',
          boxShadow:      '0 8px 32px rgba(0, 0, 0, 0.5)',
          animation:      'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display:        'flex',
          flexDirection:  'column',
          gap:            '16px',
        }}
      >
        {/* Cabecera */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🔗</span>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#e6edf3' }}>
            Nueva Conexión
          </span>
        </div>

        {/* Descripción de la conexión */}
        <div style={{ fontSize: '13px', color: '#8b949e', lineHeight: '1.6' }}>
          Selecciona el tipo de arista para conectar el vértice{' '}
          <strong style={{ color: '#58a6ff', fontFamily: 'monospace' }}>{source}</strong>{' '}
          con el vértice{' '}
          <strong style={{ color: '#bc8cff', fontFamily: 'monospace' }}>{target}</strong>.
        </div>

        {/* Opción de Recordar Elección */}
        <label
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
            cursor:     'pointer',
            userSelect: 'none',
            fontSize:   '12px',
            color:      '#8b949e',
            marginTop:  '4px',
          }}
        >
          <input
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
            style={{
              cursor:      'pointer',
              accentColor: '#58a6ff',
            }}
          />
          Recordar elección para las siguientes aristas
        </label>

        {/* Botones de Selección */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Opción Dirigida */}
          <button
            onClick={() => onSelectType(true, rememberChoice)}
            style={{
              padding:        '12px',
              borderRadius:   '8px',
              border:         '1px solid rgba(88, 166, 255, 0.3)',
              background:     'linear-gradient(135deg, #1f6feb, #388bfd)',
              color:          '#fff',
              fontSize:       '13px',
              fontWeight:     '600',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '8px',
              transition:     'transform 0.15s ease, filter 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
          >
            <span>➡️</span> Arista Dirigida (Con Flecha)
          </button>

          {/* Opción No Dirigida */}
          <button
            onClick={() => onSelectType(false, rememberChoice)}
            style={{
              padding:        '12px',
              borderRadius:   '8px',
              border:         '1px solid #30363d',
              background:     '#21262d',
              color:          '#e6edf3',
              fontSize:       '13px',
              fontWeight:     '600',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '8px',
              transition:     'background 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#2a3441'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#21262d'; }}
          >
            <span>➖</span> Arista No Dirigida
          </button>
        </div>

        {/* Botón de Cancelar */}
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border:     'none',
            color:      '#8b949e',
            fontSize:   '12px',
            cursor:     'pointer',
            textAlign:  'center',
            padding:    '4px 0',
            textDecoration: 'underline',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ff7b72'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#8b949e'; }}
        >
          Cancelar conexión
        </button>
      </div>
    </div>
  );
}
