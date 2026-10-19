import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

const html = readFileSync(new URL('../../widgets/translate-selection/index.html', import.meta.url), 'utf8')
const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? ''

function load(settings: Record<string, unknown> = {}, result: unknown = { ok: true, text: 'Bonjour' }, locale = 'en') {
  const elements = new Map<string, any>()
  const handlers: Record<string, (event?: unknown) => void> = {}
  const commands: unknown[][] = []
  const element = (id: string) => {
    if (!elements.has(id)) elements.set(id, {
      textContent: '', className: '', disabled: false,
      addEventListener: (name: string, callback: (event?: unknown) => void) => { if (name === 'click') handlers[id] = callback },
    })
    return elements.get(id)
  }
  const document = { getElementById: element, documentElement: { lang: '' } }
  const Fremkit = {
    locale,
    settings: { connection: 'translation', favorites: ['en', 'fr'], ...settings },
    t: (value: any, params: Record<string, unknown> = {}) => {
      const selected = typeof value === 'string' ? value : value[locale] || value.en
      return selected.replace(/\{(\w+)\}/g, (_match: string, key: string) => String(params[key] ?? ''))
    },
    whenReady: (callback: () => void) => callback(),
    sendCommand: async (...args: unknown[]) => { commands.push(args); return result },
    onLocale: () => {},
    onSettings: () => {},
  }
  runInNewContext(script, { document, Fremkit, Promise, Array, Number, String })
  return { elements, handlers, commands }
}

describe('Translate Selection widget', () => {
  it('requires a first-run pair and explains the explicit selected-text action', () => {
    const widget = load({ favorites: [] })
    expect(widget.elements.get('status').textContent).toContain('Choose exactly two favorite languages')
    expect(widget.elements.get('note').textContent).toContain('only the selected text is sent to the connection’s AI provider')
    expect(widget.elements.get('note').textContent).toContain('clipboard stays unchanged')
  })

  it('sends only the selected pair command and renders the returned translation', async () => {
    const widget = load()
    widget.handlers.translate()
    await Promise.resolve(); await Promise.resolve(); await Promise.resolve()
    expect(widget.commands).toEqual([['openai-shellsmith:translation', 'translateSelection', { favorites: ['en', 'fr'] }]])
    expect(widget.elements.get('status').textContent).toBe('Bonjour')
  })

  it('shows secure-selection and language-mismatch results without exposing source text', async () => {
    for (const [error, expected] of [['secure-field', 'Translation is disabled in secure fields'], ['language-not-favorite', 'does not match either favorite']] as const) {
      const widget = load({}, { ok: false, error })
      widget.handlers.translate()
      await Promise.resolve(); await Promise.resolve(); await Promise.resolve()
      expect(widget.elements.get('status').textContent).toContain(expected)
      expect(widget.elements.get('status').textContent).not.toContain('private-test')
    }
  })
})
