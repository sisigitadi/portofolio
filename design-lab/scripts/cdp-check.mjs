/* CDP smoke-test (connect-mode): load URL, capture console errors + body text.
   Run after Chrome headless with --remote-debugging-port=9555:
     Usage: node scripts/cdp-check.mjs <url> [port] */
const URL = process.argv[2] || 'http://localhost:4173/'
const PORT = process.argv[3] || 9555

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let target
for (let i = 0; i < 40; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json`)
    const list = await res.json()
    target = list.find((t) => t.type === 'page')
    if (target) break
  } catch { /* retry */ }
  await sleep(250)
}
if (!target) {
  console.log('ERROR: cannot connect to CDP port', PORT)
  process.exit(2)
}

const ws = new WebSocket(target.webSocketDebuggerUrl)
const pending = new Map()
let seq = 0
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++seq
    pending.set(id, { resolve, reject })
    ws.send(JSON.stringify({ id, method, params }))
    setTimeout(() => {
      if (pending.has(id)) { pending.delete(id); reject(new Error('timeout: ' + method)) }
    }, 15000)
  })
}

await new Promise((r, j) => {
  ws.onopen = r
  ws.onerror = () => j(new Error('WS error'))
})

const errors = []
ws.addEventListener('message', (e) => {
  let m
  try { m = JSON.parse(e.data) } catch { return }
  if (m.id && pending.has(m.id)) {
    pending.get(m.id).resolve(m.result)
    pending.delete(m.id)
    return
  }
  if (m.method === 'Runtime.exceptionThrown') {
    errors.push('EXCEPTION: ' + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || '?'))
  }
  if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(m.params.type)) {
    errors.push(`CONSOLE.${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description ?? '').join(' '))
  }
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
    errors.push('LOG.error: ' + m.params.entry.text)
  }
})

await send('Runtime.enable')
await send('Log.enable')
await send('Page.enable')
await send('Page.navigate', { url: URL })
await sleep(5000)

const { result } = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    ready: document.readyState,
    href: location.href,
    rootKids: (document.getElementById('root') || {}).childElementCount ?? -1,
    bodyLen: (document.body ? document.body.innerText.length : -1),
    text: document.body ? document.body.innerText.slice(0, 700) : '(no body)',
    err: window.__cdpErr || null
  })`,
  returnByValue: true,
})
console.log('URL:', URL)
console.log('STATE:', result.value)
console.log('ERRORS:', errors.length ? '\n  ' + errors.join('\n  ') : '(none)')
console.log('ERRORS:', errors.length ? '\n  ' + errors.join('\n  ') : '(none)')
ws.close()
process.exit(errors.length ? 1 : 0)
