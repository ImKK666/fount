import process from 'node:process'
import { console } from '../scripts/console.mjs'
import { init } from './server.mjs'
import { IPCManager } from './ipc_server.mjs'
import { ReStartJobs } from './jobs.mjs'
import { geti18n } from '../scripts/i18n.mjs'

console.log(await geti18n('fountConsole.server.standingBy'))

let args = process.argv.slice(2)

const isFirstInstance = await init()

if (args.length) {
	const command = args[0]
	args = args.slice(1)

	if (command === 'runshell') {
		const username = args[0]
		const shellname = args[1]
		args = args.slice(2)

		try {
			await IPCManager.sendCommand('runshell', { username, shellname, args })
		} catch (err) {
			console.error(await geti18n('fountConsole.ipc.sendCommandFailed', { error: err }))
			process.exit(1)
		}
	}
	else if (command === 'shutdown')
		try {
			await IPCManager.sendCommand('shutdown')
		} catch (err) {
			console.error(await geti18n('fountConsole.ipc.sendCommandFailed', { error: err }))
			process.exit(1)
		}
	else {
		console.error(await geti18n('fountConsole.ipc.invalidCommand'))
		process.exit(1)
	}
}

if (!isFirstInstance) process.exit(0)

ReStartJobs()
