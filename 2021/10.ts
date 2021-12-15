import _ from 'lodash'

const CHUNK_DELIMITERS = [
  '(', ')',
  '[', ']',
  '{', '}',
  '<', '>',
] as const

type ChunkDelimiter = typeof CHUNK_DELIMITERS[number]

type Input = ChunkDelimiter[][]

export function parseInput(s: string): Input {
  const INPUT = /([()[\]{}<>]+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        match[1].split('') as ChunkDelimiter[]
      ]
    })
}

const CLOSING_DELIMITERS = [')', ']', '}', '>'] as const
const OPENING_DELIMITERS = ['(', '[', '{', '<'] as const
type ClosingDelimiter = typeof CLOSING_DELIMITERS[number]
type OpeningDelimiter = typeof OPENING_DELIMITERS[number]

const CLOSING_DELIMITER_MATCH: Record<ClosingDelimiter, OpeningDelimiter> = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
} as const
const OPENING_DELIMITER_MATCH: Record<OpeningDelimiter, ClosingDelimiter> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
} as const

const SYNTAX_ERROR_SCORE: Record<ClosingDelimiter, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}
const COMPLETION_CHARACTER_SCORE: Record<ClosingDelimiter, number> = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

function isClosingDelimiter(delimiter: ChunkDelimiter): delimiter is ClosingDelimiter {
  return CLOSING_DELIMITERS.includes(delimiter as any)
}

export function part1(data: Input) {
  return data.flatMap(line => {
    const findIllegalDelimiter = (stack: ChunkDelimiter[], remaining: ChunkDelimiter[]): ClosingDelimiter | null => {
      const next = remaining.shift()
      if (!next) return null

      if (isClosingDelimiter(next)) {
        if (CLOSING_DELIMITER_MATCH[next] !== _.last(stack)) {
          return next
        }

        stack.pop()
      } else {
        stack.push(next)
      }

      return findIllegalDelimiter(stack, remaining)
    }

    const illegalClosingDelimiter = findIllegalDelimiter([], [...line])
    if (!illegalClosingDelimiter) return []

    const score = SYNTAX_ERROR_SCORE[illegalClosingDelimiter]
    return [score]
  })
  .reduce(_.add)
}

export function part2(data: Input) {
  const scores = data.flatMap(line => {
    const findCompletionString = (stack: ChunkDelimiter[], remaining: ChunkDelimiter[]): ClosingDelimiter[] => {
      const next = remaining.shift()
      if (!next) {
        return stack.reverse()
          .map(openingDelimiter => OPENING_DELIMITER_MATCH[openingDelimiter as OpeningDelimiter])
      }

      if (isClosingDelimiter(next)) {
        if (CLOSING_DELIMITER_MATCH[next] !== _.last(stack)) {
          return []
        }

        stack.pop()
      } else {
        stack.push(next)
      }

      return findCompletionString(stack, remaining)
    }

    const completionString = findCompletionString([], [...line])
    if (completionString.length === 0) return []

    const completionStringScore = completionString
      .map(completionChar => COMPLETION_CHARACTER_SCORE[completionChar])
      .reduce((totalScore, score) => totalScore * 5 + score, 0)

    return [completionStringScore]
  })
  .sort((a, b) => a - b)

  const median = scores[Math.floor(scores.length / 2)]

  return median
}
