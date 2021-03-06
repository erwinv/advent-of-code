import _ from 'lodash'
import { MappedSet } from '../lib'
import chalk from 'chalk'

type Input = number[][]

export function parseInput(s: string): Input {
  const INPUT = /\d+/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        match[0].split('').map(_.toNumber)
      ]
    })
}

type Pos = readonly [row: number, col: number]

class PosSet extends MappedSet<Pos, `${number},${number}`> {
  map([row, col]: Pos) {
    return `${row},${col}` as const
  }
  inverseMap(str: `${number},${number}`) {
    const [row, col] = str.split(',').map(_.toNumber)
    return [row, col] as Pos
  }
}

class Grid {
  data: number[][]
  numRows: number
  numCols: number
  numFlashes = 0

  constructor(data: number[][]) {
    this.data = data.map(row => [...row]) // this bit me so hard (must clone/copy the input!)
                                          // part 1 would pass but part 2 kept on failing (because part1 modified the input!)
                                          // and it made me doubt the working solution for part 1
    this.numRows = data.length
    this.numCols = data[0].length
  }

  at([i, j]: Pos) {
    return this.data[i][j]
  }
  inc([i, j]: Pos) {
    return ++this.data[i][j]
  }
  set([i, j]: Pos, val: number) {
    this.data[i][j] = val
  }

  step() {
    const propagateFlash = (alreadyFlashed: PosSet, justFlashed: PosSet): void => {
      if (justFlashed.size === 0) return

      const flashedNeighbors = justFlashed.values()
        .flatMap(pos =>
          this.neighbors(pos)
            .filter(neighborPos => !alreadyFlashed.has(neighborPos))
        )

      for (const pos of flashedNeighbors) {
        this.inc(pos)
      }

      const flashing = new PosSet()

      for (const [i, row] of this.data.entries()) {
        for (const [j, val] of row.entries()) {
          const pos = [i, j] as const
          if (val > 9) {
            flashing.add(pos)
            this.set(pos, 0)
            this.numFlashes++
          }
        }
      }

      flashing.forEach(pos => alreadyFlashed.add(pos))
      return propagateFlash(alreadyFlashed, flashing)
    }

    const flashing = new PosSet()

    for (const [i, row] of this.data.entries()) {
      for (const [j] of row.entries()) {
        const pos = [i, j] as const
        if (this.inc(pos) > 9) {
          flashing.add(pos)
          this.set(pos, 0)
          this.numFlashes++
        }
      }
    }

    propagateFlash(flashing, flashing)

    return this.data.every(row => row.every(val=> val === 0))
  }

  neighbors([row, col]: Pos) {
    const top   = [row-1, col] as Pos
    const bot   = [row+1, col] as Pos
    const left  = [row, col-1] as Pos
    const right = [row, col+1] as Pos
    const topLeft   = [row-1, col-1] as Pos
    const topRight  = [row-1, col+1] as Pos
    const botLeft   = [row+1, col-1] as Pos
    const botRight  = [row+1, col+1] as Pos

    const isTopRow = row === 0
    const isBotRow = row === this.numRows - 1
    const isLeftEdge = col === 0
    const isRightEdge = col === this.numCols - 1

    const neighbors = [] as Pos[]
    if (!isTopRow) neighbors.push(top)
    if (!isBotRow) neighbors.push(bot)
    if (!isLeftEdge) neighbors.push(left)
    if (!isRightEdge) neighbors.push(right)
    if (!(isTopRow || isLeftEdge)) neighbors.push(topLeft)
    if (!(isTopRow || isRightEdge)) neighbors.push(topRight)
    if (!(isBotRow || isLeftEdge)) neighbors.push(botLeft)
    if (!(isBotRow || isRightEdge)) neighbors.push(botRight)

    return neighbors
  }

  toString() {
    const chalkMap = {
      [1]: chalk.bgHex('#111111'),
      [2]: chalk.bgHex('#222222'),
      [3]: chalk.bgHex('#333333'),
      [4]: chalk.bgHex('#444444'),
      [5]: chalk.bgHex('#555555'),
      [6]: chalk.bgHex('#666666'),
      [7]: chalk.bgHex('#777777'),
      [8]: chalk.bgHex('#888888'),
      [9]: chalk.bgHex('#999999'),
      [0]: chalk.bgHex('#AAAAAA'),
    } as Record<number, chalk.Chalk>
    return this.data
      .map(row => row
        .map(v => chalkMap[v](' '))
        .join('')
      )
      .join('\n')
  }
  toJSON() {
    return this.toString()
  }
}

export function part1(data: Input, debug = true) {
  const grid = new Grid(data)
  for (const __ of _.range(100)) {
    grid.step()
  }
  return grid.numFlashes
}

export function part2(data: Input, debug = true) {
  const grid = new Grid(data)
  if (debug) {
    console.info(`before any steps:\n${grid.toJSON()}`)
  }
  let step = 0
  while (true) {
    step++
    const synchronizedFlash = grid.step()
    if (debug && (step < 10 || step % 10 === 0 || synchronizedFlash)) {
      console.info(`after step ${step}:\n${grid.toJSON()}`)
    }
    if (synchronizedFlash) return step
  }
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
