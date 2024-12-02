import bytes from 'bytes';
import os    from 'os';



function formatMemoryInfo(): string {
	const memoryUsage = process.memoryUsage();
	return `${bytes(memoryUsage.heapUsed)} / ${bytes(memoryUsage.heapTotal)}`;
}

function formatCpuInfo(): string {
	const avgCpuSpeedInGhz = (
		os.cpus().reduce((acc, cpu) => acc + cpu.speed, 0) / os.cpus().length / 1000
	).toFixed(2);
	return `${os.cpus()[0].model} @ ${avgCpuSpeedInGhz} GHz`;
}

function formatRamInfo(): string {
	const totalMemory = bytes(os.totalmem());
	const freeMemory = bytes(os.freemem());
	return `${totalMemory} (${freeMemory} free)`;
}

function divideLine() {
	console.log('-'.repeat(52))
}

export function printSystemInfo(): void {
	divideLine()
	console.log(`Node.js Version: ${process.version}`);
	console.log(`Node.js Platform: ${process.platform}`);
	console.log(`Node.js Architecture: ${process.arch}`);
	console.log(`Node.js Heap: ${formatMemoryInfo()}`);
	divideLine()
	console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
	console.log(`Host: ${process.env.HOST ?? 'localhost'}`);
	console.log(`Port: ${process.env.PORT ?? 3000}`);
	console.log(`Protocol: ${process.env.PROTOCOL ?? 'http'}`);
	divideLine()
	console.log(`OS: ${os.userInfo().username} ${process.platform} ${process.arch}`);
	console.log(`CPU: ${formatCpuInfo()}`);
	console.log(`RAM: ${formatRamInfo()}`);
	console.log(`\n\n`);
}