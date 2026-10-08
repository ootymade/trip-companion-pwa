// AI Concierge — Supabase Edge Function (Deno runtime).
//
// Proxies chat requests to an LLM so no provider key ever touches the
// client. Grounds every answer in OotyMade's own verified content tables
// instead of letting the model answer from general knowledge — per the
// app's non-negotiable rule that the concierge must never invent prices,
// timings, permit rules or safety information.
//
// Shared across every front door (native app, PWA, WhatsApp agent) — one
// retrieval + grounding implementation, not a separate chat brain per
// channel.
//
// Provider: set via the AI_PROVIDER secret.
//   - "anthropic" (default, production) — needs ANTHROPIC_API_KEY.
//   - "openai_compatible" (for testing against a free-tier model) — needs
//     OPENAI_COMPATIBLE_API_KEY, OPENAI_COMPATIBLE_BASE_URL and
//     OPENAI_COMPATIBLE_MODEL. Any provider exposing an OpenAI-style
//     /chat/completions endpoint works (e.g. Groq, OpenRouter, Together).
// Switching providers is a secrets change, not a code change.
//
// To finish activating for production: `supabase secrets set
// ANTHROPIC_API_KEY=...` (SUPABASE_URL / SUPABASE_ANON_KEY /
// SUPABASE_SERVICE_ROLE_KEY are auto-injected by the Supabase runtime.)

import { createClient } from 'npm:@supabase/supabase-js@2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SUPPORT_URL = 'https://tourism.ootymade.com';

// Hard caps so a bot cannot run up provider costs even if it finds the
// endpoint and hammers it directly.
const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_OUTPUT_TOKENS = 512;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_SECONDS = 60;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface RequestBody {
  message: string;
  history?: ChatMessage[];
  language?: 'en' | 'ta';
}

// ---------------------------------------------------------------------------
// Provider adapter — the only part that changes between "testing with a
// free-tier model" and "production on Claude".
// ---------------------------------------------------------------------------

interface LlmRequest {
  system: string;
  messages: ChatMessage[];
  maxTokens: number;
}

class ProviderConfigError extends Error {}

async function callAnthropic(req: LlmRequest): Promise<string> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new ProviderConfigError('ANTHROPIC_API_KEY is not set.');

  // Fast, inexpensive model — a good fit for a grounded Q&A concierge.
  // Check anthropic.com/pricing for the current recommended model before
  // relying on this in production; model IDs are periodically retired.
  const model = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-haiku-4-5-20251001';

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: req.maxTokens,
      system: req.system,
      messages: req.messages,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.type === 'text' ? data.content[0].text : '';
}

