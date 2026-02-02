import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export async function fetchAll(endpoint) {
  const limit = 100;
  let offset = 0;
  let all = [];
  let totalCount = 0;

  do {
    const res = await client.getList({
      endpoint,
      queries: { limit, offset },
    });
    all = all.concat(res.contents);
    totalCount = res.totalCount;
    offset += limit;
  } while (all.length < totalCount);

  return all;
}  
