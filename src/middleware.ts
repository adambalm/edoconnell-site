import { defineMiddleware } from 'astro:middleware'

const GATED_PREFIX = '/experiments'
const REALM = 'experiments'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return mismatch === 0
}

function unauthorized(): Response {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}

export const onRequest = defineMiddleware((context, next) => {
  const path = context.url.pathname
  if (!path.startsWith(GATED_PREFIX)) return next()

  const expected = process.env.EXPERIMENTS_PASSWORD
  if (!expected) return unauthorized()

  const header = context.request.headers.get('authorization')
  if (!header?.toLowerCase().startsWith('basic ')) return unauthorized()

  let decoded: string
  try {
    decoded = atob(header.slice(6).trim())
  } catch {
    return unauthorized()
  }

  const sep = decoded.indexOf(':')
  if (sep < 0) return unauthorized()
  const supplied = decoded.slice(sep + 1)

  if (!timingSafeEqual(supplied, expected)) return unauthorized()

  return next()
})