async function callOpenAiCompatible(req: LlmRequest): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_COMPATIBLE_API_KEY');
  const baseUrl = Deno.env.get('OPENAI_COMPATIBLE_BASE_URL');
  const model = Deno.env.get('OPENAI_COMPATIBLE_MODEL');
  if (!apiKey || !baseUrl || !model) {
    throw new ProviderConfigError(
      'OPENAI_COMPATIBLE_API_KEY, OPENAI_COMPATIBLE_BASE_URL and OPENAI_COMPATIBLE_MODEL must all be set.'
    );
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: req.maxTokens,
      messages: [{ role: 'system', content: req.system }, ...req.messages],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI-compatible provider error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

async function callLlm(req: LlmRequest): Promise<string> {
  const provider = Deno.env.get('AI_PROVIDER') ?? 'anthropic';
  if (provider === 'openai_compatible') return callOpenAiCompatible(req);
  if (provider === 'anthropic') return callAnthropic(req);
  throw new ProviderConfigError(`Unknown AI_PROVIDER "${provider}".`);
}

// ---------------------------------------------------------------------------
// Grounding — fetch verified content and build the system prompt.
// ---------------------------------------------------------------------------

function buildSystemPrompt(context: string, language: 'en' | 'ta') {
  const languageInstruction =
    language === 'ta'
      ? 'Respond in Tamil, unless the traveller writes in English — then reply in English.'
      : 'Respond in English, unless the traveller writes in Tamil — then reply in Tamil.';

  return `You are the OotyMade AI Concierge, a helpful, warm, practical assistant for tourists visiting Ooty and the Nilgiris. OotyMade is a 14-year-old local heritage brand — write like someone who has actually lived there, not a generic travel bot.

${languageInstruction}

CRITICAL RULES — do not break these:
1. Answer ONLY using the VERIFIED CONTEXT below for facts like prices, timings, opening hours, E-Pass rules, permit requirements, distances, and safety information. Never invent or guess a specific number, rule, or safety claim that isn't in the context.
2. If the traveller asks something the verified context doesn't cover, say so plainly — something like "I don't have a verified answer for that" — and point them to OotyMade support at ${SUPPORT_URL} rather than guessing.
3. You may use general knowledge for non-factual things: conversation, phrasing, general geography sense, or acknowledging what the traveller said. But any concrete fact about Ooty/the Nilgiris must come from the context.
4. Keep answers short and practical — this is a mobile chat, not an essay. Use the traveller's exact situation (weather, time of day if mentioned) where relevant.
5. Never fabricate a restaurant name, business, or trekking route recommendation — the verified context intentionally omits these where OotyMade hasn't verified them yet; say so and suggest ${SUPPORT_URL} instead.

VERIFIED CONTEXT (the only source for facts in your answer):
${context}`;
}

async function fetchVerifiedContext(supabaseUrl: string, supabaseKey: string): Promise<string> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [{ data: documents }, { data: attractions }, { data: emergencyContacts }, { data: treks }] =
    await Promise.all([
      supabase.from('content_documents').select('id, data, last_verified'),
      supabase
        .from('attractions')
        .select(
          'name, category, region, distance_from_ooty_km, opening_hours, price_adult, price_child, price_note, best_time_of_day, visit_duration_minutes, accessibility_note, why_locals_rate_it'
        ),
      supabase.from('emergency_contacts').select('label, number, description').order('sort_order'),
      // RLS on trek_routes already restricts this to verified rows only —
      // an unverified route simply won't come back, even with the anon key.
      supabase.from('trek_routes').select('name, region, difficulty, distance_km, duration_hours, permit_note, safety_essentials'),
    ]);

  const sections: string[] = [];

  (documents ?? []).forEach((doc: { id: string; data: unknown; last_verified: string }) => {
    sections.push(`### ${doc.id} (last verified ${doc.last_verified})\n${JSON.stringify(doc.data)}`);
  });

  if (attractions?.length) {
    sections.push(`### attractions\n${JSON.stringify(attractions)}`);
  }

  if (emergencyContacts?.length) {
    sections.push(`### emergency_contacts\n${JSON.stringify(emergencyContacts)}`);
  }

  sections.push(
    treks?.length
      ? `### verified_trek_routes\n${JSON.stringify(treks)}`
      : '### verified_trek_routes\nNone published yet — no trekking route has been personally verified by the OotyMade team. Do not recommend any trekking route; direct the traveller to OotyMade support for guided trek options.'
  );

  return sections.join('\n\n');
}

// ---------------------------------------------------------------------------
// Rate limiting — per IP, backed by the ai_concierge_rate_limits table
// (service role only; see migration ai_concierge_rate_limits).
// ---------------------------------------------------------------------------

async function isWithinRateLimit(
  supabaseUrl: string,
  serviceRoleKey: string,
  ip: string
): Promise<boolean> {
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await supabase.rpc('check_ai_concierge_rate_limit', {
    p_ip: ip,
    p_max_requests: RATE_LIMIT_MAX_REQUESTS,
    p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
  });

  if (error) {
    // Fail open on a rate-limit infrastructure error — a tourist asking a
    // genuine question shouldn't be blocked by our own bookkeeping bug.
    console.error('Rate limit check failed:', error.message);
    return true;
  }

  return Boolean(data);
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return jsonResponse(
        { error: 'ai-concierge is not configured — missing Supabase runtime secrets.' },
        500
      );
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const allowed = await isWithinRateLimit(supabaseUrl, supabaseServiceRoleKey, ip);
    if (!allowed) {
      return jsonResponse(
        { error: 'Too many requests — please wait a moment and try again.', supportUrl: SUPPORT_URL },
        429
      );
    }

    const { message, history = [], language = 'en' }: RequestBody = await req.json();

    if (!message || typeof message !== 'string') {
      return jsonResponse({ error: 'message is required' }, 400);
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse({ error: `message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` }, 400);
    }

    const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);
    const context = await fetchVerifiedContext(supabaseUrl, supabaseAnonKey);
    const system = buildSystemPrompt(context, language);

    const reply = await callLlm({
      system,
      messages: [...trimmedHistory, { role: 'user', content: message }],
      maxTokens: MAX_OUTPUT_TOKENS,
    });

    return jsonResponse({ reply, supportUrl: SUPPORT_URL });
  } catch (error) {
    if (error instanceof ProviderConfigError) {
      console.error('ai-concierge provider config error:', error.message);
      return jsonResponse({ error: 'ai-concierge is not configured.' }, 500);
    }
    console.error('ai-concierge error:', error);
    return jsonResponse({ error: 'The AI concierge is temporarily unavailable.', supportUrl: SUPPORT_URL }, 502);
  }
});
