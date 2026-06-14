// src/lib/microcms.ts
import { createClient, MicroCMSListResponse } from "microcms-js-sdk";

// 既存のclient定義はそのまま
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

/**
 * microCMSの一覧を安全に取得（最大100件）
 */
export async function fetchListUnder100<T>(
  endpoint: string,
  options?: {
    limit?: number;
    filters?: string;
    orders?: string;
    fields?: string;
    depth?: number;
  }
): Promise<MicroCMSListResponse<T>> {
  const limit = options?.limit ?? 100;

  if (limit < 1 || limit > 100) {
    throw new Error(`limit must be between 1 and 100. received: ${limit}`);
  }

  try {
    const res = await client.getList<T>({
      endpoint,
      queries: {
        limit,
        filters: options?.filters,
        orders: options?.orders,
        fields: options?.fields,
        depth: options?.depth,
      },
    });

    if (res.totalCount > limit) {
      throw new Error(
        `microCMS totalCount (${res.totalCount}) exceeds limit (${limit}). ` +
          `This project expects <= ${limit} items. Consider reducing contents or implement pagination.`
      );
    }

    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error while fetching microCMS.";
    throw new Error(`[microCMS] Failed to fetch list: endpoint=${endpoint} / ${message}`);
  }
}

/**
 * microCMSの一覧を全件取得
 * - microCMSは1回の取得上限が100件
 * - 100件を超える場合は offset を使って複数回取得する
 */
export async function fetchAllList<T>(
  endpoint: string,
  options?: {
    filters?: string;
    orders?: string;
    fields?: string;
    depth?: number;
  }
): Promise<T[]> {
  const limit = 100;
  let offset = 0;
  let allContents: T[] = [];
  let totalCount = 0;

  try {
    do {
      const res = await client.getList<T>({
        endpoint,
        queries: {
          limit,
          offset,
          filters: options?.filters,
          orders: options?.orders,
          fields: options?.fields,
          depth: options?.depth,
        },
      });

      allContents = [...allContents, ...res.contents];
      totalCount = res.totalCount;
      offset += limit;
    } while (allContents.length < totalCount);

    return allContents;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error while fetching microCMS.";
    throw new Error(`[microCMS] Failed to fetch all list: endpoint=${endpoint} / ${message}`);
  }
}
