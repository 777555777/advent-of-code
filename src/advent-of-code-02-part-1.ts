const dir = "src/"
const fileName = "advent-of-code-02-input.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const reportList = prepareReports(fileContent)
  const evaluationResult = evalReportSafety(reportList)
  console.log(evaluationResult)
}

async function readInputFile(filename: string) {
  return await Deno.readTextFile(filename)
}

function prepareReports(fileContent: string) {
  const rows = fileContent.split("\n")
  const levelSeperator = " "

  const reportList: number[][] = []
  for (const row of rows) {
    reportList.push(row.split(levelSeperator).map(Number))
  }

  return reportList
}

function evalReportSafety(reportList: number[][]) {
  // The levels are either all increasing or all decreasing.
  // Any two adjacent levels differ by at least one and at most three.
  let unsafeCounter = 0
  let ascendingCounter = 0
  let descendingCounter = 0
  for (const report of reportList) {
    const reportIsAscending = isAscending(report)
    const reportIsDescending = isDescending(report)

    if (reportIsAscending) ascendingCounter++
    if (reportIsDescending) descendingCounter++

    if (!reportIsAscending && !reportIsDescending) {
      unsafeCounter++
      continue
    }

    const levelEvaluation = evalIndividualReportLevels(report)
    if (!levelEvaluation) unsafeCounter++
  }

  const result = {
    totalReports: reportList.length,
    safeReports: reportList.length - unsafeCounter,
    unsafeCounter,
    ascendingCounter,
    descendingCounter,
  }
  return result
}

function evalIndividualReportLevels(report: number[]) {
  let isSafe = false
  for (let index = 0; index < report.length; index++) {
    const currentElement = report[index]
    const nextElement = report[index + 1]

    if (!nextElement) {
      isSafe = true
      break
    }

    const difference = Math.abs(currentElement - nextElement)
    if (!(difference === 1 || difference === 2 || difference === 3)) {
      isSafe = false
      break
    }
  }

  return isSafe
}

function isAscending(report: number[]) {
  const result = report.every((x, i) => {
    return i === 0 || x >= report[i - 1]
  })
  return result
}

function isDescending(report: number[]) {
  const result = report.every((x, i) => {
    return i === 0 || x <= report[i - 1]
  })
  return result
}
