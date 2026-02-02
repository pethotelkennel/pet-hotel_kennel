// src/lib/microcms.ts
import { createClient, MicroCMSListResponse } from "microcms-js-sdk";

// 既存のclient定義はそのまま
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

/**
 * microCMSの一覧を安全に取得（最大100件）
 * - limit未指定だと10件しか返らないため必ず指定
 * - 100件を超える場合はエラーにして気づけるようにする
 * - buildログで追えるようにメッセージを整える
 */
export async function fetchListUnder100<T>(
  endpoint: string,
  options?: {
    limit?: number; // 1〜100
    filters?: string;
    orders?: string;
    fields?: string; // "id,title,createdAt" のように指定可
    depth?: number;  // 0〜3（必要なら）
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

    // 「100件以下で運用する」前提なら、100件ぴったりは要注意
    // ＝本当は100件超えている可能性があるので検知して落とす
    if (res.totalCount > limit) {
      throw new Error(
        `microCMS totalCount (${res.totalCount}) exceeds limit (${limit}). ` +
          `This project expects <= ${limit} items. Consider reducing contents or implement pagination.`
      );
    }

    return res;
  } catch (err) {
    // Cloudflare Pagesのビルドログで追いやすい形にする
    const message =
      err instanceof Error ? err.message : "Unknown error while fetching microCMS.";
    throw new Error(`[microCMS] Failed to fetch list: endpoint=${endpoint} / ${message}`);
  }
}
