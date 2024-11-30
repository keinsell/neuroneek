import figlet from 'figlet'



export function prettyPrintServiceInformation() {
	console.log('\n\n')
	console.log(figlet.textSync('Methylphenidate', 'Doom'))
	console.log()
	console.log(`Methylophenidate is a boilerplate for Nest.js applications with batteries included.` + '\n' + '\n' + '\n')
}