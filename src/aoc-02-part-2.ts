const dir = "src/"
const fileName = "aoc-02-input.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const reportList = prepareReports(fileContent)
  console.log("reportList", reportList.length)
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
  let dampner = true
  let unsafeCounter = 0 // 320 ?
  let unsafeLevelsCounter = 0
  let ascendingCounter = 0 // 411
  let descendingCounter = 0 // 429
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
    if (!levelEvaluation) unsafeLevelsCounter++
  }

  const result = {
    totalReports: reportList.length,
    safeReports: reportList.length - unsafeCounter - unsafeLevelsCounter,
    unsafeLevelsCounter,
    unsafeCounter,
    ascendingCounter,
    descendingCounter,
  }
  return result
}

function evalIndividualReportLevels(report: number[]) {
  let dampner = true
  let isSafe = false
  for (let index = 0; index < report.length; index++) {
    const currentElement = report[index]
    const nextElement = report[index + 1]

    if (!nextElement) {
      isSafe = true
      break
    }

    const difference = Math.abs(currentElement - nextElement)
    if (difference > 3 || difference < 1) {
      if (dampner) {
        dampner = false
        continue
      }
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
