export interface Searchable {
  label: string;
  search: string;
}

export function createSearchFilter(options: readonly Searchable[]) {
  const haystacks = new Map<string, string>();
  for (const option of options) {
    haystacks.set(
      option.label,
      `${option.label} ${option.search}`.toLowerCase()
    );
  }
  return (textValue: string, input: string): boolean => {
    const needle = input.trim().toLowerCase();
    if (needle === "") return true;
    return (haystacks.get(textValue) ?? textValue.toLowerCase()).includes(
      needle
    );
  };
}
