import _ from 'lodash'

export type Input = number[]

export function parseInput(s: string): Input[] {
  const NUMBER_DRAW = /[\d,]+/
  const BOARD_ROW = /[\d\s]+/

  return s.split(/\r?\n/)
    .flatMap((x, index) => {
      if (index === 0) {
        const match = NUMBER_DRAW.exec(x.trim())
        if (!match) return []
        return [match[0].split(',').map(x => _.toNumber(x))]
      }

      const match = BOARD_ROW.exec(x.trim())
      if (!match) return []
      return [match[0].split(/\s+/).map(x => _.toNumber(x))]
    })
}

type Sequence<T=number> = [T, T, T, T, T]
type Row<T=number> = Sequence<T>

class BingoBoard {
  unmarked: Set<number>
  marked: Set<number> = new Set()
  numMarkedPerRow: [number, number, number, number, number]
  numMarkedPerCol: [number, number, number, number, number]
  winningDraw: number = NaN

  constructor(public rows: [Row, Row, Row, Row, Row]) {
    this.unmarked = new Set(rows.flatMap(row => row))
    this.rows = rows
    this.numMarkedPerRow = [0, 0, 0, 0, 0]
    this.numMarkedPerCol = [0, 0, 0, 0, 0]
  }

  tryToMarkAndCheckBingo(draw: number) {
    if (this.unmarked.has(draw)) {
      this.unmarked.delete(draw)
      this.marked.add(draw)

      for (const [rowIndex, row] of this.rows.entries()) {
        const colIndex = row.indexOf(draw)
        if (colIndex >= 0) {
          if (++this.numMarkedPerRow[rowIndex] === 5
            || ++this.numMarkedPerCol[colIndex] === 5) {
            this.winningDraw = draw
            return true
          }

          return false
        }
      }
    }

    return false
  }

  score() {
    return Array.from(this.unmarked).reduce(_.add) * this.winningDraw
  }
}

export function part1(data: Input[]) {
  const draws = _.head(data)!
  const boards = _.chunk(_.tail(data), 5)
    .map(rows => new BingoBoard(rows as [Row, Row, Row, Row, Row]))

  for (const draw of draws) {
    const bingoScores = boards
      .flatMap(board => board.tryToMarkAndCheckBingo(draw) ? [board.score()] : [])
    if (bingoScores.length > 0) {
      return _.max(bingoScores)
    }
  }

  return NaN
}

export function part2(data: Input[]) {
  const draws = _.head(data)!
  const boards = _.chunk(_.tail(data), 5)
    .map(rows => new BingoBoard(rows as [Row, Row, Row, Row, Row]))

  let bingos = [] as BingoBoard[]
  let noBingos = [...boards]
  for (const draw of draws) {
    [bingos, noBingos] = _.partition(noBingos, board => board.tryToMarkAndCheckBingo(draw))
    if (noBingos.length === 0) {
      return _.min(bingos.map(board => board.score()))
    }
  }

  return NaN
}
