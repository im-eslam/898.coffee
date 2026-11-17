import { asList, asString, isDict, type AddOn, type RawAddOn, type RawMenuResponse, type RawCategory, type RawPairing } from "@/shared/menu";
import { newUid } from "../util/draft";
import type { DraftAddOn, MenuDraft, MenuIssue } from "../types/draft";

export interface MenuWirePayload extends Omit<
  MenuDraft,
  "addOns" | "categories" | "pairings"
> {
  addOns: AddOn[];
  categories: RawCategory[];
  pairings: RawPairing[];
}

function toAddOns(value: unknown): DraftAddOn[] {
  const entries: AddOn[] = Array.isArray(value)
    ? (value as AddOn[])
    : Object.entries(isDict(value) ? value : {}).map(([id, addOn]) => ({
        id,
        ...(addOn as RawAddOn),
      }));
  return entries.map((addOn) => ({ ...addOn, uid: newUid() }));
}

export class MenuDraftParser {
  static parse(data: Record<string, unknown>): MenuDraft {
    const raw = data as unknown as RawMenuResponse;

    return {
      updatedAt: raw.updatedAt,
      currency: raw.currency,
      badges: raw.badges,
      popup: raw.popup,
      addOns: toAddOns(raw.addOns),
      categories: raw.categories.map((category) => ({
        uid: newUid(),
        id: category.id,
        name: category.name,
        products: category.products.map((product) => ({
          uid: newUid(),
          id: product.id,
          name: product.name,
          description: product.description,
          image: product.image,
          availability: product.availability,
          badge: product.badge,
          addOns: [...product.addOns],
          baristaWay: [...(product.baristaWay ?? [])],
          oftenOrderedWith: [...product.oftenOrderedWith],
          pricing: {
            type: product.pricing.type,
            options: product.pricing.options.map((option) => ({
              ...option,
              uid: newUid(),
            })),
          },
        })),
      })),
      signatures: [...raw.signatures],
      pairings: raw.pairings.map((pairing) => ({
        ...pairing,
        items: [...pairing.items],
        uid: newUid(),
      })),
    };
  }

  static toWire(draft: MenuDraft): MenuWirePayload {
    return {
      updatedAt: draft.updatedAt,
      currency: draft.currency,
      badges: draft.badges,
      addOns: draft.addOns.map(({ uid: _uid, ...rest }) => rest),
      categories: draft.categories.map(({ uid: _uid, products, ...cat }) => ({
        ...cat,
        products: products.map(({ uid: _uid, pricing, ...prod }) => ({
          ...prod,
          pricing: {
            type: pricing.type,
            options: pricing.options.map(({ uid: _uid, ...opt }) => opt),
          },
        })),
      })),
      signatures: draft.signatures,
      pairings: draft.pairings.map(({ uid: _uid, ...rest }) => rest),
      popup: draft.popup,
    };
  }

  static parseIssues(value: unknown): MenuIssue[] {
    return asList(value).flatMap((entry) => {
      if (!isDict(entry)) return [];
      return [
        {
          path: asString(entry.path),
          code: asString(entry.code),
          message: asString(entry.message),
        },
      ];
    });
  }
}
