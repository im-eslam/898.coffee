import { getJson, postJson } from "@/shared/api";
import { withSession } from "../../api";

const REVIEWS_API = "/admin/reviews";

export interface Review {
  id: number;
  name: string;
  contact: string;
  message: string;
  created_at: string;
}

export interface ReviewsPage {
  ok: true;
  items: Review[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ReviewsQuery {
  page: number;
  perPage: number;
  q: string;
}

export function listReviews(query: ReviewsQuery): Promise<ReviewsPage> {
  const params = new URLSearchParams({
    page: String(query.page),
    per_page: String(query.perPage),
  });
  if (query.q) params.set("q", query.q);

  return withSession(() =>
    getJson<ReviewsPage>(`${REVIEWS_API}?${params.toString()}`)
  );
}

export function deleteReviews(
  ids: number[]
): Promise<{ ok: true; deleted: number }> {
  return withSession(() =>
    postJson<{ ok: true; deleted: number }>(`${REVIEWS_API}/delete`, { ids })
  );
}
