import _ from 'lodash'

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

type TraversalCriteria = (nextVertex: Vertex, currentPath: Path) => boolean

class Graph {
  vertexNeighbors: Map<Vertex, Set<Vertex>> = new Map()
  paths: Path[] = []

  constructor(edges: Edge[]) {
    for (const edge of edges) {
      const [v1, v2] = edge

      if (!this.vertexNeighbors.has(v1))
        this.vertexNeighbors.set(v1, new Set())
  
      if (!this.vertexNeighbors.has(v2))
        this.vertexNeighbors.set(v2, new Set())
  
      this.vertexNeighbors.get(v1)!.add(v2)
      this.vertexNeighbors.get(v2)!.add(v1)
    }
  }

  findPaths(traversalCriteria: TraversalCriteria, start: Vertex = 'start', end: Vertex = 'end') {
    const _traverseGraph = (path: Path) => {
      const vertex = _.last(path)!

      if (vertex === end) {
        this.paths.push(path)
        return
      }

      for (const neighbor of this.vertexNeighbors.get(vertex)!) {
        if (neighbor !== start && traversalCriteria(neighbor, path)) {
          _traverseGraph([...path, neighbor])
        }
      }
    }

    _traverseGraph([start])
  }
}

function isSmallCave(c: string) {
  return c.toLowerCase() === c && !['start', 'end'].includes(c)
}

export function part1(data: Input[]) {
  const graph = new Graph(data)

  graph.findPaths((nextCave, currentPath) => {
    if (!isSmallCave(nextCave)) return true

    return  !currentPath.includes(nextCave)
  })

  return graph.paths.length
}

export function part2(data: Input[]) {
  const graph = new Graph(data)
  graph.findPaths((nextCave, currentPath) => {
    if (!isSmallCave(nextCave)) return true

    const smallCaveMaxVisits = 2

    const smallCaveNumVisits = _.chain([...currentPath, nextCave])
      .filter(isSmallCave)
      .countBy(_.identity)
      .value()

    const smallCavesWithMaxVisits = _.pickBy(
      smallCaveNumVisits,
      n => n === smallCaveMaxVisits
    )

    return smallCaveNumVisits[nextCave] <= smallCaveMaxVisits
      && _.size(smallCavesWithMaxVisits) <= 1
  })

  return graph.paths.length
}
