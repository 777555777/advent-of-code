const dir = "src/"
const fileName = "aoc-04-input.txt"

main()

async function main() {
  const fileContent = await readInputFile(`${dir}${fileName}`)
  const fileStrings = fileContent.split("\n")

  const verticalLines = prepareVerticalLines(fileStrings)
  console.log("verticalLines", verticalLines)

  // const amountOfLines = lines.length
  // // const amountOfCharsInString = lines[0].length

  // const verticalChars = []

  // for (let index = 0; index < amountOfLines; index++) {
  //   for (const lineString of lines[index]) {
  //     verticalChars.push(lineString.slice(0)[index])
  //   }
  // }

  // console.log("verticalChars", verticalChars.join().replaceAll(",", ""))
}

function prepareVerticalLines(fileContent: string[]): string[] {
  const verticalLines: string[] = []

  // Gehe von 0 bis zur Länge der Strings (z.B. 140)
  for (let col = 0; col < fileContent[0].length; col++) {
    let verticalLine = ""

    // Füge das Zeichen jeder Zeile an die aktuelle vertikale Linie an
    for (let row = 0; row < fileContent.length; row++) {
      verticalLine += fileContent[row][col]
    }

    // Speichere die vertikale Linie im Ergebnis-Array
    verticalLines.push(verticalLine)
  }

  return verticalLines
}

async function readInputFile(filename: string) {
  return await Deno.readTextFile(filename)
}
