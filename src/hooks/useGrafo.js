/**
 * hooks/useGrafo.js
 * Hook central que gestiona todo el estado del grafo.
 * Expone acciones inmutables para modificar vértices y aristas.
 */

import { useState, useCallback } from 'react';
import { initialVertices, initialAristas } from '../data/initialGraph';
import {
  generarIdArista,
  aristaExiste,
  generarEtiquetaVertice,
} from '../utils/grafoUtils';

/**
 * @returns {{
 *   vertices: Array,
 *   aristas: Array,
 *   agregarVertice: Function,
 *   eliminarVertice: Function,
 *   renombrarVertice: Function,
 *   moverVertice: Function,
 *   agregarArista: Function,
 *   eliminarArista: Function,
 *   reiniciarGrafo: Function,
 * }}
 */
export function useGrafo() {
  const [vertices, setVertices] = useState(initialVertices);
  const [aristas, setAristas]   = useState(initialAristas);

  /* ─── VÉRTICES ──────────────────────────────── */

  /**
   * Agrega un nuevo vértice con posición aleatoria en el canvas.
   */
  const agregarVertice = useCallback(() => {
    const label = generarEtiquetaVertice(vertices);
    const nuevoVertice = {
      id:    label,
      label,
      // Posición centrada con variación aleatoria
      x: 250 + Math.random() * 300,
      y: 150 + Math.random() * 250,
    };
    setVertices((prev) => [...prev, nuevoVertice]);
  }, [vertices]);

  /**
   * Elimina un vértice y todas sus aristas incidentes.
   * @param {string} id - ID del vértice a eliminar
   */
  const eliminarVertice = useCallback((id) => {
    setVertices((prev) => prev.filter((v) => v.id !== id));
    setAristas((prev) =>
      prev.filter((a) => a.source !== id && a.target !== id)
    );
  }, []);

  /**
   * Renombra un vértice existente.
   * Actualiza también las referencias en las aristas.
   * @param {string} id       - ID actual del vértice
   * @param {string} nuevoLabel - Nuevo nombre
   */
  const renombrarVertice = useCallback((id, nuevoLabel) => {
    const labelTrimmed = nuevoLabel.trim().toUpperCase();
    if (!labelTrimmed) return;

    // Verificar que el nuevo nombre no esté en uso
    const yaExiste = vertices.some(
      (v) => v.label === labelTrimmed && v.id !== id
    );
    if (yaExiste) return;

    setVertices((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, id: labelTrimmed, label: labelTrimmed } : v
      )
    );

    // Actualizar referencias en aristas
    setAristas((prev) =>
      prev.map((a) => {
        const newSource = a.source === id ? labelTrimmed : a.source;
        const newTarget = a.target === id ? labelTrimmed : a.target;
        return {
          ...a,
          id:     generarIdArista(newSource, newTarget),
          source: newSource,
          target: newTarget,
        };
      })
    );
  }, [vertices]);

  /**
   * Actualiza la posición de un vértice (usado por Cytoscape drag).
   * @param {string} id - ID del vértice
   * @param {number} x
   * @param {number} y
   */
  const moverVertice = useCallback((id, x, y) => {
    setVertices((prev) =>
      prev.map((v) => (v.id === id ? { ...v, x, y } : v))
    );
  }, []);

  /* ─── ARISTAS ───────────────────────────────── */

  /**
   * Agrega una arista entre dos vértices.
   * Ignora bucles y aristas duplicadas.
   * @param {string} source - ID del vértice origen
   * @param {string} target - ID del vértice destino
   */
  const agregarArista = useCallback(
    (source, target) => {
      if (source === target) return; // No se permiten bucles
      if (aristaExiste(source, target, aristas)) return;

      const nuevaArista = {
        id:     generarIdArista(source, target),
        source,
        target,
      };
      setAristas((prev) => [...prev, nuevaArista]);
    },
    [aristas]
  );

  /**
   * Elimina una arista por su ID.
   * @param {string} id - ID de la arista
   */
  const eliminarArista = useCallback((id) => {
    setAristas((prev) => prev.filter((a) => a.id !== id));
  }, []);

  /* ─── RESET ─────────────────────────────────── */

  /**
   * Reinicia el grafo a los datos iniciales de ejemplo.
   */
  const reiniciarGrafo = useCallback(() => {
    setVertices(initialVertices);
    setAristas(initialAristas);
  }, []);

  return {
    vertices,
    aristas,
    agregarVertice,
    eliminarVertice,
    renombrarVertice,
    moverVertice,
    agregarArista,
    eliminarArista,
    reiniciarGrafo,
  };
}
