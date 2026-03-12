/**
 * POST /api/contact — Contact form submission endpoint.
 *
 * Handles both content types:
 *   - application/x-www-form-urlencoded (native form POST, no-JS path)
 *   - multipart/form-data (FormData from fetch, JS-enhanced path)
 *
 * Spam prevention: honeypot field + timing check.
 * Email delivery: Resend API via direct fetch (zero dependencies).
 */
import type { APIRoute } from 'astro'

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY
const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL

function isFormPost(request: Request): boolean {
  const ct = request.headers.get('content-type') || ''
  return ct.includes('application/x-www-form-urlencoded')
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()
  const isNativeForm = isFormPost(request)

  // Honeypot — if filled, silently accept (don't leak detection to bots)
  const honeypot = formData.get('website')?.toString() || ''
  if (honeypot) {
    if (isNativeForm) return redirect('/contact/?success=true', 303)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Timing check — submissions under 2 seconds are suspicious
  const timestamp = formData.get('timestamp')?.toString()
  if (timestamp) {
    const elapsed = Date.now() - parseInt(timestamp, 10)
    if (elapsed < 2000) {
      if (isNativeForm) return redirect('/contact/?success=true', 303)
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // Extract and validate fields
  const name = formData.get('name')?.toString().trim() || ''
  const email = formData.get('email')?.toString().trim() || ''
  const message = formData.get('message')?.toString().trim() || ''

  if (!name || !email || !message) {
    const errorMsg = 'All fields are required.'
    if (isNativeForm) return redirect(`/contact/?error=${encodeURIComponent(errorMsg)}`, 303)
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!validateEmail(email)) {
    const errorMsg = 'Please enter a valid email address.'
    if (isNativeForm) return redirect(`/contact/?error=${encodeURIComponent(errorMsg)}`, 303)
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Send via Resend API
  if (!RESEND_API_KEY || !CONTACT_EMAIL) {
    console.error('[contact] Missing RESEND_API_KEY or CONTACT_EMAIL env vars')
    const errorMsg = 'Contact form is not configured. Please try again later.'
    if (isNativeForm) return redirect(`/contact/?error=${encodeURIComponent(errorMsg)}`, 303)
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[contact] Resend API error:', res.status, body)
      throw new Error(`Resend API returned ${res.status}`)
    }
  } catch (e) {
    console.error('[contact] Failed to send email:', e)
    const errorMsg = 'Failed to send message. Please try again later.'
    if (isNativeForm) return redirect(`/contact/?error=${encodeURIComponent(errorMsg)}`, 303)
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (isNativeForm) return redirect('/contact/?success=true', 303)
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
