import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const url = process.env.WOOCOMMERCE_URL;
const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!url || !consumerKey || !consumerSecret) {
  throw new Error(
    "Faltan variables de entorno de WooCommerce (WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET)."
  );
}

const client = new WooCommerceRestApi({
  url,
  consumerKey,
  consumerSecret,
  version: "wc/v3",
  // Query-string auth only works over HTTPS; over plain HTTP (local dev)
  // WooCommerce requires OAuth1.0a signing, which the client does when this is false.
  queryStringAuth: url.startsWith("https://"),
  axiosConfig: {
    timeout: 20000,
  },
});

type GetResponse = Awaited<ReturnType<typeof client.get>>;

// The backend falls over under concurrent load, so concurrency is capped
// and identical in-flight requests share a single call.
const MAX_CONCURRENT = 2;
let active = 0;
const waiting: (() => void)[] = [];
const inFlight = new Map<string, Promise<GetResponse>>();

async function acquire() {
  if (active < MAX_CONCURRENT) {
    active++;
    return;
  }
  await new Promise<void>((resolve) => waiting.push(resolve));
}

function release() {
  const next = waiting.shift();
  if (next) next();
  else active--;
}

function get(endpoint: string, params: Record<string, unknown> = {}) {
  const key = `${endpoint}?${JSON.stringify(params)}`;
  const existing = inFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    await acquire();
    try {
      return await client.get(endpoint, params);
    } finally {
      release();
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, request);
  return request;
}

export const wooClient = { get };
