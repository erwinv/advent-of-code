import _ from 'lodash'
import { MappedSet } from './09'

type Vertex = string // 'start' | 'end' | Uppercase<string> | Lowercase<string>
type Edge = readonly [Vertex, Vertex]
type Path = Vertex[]

export type Input = Edge

export function parseInput(s: string): Input[] {
  const INPUT = /(start|end|[A-Z]+|[a-z]+)-(start|end|[A-Z]+|[a-z]+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        [match[1], match[2]] as const
      ]
    })
}

type EdgeStr = `${Vertex}-${Vertex}`

class EdgeSet extends MappedSet<Edge, EdgeStr> {
  map(edge: Edge): EdgeStr {
    const [v1, v2] = _.orderBy(edge, _.identity)
    return `${v1}-${v2}`
  }
  inverseMap(edgeStr: EdgeStr): Edge {
    const [v1, v2] = edgeStr.split('-')
    return [v1, v2] as const
  }
}

class Graph {
  vertices: Set<Vertex> = new Set()
  edges: EdgeSet = new EdgeSet()
  vertexNeighbors: Map<Vertex, Set<Vertex>> = new Map()
  paths: Path[] = []

  constructor(edges: Edge[]) {
    for (const edge of edges) {
      this.edges.add(edge)

      const [v1, v2] = edge
      this.vertices.add(v1)
      this.vertices.add(v2)
    }

    for (const vertex of this.vertices) {
      const vertexNeighbors = this.vertexNeighbors.get(vertex) ?? new Set()
      for (const [v1, v2] of this.edges) {
        if (v1 === vertex) vertexNeighbors.add(v2)
        else if (v2 === vertex) vertexNeighbors.add(v1)
      }
      this.vertexNeighbors.set(vertex, vertexNeighbors)
    }
  }

  findPaths(smallCaveMaxVisit = 1, numSmallCavesWithMaxVisit = 1) {
    if (!this.vertices.has('start') || !this.vertices.has('end')) {
      return
    }

    const _traverseGraph = (path: Path) => {
      const vertex = _.last(path)!

      if (vertex === 'end') {
        this.paths.push(path)
        return
      }

      for (const neighbor of this.vertexNeighbors.get(vertex)!) {
        if (neighbor === 'start') {
          continue
        }

        const isSmallCave = neighbor.toLowerCase() === neighbor
          && !['start', 'end'].includes(neighbor)

        if (isSmallCave) {
          if (smallCaveMaxVisit === 1) {
            if (path.includes(neighbor)) {
              continue
            }
          } else {
            const smallCaveNumVisitsQuota = _.chain([...path, neighbor])
              .filter(c => !['start', 'end'].includes(c) && c.toLowerCase() === c)
              .countBy(_.identity)
              .pickBy(count => count >= smallCaveMaxVisit)
              .value()

            if (smallCaveNumVisitsQuota[neighbor] > smallCaveMaxVisit
              || _.size(smallCaveNumVisitsQuota) > numSmallCavesWithMaxVisit) {
              continue
            }
          }
        }

        _traverseGraph([...path, neighbor])
      }
    }

    _traverseGraph(['start'])
  }
}

export function part1(data: Input[]) {
  const graph = new Graph(data)
  graph.findPaths()
  return graph.paths.length
}

export function part2(data: Input[]) {
  const graph = new Graph(data)
  graph.findPaths(2)
  return graph.paths.length
}
