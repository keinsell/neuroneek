export default {
	concurrency: 5,
	failFast: false,
	failWithoutAssertions: false,
	environmentVariables: {
		NODE_ENV: 'testing'
	},
	verbose: false,
	nodeArguments: ['--loader=ts-node/esm', '--experimental-specifier-resolution=node', '--no-warnings'],
	extensions: {
		ts: 'module'
	}
}
