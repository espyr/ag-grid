import { useMemo, useCallback, useRef } from "react";
import type { IAfterGuiAttachedParams } from "ag-grid-community";
import type { CustomFilterDisplayProps } from "ag-grid-react";
import { useGridFilterDisplay } from "ag-grid-react";

type Model = string[] | null;

export default function SetFilter(
  props: CustomFilterDisplayProps<any, any, Model>,
) {
  const { state, onStateChange, onAction, api, colDef } = props;

  const refFirst = useRef<HTMLInputElement>(null);
  const refSelectAll = useRef<HTMLInputElement>(null);

  useGridFilterDisplay({
    afterGuiAttached: useCallback((params?: IAfterGuiAttachedParams) => {
      if (!params?.suppressFocus) {
        refFirst.current?.focus();
      }
    }, []),
  });

  const values = useMemo(() => {
    const set = new Set<string>();

    api.forEachNode((node) => {
      const field = colDef.field!;
      const value = node.data?.[field];

      if (value != null) set.add(value);
    });

    return Array.from(set).sort();
  }, [api, colDef.field]);

  const selected = state?.model ?? [];

  const allSelected = selected.length === values.length && values.length > 0;
  const noneSelected = selected.length === 0;
  const partiallySelected = !allSelected && !noneSelected;

  // update indeterminate state
  if (refSelectAll.current) {
    refSelectAll.current.indeterminate = partiallySelected;
  }

  const setModel = (model: Model) => {
    onStateChange({ model });
    onAction?.("apply");
  };

  const toggleValue = (value: string) => {
    let newModel: Model;

    if (selected.includes(value)) {
      newModel = selected.filter((v) => v !== value);
    } else {
      newModel = [...selected, value];
    }

    if (newModel.length === 0) newModel = null;

    setModel(newModel);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setModel(null);
    } else {
      setModel(values);
    }
  };

  return (
    <div style={{ padding: 8, maxHeight: 300, overflowY: "auto" }}>
      <label style={{ display: "block" }}>
        <input
          ref={refSelectAll}
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
        />
        Todo
      </label>
      {values.map((value, index) => (
        <label key={value} style={{ display: "block", margin: "8px" }}>
          <input
            ref={index === 0 ? refFirst : undefined}
            type="checkbox"
            checked={selected.includes(value)}
            onChange={() => toggleValue(value)}
          />
          {value === "" ? "Sin valor" : value}
        </label>
      ))}
    </div>
  );
}
