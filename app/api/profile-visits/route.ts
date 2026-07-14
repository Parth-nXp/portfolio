import { NextResponse } from "next/server";

const VISIT_KEY = "portfolio:profile_visits";
const VISIT_BASELINE = 250;

type VisitStore = {
  count: number;
};

const memoryStore = globalThis as typeof globalThis & {
  __portfolioVisits?: VisitStore;
};

function getFallbackStore() {
  if (!memoryStore.__portfolioVisits) {
    memoryStore.__portfolioVisits = { count: 0 };
  }

  return memoryStore.__portfolioVisits;
}

async function redisRequest(command: "get" | "incr") {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const response = await fetch(`${url}/${command}/${VISIT_KEY}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Redis ${command} failed`);
  }

  const payload = (await response.json()) as { result?: number | string | null };
  const value = Number(payload.result ?? 0);

  return Number.isFinite(value) ? value : 0;
}

function withBaseline(count: number) {
  return VISIT_BASELINE + count;
}

export async function GET() {
  try {
    const count = await redisRequest("get");

    if (count !== null) {
      return NextResponse.json({ count: withBaseline(count), source: "persistent", live: true });
    }
  } catch {
    // Fall through to in-memory telemetry if persistent storage is unavailable.
  }

  return NextResponse.json({ count: withBaseline(getFallbackStore().count), source: "session", live: true });
}

export async function POST() {
  try {
    const count = await redisRequest("incr");

    if (count !== null) {
      return NextResponse.json({ count: withBaseline(count), source: "persistent", live: true });
    }
  } catch {
    // Fall through to in-memory telemetry if persistent storage is unavailable.
  }

  const store = getFallbackStore();
  store.count += 1;

  return NextResponse.json({ count: withBaseline(store.count), source: "session", live: true });
}
