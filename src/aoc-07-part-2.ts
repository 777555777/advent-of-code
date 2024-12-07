const dir = "src/"
const fileName = "aoc-07-input.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const fileStrings = fileContent.split("\n")
  const equationChallanges = prepareEquationChallanges(fileStrings)

  const validChallanges: Challange[] = []
  for (const challange of equationChallanges) {
    const challangeResult = checkChallange(challange)
    if (challangeResult) {
      validChallanges.push(challangeResult)
    }
  }

  // Calc and print sum of all valid results
  console.log("validChallanges", validChallanges.length)
  console.log(validChallanges.reduce((accumulator, currentValue) => accumulator + currentValue.result, 0))

  const invalidChallanges: Challange[] = []
  for (const challange of equationChallanges) {
    let isValid = false

    for (const validChallange of validChallanges) {
      if (challange.result === validChallange.result) {
        isValid = true
        break
      }
    }

    if (!isValid) {
      invalidChallanges.push(challange)
    }
  }

  console.log("invalidChallanges", invalidChallanges.length) // should be 850 - 410 ( 410 of 850 are valid )
  // for (const invalidChallange of invalidChallanges) {
  //   checkForCombinatedChallanges(invalidChallange)
  // }
  checkForCombinatedChallanges(invalidChallanges[0])
}

function checkForCombinatedChallanges(challange: Challange) {
  console.log("challange", challange)
  const numberOfOperatorPositions = challange.equation.length - 1
  console.log("numberOfOperatorPositions", numberOfOperatorPositions)

  for (let index = 0; index < numberOfOperatorPositions; index++) {
    if (challange.equation[index + 1] !== undefined) {
      const combinedNumber = combineNumbers(challange.equation[index], challange.equation[index + 1])
      console.log(`Combine ${challange.equation[index]} and ${challange.equation[index + 1]} to ${combinedNumber}`)

      challange.equation.splice(index, 2, combinedNumber)
      console.log(challange.equation)

      index--
    }
  }
}

function combineNumbers(numberA: number, numberB: number) {
  return parseInt(numberA.toString().concat(numberB.toString()))
}

function checkChallange(challange: Challange) {
  const operators = ["+", "*"]
  const numberOfOperatorPositions = challange.equation.length - 1
  const totalCombinations = Math.pow(operators.length, numberOfOperatorPositions)

  for (let i = 0; i < totalCombinations; i++) {
    let temp = i
    const operatorCombination: string[] = [] // Store operators for this combination

    for (let j = 0; j < numberOfOperatorPositions; j++) {
      const operatorIndex = temp % operators.length
      temp = Math.floor(temp / operators.length)
      operatorCombination.push(operators[operatorIndex])
    }

    // Compute result for this combination
    const computedResult = computeResult(challange.equation, operatorCombination)

    if (computedResult === challange.result) {
      challange.solutionEquation = challange.equation
        .map((num, index) => (index < operatorCombination.length ? `${num} ${operatorCombination[index]}` : `${num}`))
        .join(" ")
      return challange
    }
  }
  return false
}

function computeResult(numbers: number[], operators: string[]): number {
  let result = numbers[0]
  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i]
    const nextNumber = numbers[i + 1]

    if (operator === "+") {
      result += nextNumber
    } else if (operator === "*") {
      result *= nextNumber
    }
  }
  return result
}

function prepareEquationChallanges(fileStrings: string[]) {
  const equationChallanges = []
  for (const fileString of fileStrings) {
    const [resultPart, equationPart] = fileString.split(":")
    const result = parseInt(resultPart)
    const equation = equationPart.slice(1, equationPart.length).split(" ").map(Number)
    equationChallanges.push({ result, equation })
  }
  return equationChallanges
}

async function readInputFile(filename: string) {
  return await Deno.readTextFile(filename)
}

type Challange = {
  result: number
  equation: number[]
  solutionEquation?: string
}
