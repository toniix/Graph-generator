/**
 * utils/graphAlgorithms.js
 * 
 * Biblioteca de algoritmos de teoría de grafos.
 * Diseñada para ser extensible, modular e independiente de la UI.
 */

/**
 * Encuentra todas las componentes conexas en un grafo no dirigido.
 * Utiliza una estrategia de recorrido en anchura (BFS).
 * 
 * ── ANALISIS DE COMPLEJIDAD TEMPORAL Y ESPACIAL ──────────────────────────────
 * - Complejidad Temporal: O(|V| + |E|)
 *   Donde |V| es el número de vértices y |E| es el número de aristas.
 *   - Construcción de lista de adyacencia: O(|V| + |E|), iteramos una vez sobre
 *     cada nodo y arista.
 *   - Recorrido BFS: Cada vértice entra y sale de la cola exactamente una vez,
 *     y exploramos cada arista incidente dos veces (en ambas direcciones).
 *   Por lo tanto, la complejidad de tiempo es óptima y lineal.
 * 
 * - Complejidad Espacial: O(|V| + |E|)
 *   - Lista de adyacencia: O(|V| + |E|)
 *   - Conjunto de visitados y cola BFS: O(|V|)
 *   - Estructura de componentes retornada: O(|V|)
 *   
 * ── BUENAS PRÁCTICAS Y ESCALABILIDAD ─────────────────────────────────────────
 * - Desacoplamiento total: Este algoritmo recibe tipos de datos primitivos de JS
 *   (nodos y aristas con IDs en string) y retorna un array estándar. No depende
 *   de React, Cytoscape ni ninguna biblioteca visual.
 * - Extensibilidad: Se pueden agregar fácilmente funciones hermanas como
 *   detectar ciclos (hasCycle), BFS/DFS paso a paso, o Dijkstra en este mismo
 *   archivo sin afectar a las funciones existentes.
 * 
 * @param {Array<{id: string}>} nodes - Lista de vértices del grafo
 * @param {Array<{source: string, target: string}>} edges - Lista de aristas
 * @returns {Array<{id: number, vertices: string[]}>} Lista de componentes conexas
 */
export function findConnectedComponents(nodes, edges) {
  if (!nodes || nodes.length === 0) return [];

  // 1. Construir la lista de adyacencia para acceso O(1) a los vecinos
  const adj = {};
  nodes.forEach((n) => {
    adj[n.id] = [];
  });

  edges.forEach((e) => {
    // Evitar errores si hay inconsistencia en los datos del grafo
    if (adj[e.source] && adj[e.target]) {
      adj[e.source].push(e.target);
      adj[e.target].push(e.source);
    }
  });

  const visited = new Set();
  const components = [];
  let componentId = 1;

  // 2. Iterar sobre cada nodo y realizar BFS si no ha sido visitado
  nodes.forEach((n) => {
    if (!visited.has(n.id)) {
      const componentVertices = [];
      const queue = [n.id];
      visited.add(n.id);

      while (queue.length > 0) {
        const u = queue.shift();
        componentVertices.push(u);

        const neighbors = adj[u] || [];
        neighbors.forEach((v) => {
          if (!visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
        });
      }

      // Ordenar alfabéticamente para una visualización consistente y elegante
      componentVertices.sort();

      components.push({
        id: componentId++,
        vertices: componentVertices,
      });
    }
  });

  return components;
}

/**
 * Genera un grafo aleatorio simple (dirigido o no dirigido).
 * Coloca los nodos en coordenadas espaciales aleatorias adecuadas para el canvas.
 * 
 * @param {number} numVertices - Cantidad de vértices a generar (1-30 recomendado)
 * @param {number} numEdges - Cantidad de aristas a generar
 * @param {boolean} directed - Si el grafo debe tener aristas dirigidas
 * @returns {{vertices: Array, aristas: Array}}
 */
export function generateRandomGraph(numVertices, numEdges, directed = false) {
  const vertices = [];
  const aristas = [];
  
  // 1. Generar etiquetas
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const getLabel = (idx) => {
    if (idx < letras.length) {
      return letras[idx];
    } else {
      return `V${idx - letras.length + 1}`;
    }
  };

  // 2. Colocar los nodos en coordenadas aleatorias dispersas por el canvas
  for (let i = 0; i < numVertices; i++) {
    const label = getLabel(i);
    vertices.push({
      id: label,
      label: label,
      x: 180 + Math.random() * 400,
      y: 120 + Math.random() * 260,
    });
  }

  // 3. Generar aristas únicas
  // El número máximo de aristas en un grafo dirigido es V * (V - 1), y en uno no dirigido es V * (V - 1) / 2
  const maxPossibleEdges = directed ? numVertices * (numVertices - 1) : (numVertices * (numVertices - 1)) / 2;
  const actualEdgesCount = Math.min(numEdges, maxPossibleEdges);
  
  const edgeIds = new Set();
  
  while (edgeIds.size < actualEdgesCount) {
    const uIdx = Math.floor(Math.random() * numVertices);
    let vIdx = Math.floor(Math.random() * numVertices);
    
    if (uIdx === vIdx) continue;
    
    const u = vertices[uIdx].id;
    const v = vertices[vIdx].id;
    
    const edgeId = directed ? `${u}->${v}` : [u, v].sort().join('-');
    
    if (!edgeIds.has(edgeId)) {
      edgeIds.add(edgeId);
      aristas.push({
        id: edgeId,
        source: u,
        target: v,
        directed: directed,
      });
    }
  }

  return { vertices, aristas };
}
