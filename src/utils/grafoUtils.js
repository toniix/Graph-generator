/**
 * utils/grafoUtils.js
 * Funciones puras reutilizables para análisis de grafos.
 * Todas las funciones trabajan sobre arrays de vértices y aristas.
 */

/**
 * Calcula el grado de un vértice dado.
 * El grado es la cantidad de aristas que inciden en el vértice.
 * En un grafo no dirigido, cada arista cuenta una vez por extremo.
 *
 * @param {string} verticeId - ID del vértice
 * @param {Array}  aristas   - Array de aristas [{id, source, target}]
 * @returns {number} Grado del vértice
 */
export function calcularGradoVertice(verticeId, aristas) {
  return aristas.filter(
    (a) => a.source === verticeId || a.target === verticeId
  ).length;
}

/**
 * Calcula el grado total del grafo.
 * Por el Teorema del Apretón de Manos: grado total = 2 × |E|
 * (cada arista contribuye con 1 al grado de cada uno de sus dos extremos)
 *
 * @param {Array} aristas - Array de aristas
 * @returns {number} Suma de todos los grados
 */
export function calcularGradoTotal(aristas) {
  return aristas.length * 2;
}

/**
 * Genera la lista de adyacencia del grafo.
 * Para un grafo no dirigido, cada vértice lista todos sus vecinos.
 *
 * @param {Array} vertices - Array de vértices [{id, label}]
 * @param {Array} aristas  - Array de aristas [{id, source, target}]
 * @returns {Object} Mapa { verticeId: [vecinoId, ...] }
 */
export function generarListaAdyacencia(vertices, aristas) {
  const lista = {};

  // Inicializar cada vértice con lista vacía
  vertices.forEach((v) => {
    lista[v.id] = [];
  });

  // Llenar vecinos (grafo no dirigido: ambos sentidos)
  aristas.forEach((a) => {
    if (lista[a.source] !== undefined) {
      lista[a.source].push(a.target);
    }
    if (lista[a.target] !== undefined) {
      lista[a.target].push(a.source);
    }
  });

  return lista;
}

/**
 * Genera la matriz de adyacencia del grafo.
 * Para grafos no dirigidos: matriz[i][j] = 1 si existe arista entre i y j.
 *
 * @param {Array} vertices - Array de vértices
 * @param {Array} aristas  - Array de aristas
 * @returns {{ labels: string[], matrix: number[][] }}
 */
export function generarMatrizAdyacencia(vertices, aristas) {
  const n = vertices.length;
  const labels = vertices.map((v) => v.label);

  // Crear matriz n×n inicializada en 0
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));

  // Crear mapa id → índice para acceso O(1)
  const indexMap = {};
  vertices.forEach((v, i) => {
    indexMap[v.id] = i;
  });

  // Marcar conexiones (grafo no dirigido: simétrico)
  aristas.forEach((a) => {
    const i = indexMap[a.source];
    const j = indexMap[a.target];
    if (i !== undefined && j !== undefined) {
      matrix[i][j] = 1;
      matrix[j][i] = 1;
    }
  });

  return { labels, matrix };
}

/**
 * Genera un ID único para una arista basado en los vértices origen/destino.
 * Garantiza que A-B y B-A sean la misma arista en un grafo no dirigido.
 *
 * @param {string} source
 * @param {string} target
 * @returns {string}
 */
export function generarIdArista(source, target) {
  const [a, b] = [source, target].sort();
  return `${a}-${b}`;
}

/**
 * Verifica si ya existe una arista entre dos vértices.
 *
 * @param {string} source
 * @param {string} target
 * @param {Array}  aristas
 * @returns {boolean}
 */
export function aristaExiste(source, target, aristas) {
  return aristas.some(
    (a) =>
      (a.source === source && a.target === target) ||
      (a.source === target && a.target === source)
  );
}

/**
 * Genera una letra disponible para el próximo vértice.
 * Usa el alfabeto A-Z, luego A1, B1, ...
 *
 * @param {Array} vertices - Vértices actuales
 * @returns {string} Etiqueta para el nuevo vértice
 */
export function generarEtiquetaVertice(vertices) {
  const usadas = new Set(vertices.map((v) => v.label));
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (const letra of letras) {
    if (!usadas.has(letra)) return letra;
  }

  // Fallback para más de 26 vértices
  let i = 1;
  while (usadas.has(`N${i}`)) i++;
  return `N${i}`;
}
