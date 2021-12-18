import _ from 'lodash'
import { pairPermutations, PriorityQueue } from '../lib'
import chalk from 'chalk'

type Input = number[][]

export function parseInput(s: string): Input {
  const INPUT = /(\d+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        match[1].split('').map(_.toNumber)
      ]
    })
}

class Grid {
  cells: number[][]
  size: number

  constructor(cells: number[][], expandFactor = 1) {
    this.size = cells.length * expandFactor
    this.cells = _.range(this.size)
      .map(() => _.range(this.size).map(() => NaN))

    const origSize = cells.length

    for (const [y, row] of cells.entries()) {
      for (const [x, cell] of row.entries()) {
        for (const [dx, dy] of pairPermutations(_.range(expandFactor))) {
          const mod9 = (cell + dx + dy) % 9
          this.cells[y + (origSize * dy)][x + (origSize * dx)] = mod9 === 0 ? 9 : mod9
        }
      }
    }
  }
  toString() {
    return this.cells.map(row => row.join(' ')).join('\n')
  }
  toJSON() {
    return this.toString()
  }

  shortestPathRisk(debug = true) {
    // Dijkstra's Algorithm
    // https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Using_a_priority_queue

    const source = `0,0` as const
    const target = `${this.size-1},${this.size-1}` as const

    type V = `${number},${number}`
    const Q = new PriorityQueue<V>()
    const dist = {} as Record<V, number>
    const prev = {} as Partial<Record<V, V>>
    
    dist[source] = 0
    Q.addWithPriority(source, 0)

    for (const vPair of pairPermutations(_.range(this.size))) {
      const v = vPair.join(',') as V
      if (v !== source) {
        dist[v] = Infinity
        prev[v] = undefined
      }
    }

    const terminate = (v: V) => {
      const S = [] as V[]

      while (v) {
        S.unshift(v)
        v = prev[v]!
      }

      if (debug) {
        const soln = _.range(this.size)
          .map((__, y) => _.range(this.size)
            .map((__, x) => S.includes(`${x},${y}`)
              ? chalk.bgGray(this.cells[y][x])
              : chalk.dim(this.cells[y][x])
            )
          )
        console.info(soln.map(row => row.join('')).join('\n'))
      }

      return S.slice(1).map(v => {
        const [x, y] = v.split(',').map(_.toNumber)
        return this.cells[y][x]
      }).reduce(_.add)
    }

    while (Q.size > 0) {
      const u = Q.extractMin()!

      if (u === target && (prev[u] || u === source)) {
        return terminate(u)
      }

      const [uX, uY] = u.split(',').map(_.toNumber)

      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const [vX, vY] = [uX + dx, uY + dy]

        if (vX >= this.size || vY >= this.size || vX < 0 || vY < 0) {
          continue
        }
        const v = `${vX},${vY}` as const

        const alt = dist[u] + this.cells[vY][vX]
        if (alt < dist[v]) {
          dist[v] = alt
          prev[v] = u
          if (Q.has(v)) {
            Q.decreasePriority(v, alt)
          } else {
            Q.addWithPriority(v, alt)
          }
        }
      }
    }
  }
}

export function part1(data: Input, debug = true) {
  const grid = new Grid(data)
  return grid.shortestPathRisk(debug)
}

export function part2(data: Input, debug = true) {
  const grid = new Grid(data, 5)
  return grid.shortestPathRisk(debug)
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
