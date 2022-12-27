import { FC, useRef, useEffect, useState, useMemo, FormEvent } from "react";
import s from "./MultiSelector.module.css";
import clsx from "classnames";
import dropdown from "./dropdown.svg";

interface MultiSelectorProps {
  options: string[];
  onChange?: (values: string[]) => void;
}

export const MultiSelector: FC<MultiSelectorProps> = (props) => {
  const { options, onChange } = props;
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

  const [values, setValues] = useState<string[]>([]);
  const valuesSet = useMemo(() => new Set(values), [values]);

  const rootRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  function selectValue(v: string) {
    const newValues = [...values, v];
    setValues(newValues);
    onChange && onChange(newValues);
  }

  function deselectValue(v: string) {
    const newValues = values.filter((cv) => cv !== v);
    setValues(newValues);
    onChange && onChange(newValues);
  }

  function handleOptionClick(v: string) {
    valuesSet.has(v) ? deselectValue(v) : selectValue(v);
  }

  function hanldeInputValueChange(e: FormEvent<HTMLInputElement>) {
    const inputValue = e.currentTarget.value;
    setFilteredOptions(options.filter((v) => v.startsWith(inputValue)));
  }

  function handleInputClick() {
    setOpened(true);
  }

  function handleDropdownBtnClick() {
    setOpened(!opened);
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpened(false);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpened(false);
      }
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className={s.root} ref={rootRef}>
      <div className={clsx(s.selector, { [s.selectorOpened]: opened })}>
        <div className={s.selectorValues}>
          {values.map((v) => (
            <div key={v} className={s.value} onClick={() => deselectValue(v)}>
              {v}
            </div>
          ))}

          <input
            className={s.input}
            onChange={hanldeInputValueChange}
            onClick={handleInputClick}
          />
        </div>

        <div className={s.dropdownBtn} onClick={handleDropdownBtnClick}>
          <img
            alt="dropdown"
            src={dropdown}
            className={clsx(s.dropdownBtnIcon, {
              [s.dropdownBtnIconOpened]: opened,
            })}
          />
        </div>
      </div>

      {opened && (
        <div className={s.dropdown}>
          {filteredOptions.length ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className={clsx(s.option, {
                  [s.optionSelected]: valuesSet.has(option),
                })}
              >
                {option}
              </div>
            ))
          ) : (
            <div className={s.emptyOptions}>No options</div>
          )}
        </div>
      )}
    </div>
  );
};
