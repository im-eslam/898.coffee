import { useState } from "react";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Tag,
  TagGroup,
  TagList,
  Text,
} from "react-aria-components";
import { Icon } from "@/shared/icons";
import { useStrings } from "@/shared/i18n";
import { fill, strings } from "../strings";
import { ui } from "../ui";

const styles = {
  root: "flex flex-col gap-2",
  tags: "flex flex-wrap gap-2",
  tag: "inline-flex min-h-9 items-center gap-1 rounded-full border border-slate-300 bg-slate-50 py-1 pr-1 pl-3 text-small text-slate-800 outline-none data-[focus-visible]:outline-2 data-[focus-visible]:outline-brand",
  tagBroken: "border-error/50 bg-error/5 text-error",
  remove:
    "inline-flex size-7 items-center justify-center rounded-full text-slate-500 outline-none data-[hovered]:bg-slate-200 data-[focus-visible]:outline-2 data-[focus-visible]:outline-brand",
  broken: "text-small text-error",
  empty: "text-small text-slate-500",
  field: "flex flex-col gap-1.5",
  inputWrap: "relative",
} as const;

export interface RefOption {
  id: string;
  label: string;
}

interface RefPickerProps {
  label: string;
  options: RefOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  hint?: string;
  brokenLabel?: string;
}

export function RefPicker({
  label,
  options,
  value,
  onChange,
  hint,
  brokenLabel,
}: RefPickerProps) {
  const s = useStrings(strings);
  const [text, setText] = useState("");
  const labelById = new Map(options.map((option) => [option.id, option.label]));
  const available = options.filter((option) => !value.includes(option.id));

  const items = value.map((id) => ({
    id,
    label: labelById.get(id) ?? id,
    broken: !labelById.has(id),
  }));

  return (
    <div className={styles.root}>
      <TagGroup
        aria-label={label}
        onRemove={(keys) => onChange(value.filter((id) => !keys.has(id)))}
      >
        <Label className={ui.label}>{label}</Label>
        <TagList
          className={styles.tags}
          items={items}
          renderEmptyState={() => (
            <span className={styles.empty}>{s.common.none}</span>
          )}
        >
          {(item) => (
            <Tag
              id={item.id}
              textValue={item.label}
              className={`${styles.tag} ${item.broken ? styles.tagBroken : ""}`}
            >
              <span>
                {item.label}
                {item.broken ? ` — ${brokenLabel ?? s.common.willBeRemoved}` : ""}
              </span>
              <Button
                slot="remove"
                className={styles.remove}
                aria-label={fill(s.editor.removeItem, { name: item.label })}
              >
                <Icon name="close" className="size-4" />
              </Button>
            </Tag>
          )}
        </TagList>
      </TagGroup>

      <ComboBox
        aria-label={fill(s.common.add, {})}
        className={styles.field}
        items={available}
        selectedKey={null}
        inputValue={text}
        onInputChange={setText}
        menuTrigger="focus"
        onSelectionChange={(key) => {
          if (typeof key === "string") {
            onChange([...value, key]);
            setText("");
          }
        }}
      >
        <div className={styles.inputWrap}>
          <Input className={ui.input} placeholder={s.editor.pickerPlaceholder} />
        </div>
        {hint ? (
          <Text slot="description" className={ui.sub}>
            {hint}
          </Text>
        ) : null}
        <Popover className={ui.popover}>
          <ListBox className="outline-none">
            {(option: RefOption) => (
              <ListBoxItem
                id={option.id}
                textValue={option.label}
                className={ui.option}
              >
                {option.label}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </ComboBox>
    </div>
  );
}
