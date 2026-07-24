import chalk from 'chalk'

export function renderBanner(): string {
  const lines = [
    '          ◆',
    '         ▐█▌',
    '         ▐█▌',
    '         ▐█▌',
    '         ▐█▌',
    '         ▐█▌',
    '         ▐█▌',
    '       ▄▄███▄▄',
    '         ▐█▌',
    '         ▐█▌',
    '         ▐█▌',
    '          ●',
    '',
    '        A B Z S S',
  ]

  return lines.map((line) => chalk.gray(line)).join('\n')
}

export function printBanner(): void {
  console.log(renderBanner())
  console.log()
}