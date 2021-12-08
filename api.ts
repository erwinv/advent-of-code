
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://adventofcode.com/',
  headers: {
    cookie: `session=${process.env.SESSION_COOKIE}`,
  },
})

export function getInput(dirname: string, filename: string) {
  const year = path.basename(dirname)
  const day = path.basename(filename, '.js')
  const inputFile = path.join('.', year, 'input', day + '.txt')

  return fs.promises.readFile(inputFile, 'utf8')
    .catch(async () => {
      try {
        const { data: input } = await axiosInstance
          .get<string>(`/${year}/day/${_.toNumber(day)}/input`)

        await fs.promises.writeFile(inputFile, input)

        return input
      } catch (e) {
        if (axios.isAxiosError(e)) {
          console.error(e.toJSON())
          process.exit(1)
        } else {
          throw e
        }
      }
    })
}
