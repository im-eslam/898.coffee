import type { MenuDraft } from "./draft";

export type MenuRecipe = (current: MenuDraft) => MenuDraft;

export type IssueScope = string | true;

export interface MenuStore {
  draft: MenuDraft | null;
  update: (recipe: MenuRecipe, scope?: IssueScope) => void;
  reportRemovedPairings: (count: number) => void;
}
