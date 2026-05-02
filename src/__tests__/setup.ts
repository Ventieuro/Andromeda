import '@testing-library/jest-dom'

// Alcuni ambienti di test iniettano un localStorage incompleto.
// Forziamo una implementazione minima ma stabile per tutti i test.
const storageData = new Map<string, string>()

const storageShim: Storage = {
	get length() {
		return storageData.size
	},
	clear() {
		storageData.clear()
	},
	getItem(key: string) {
		return storageData.has(key) ? storageData.get(key)! : null
	},
	key(index: number) {
		return Array.from(storageData.keys())[index] ?? null
	},
	removeItem(key: string) {
		storageData.delete(key)
	},
	setItem(key: string, value: string) {
		storageData.set(String(key), String(value))
	},
}

Object.defineProperty(globalThis, 'localStorage', {
	value: storageShim,
	writable: true,
	configurable: true,
})
