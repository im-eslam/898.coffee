import { type MenuState, useData } from "./hooks/use-data";
import { SearchOverlay } from "./components/overlays/search-overlay";

// Using the same config approach you have in your hooks
const searchStrings = {
  label: "Search menu",
  placeholder: "Search for items...",
  clear: "Clear search",
  close: "Close search",
  prompt: "Type to search our menu",
  noMatch: (query: string) => `No results found for "${query}"`,
  itemsCount: (count: number) => `${count} items found`,
  groupCategories: "Categories",
  groupOffers: "Offers",
  groupItems: "Items",
};

export function MenuPage() {
  const result = useData();

  if (result.status === "loading") {
    return <div className="p-8">Loading menu...</div>;
  }

  if (result.status === "error") {
    return (
      <div className="p-8">
        <p className="mb-4 text-red-600">
          {result.isNetworkError
            ? "Network error. Please check your connection."
            : "Something went wrong loading the menu."}
        </p>
        <button
          className="rounded bg-navy px-4 py-2 text-white"
          onClick={result.retry}
        >
          Retry
        </button>
      </div>
    );
  }

  return <MenuContent result={result} />;
}

// Separating the content prevents hooks like useState from running conditionally
function MenuContent({
  result,
}: {
  result: Extract<MenuState, { status: "ready" }>;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { menu } = result;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Menu Loaded</h1>

      <div className="mb-4">
        <p>Categories: {menu.categories.length}</p>
        <p>Products: {Object.keys(menu.productMap).length}</p>
        <p>Pairings: {menu.pairings.length}</p>
      </div>

      <button
        className="rounded bg-navy px-4 py-2 text-white"
        onClick={() => setIsSearchOpen(true)}
      >
        Open Search Overlay
      </button>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        menu={menu}
        locale="en"
        strings={searchStrings}
        formatMoney={(value) => `${value.toFixed(2)} ${menu.currency}`}
        onPickCategory={(id) => {
          console.log("Category selected:", id);
          setIsSearchOpen(false);
        }}
        onPickPairing={(pairing) => {
          console.log("Pairing selected:", pairing.id);
          setIsSearchOpen(false);
        }}
        onPickProduct={(product) => {
          console.log("Product selected:", product.name.en);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}

// React hooks must be imported
import { useState } from "react";
