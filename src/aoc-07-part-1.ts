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
  console.log(validChallanges.reduce((accumulator, currentValue) => accumulator + currentValue.result, 0))
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
