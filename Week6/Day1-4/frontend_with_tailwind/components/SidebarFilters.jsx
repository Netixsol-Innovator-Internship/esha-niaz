"use client";
import { useRouter, useSearchParams } from "next/navigation";

const TYPES = ["jeans", "shirts", "tshirts", "hoodies", "shorts"];
const STYLES = ["casual", "formal", "party", "gym"];

export default function SidebarFilters({ category }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/productsCat/${category}?${params.toString()}`);
  };

  return (
    <aside className="bg-white border rounded-lg p-4 space-y-6 h-fit sticky top-4 w-56">
      {/* Sale Toggle */}
      <div>
        <h3 className="font-semibold mb-2">Sale</h3>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={searchParams.get("sale") === "true"}
            onChange={(e) =>
              updateFilter("sale", e.target.checked ? "true" : "")
            }
          />
          On Sale
        </label>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="font-semibold mb-2">Type</h3>
        {TYPES.map((t) => (
          <label key={t} className="flex items-center gap-2 capitalize">
            <input
              type="radio"
              name="type"
              checked={searchParams.get("type") === t}
              onChange={() => updateFilter("type", t)}
            />
            {t}
          </label>
        ))}

        {searchParams.get("type") && (
          <button
            onClick={() => updateFilter("type", "")}
            className="text-xs text-blue-600 mt-2"
          >
            Clear type
          </button>
        )}
      </div>

      {/* Style Filter */}
      <div>
        <h3 className="font-semibold mb-2">Style</h3>
        {STYLES.map((s) => (
          <label key={s} className="flex items-center gap-2 capitalize">
            <input
              type="radio"
              name="style"
              checked={searchParams.get("style") === s}
              onChange={() => updateFilter("style", s)}
            />
            {s}
          </label>
        ))}

        {searchParams.get("style") && (
          <button
            onClick={() => updateFilter("style", "")}
            className="text-xs text-blue-600 mt-2"
          >
            Clear style
          </button>
        )}
      </div>
    </aside>
  );
}
