/**
 * data/initialGraph.js
 * Datos de ejemplo para el grafo inicial al cargar la aplicación.
 * Sirve como demostración pedagógica de un grafo simple.
 */

export const initialVertices = [
  { id: 'A', label: 'A', x: 300, y: 200 },
  { id: 'B', label: 'B', x: 500, y: 150 },
  { id: 'C', label: 'C', x: 550, y: 350 },
  { id: 'D', label: 'D', x: 300, y: 380 },
  { id: 'E', label: 'E', x: 160, y: 290 },
];

export const initialAristas = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'A-D', source: 'A', target: 'D' },
  { id: 'A-E', source: 'A', target: 'E' },
  { id: 'B-C', source: 'B', target: 'C' },
  { id: 'C-D', source: 'C', target: 'D' },
];
