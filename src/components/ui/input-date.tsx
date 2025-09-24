import * as React from "react";
import dayjs from "dayjs";
import { Matcher } from "react-day-picker";
import { CalendarIcon, XIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "./scroll-area";

import { DATE_FORMAT } from "@/constants/format";

interface InputDateProps {
  value?: Date;
  time?: boolean;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  calendarProps: {
    disabled?: Matcher | Matcher[];
  };
  format?: string;
  dayBoundary?: "start" | "end";
}

export function InputDate({
  value,
  time,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  format = DATE_FORMAT,
  calendarProps,
  dayBoundary = "start",
}: InputDateProps) {
  const [open, setOpen] = React.useState(false);
  const [_value, _setValue] = React.useState<Date | undefined>();
  const hourRefs = React.useRef<Record<number, HTMLButtonElement | null>>({});
  const minuteRefs = React.useRef<Record<number, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    _setValue(value);
  }, [value]);

  // Scroll to selected hour/minute when popover opens and time is selected
  React.useEffect(() => {
    if (open && time && _value) {
      setTimeout(() => {
        const hourIdx = _value.getHours();
        const minuteIdx = _value.getMinutes();
        const hourBtn = hourRefs.current[hourIdx];
        const minuteBtn = minuteRefs.current[minuteIdx];
        if (hourBtn)
          hourBtn.scrollIntoView({ block: "center", behavior: "smooth" });
        if (minuteBtn)
          minuteBtn.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 100); // Wait for DOM
    }
  }, [open, time, _value]);

  const calendarMonth = Array.isArray(calendarProps?.disabled)
    ? undefined
    : typeof calendarProps?.disabled === "object"
    ? (calendarProps.disabled as { before?: Date; after?: Date })
    : undefined;

  const handleSubmit = React.useCallback(() => {
    onChange?.(_value);
    setOpen(false);
  }, [onChange, _value]);

  const handleTimeChange = React.useCallback(
    (type: "hour" | "minute", val: string) => {
      if (!_value) return;

      let newDate = dayjs(_value);

      if (type === "hour") {
        newDate = newDate.hour(Number(val));
      } else if (type === "minute") {
        newDate = newDate.minute(Number(val));
      }

      _setValue(newDate.toDate());
    },
    [_value]
  );

  const hours = React.useMemo(
    () => Array.from({ length: 24 }, (_, i) => i),
    []
  );
  const minutes = React.useMemo(
    () => Array.from({ length: 60 }, (_, i) => i),
    []
  );

  // Helper to render time buttons
  const renderTimeButtons = (
    values: number[],
    selected: number | undefined,
    onClick: (val: number) => void,
    refs: React.MutableRefObject<Record<number, HTMLButtonElement | null>>
  ) =>
    values.map((val) => (
      <button
        ref={(el) => (refs.current[val] = el)}
        key={val}
        className={buttonVariants({
          size: "icon",
          variant: selected === val ? "default" : "ghost",
          className: "sm:w-full shrink-0 aspect-square",
        })}
        aria-pressed={selected === val}
        onClick={() => onClick(val)}
      >
        {val.toString()}
      </button>
    ));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          id="date"
          disabled={disabled}
          className="justify-between w-full px-3! font-normal group"
        >
          {value ? (
            dayjs(value).format(format)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          {value ? (
            <button
              type="button"
              aria-label="Clear date"
              className="hidden cursor-pointer size-4 group-hover:block"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onChange) {
                  onChange(undefined);
                }
              }}
            >
              <XIcon />
            </button>
          ) : (
            <CalendarIcon />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 mx-4 overflow-hidden" align="start">
        <div className="divide-y sm:flex sm:divide-x">
          <Calendar
            defaultMonth={_value}
            mode="single"
            selected={_value}
            captionLayout="dropdown"
            disabled={calendarProps?.disabled}
            startMonth={calendarMonth?.before}
            endMonth={
              calendarMonth?.after
                ? dayjs(calendarMonth.after).add(1, "M").toDate()
                : undefined
            }
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              let newDate: Date;
              if (_value) {
                // preserve time if already selected
                const hour = _value.getHours();
                const minute = _value.getMinutes();
                newDate = dayjs(selectedDate)
                  .hour(hour)
                  .minute(minute)
                  .second(0)
                  .toDate();
              } else {
                // fallback to boundary logic
                newDate = dayBoundary
                  ? dayBoundary === "start"
                    ? dayjs(selectedDate).startOf("day").toDate()
                    : dayjs(selectedDate).endOf("day").toDate()
                  : selectedDate;
              }
              _setValue(newDate);
            }}
          />
          {time && (
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {renderTimeButtons(
                    hours.reverse(),
                    _value?.getHours(),
                    (val) => handleTimeChange("hour", val.toString()),
                    hourRefs
                  )}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {renderTimeButtons(
                    minutes,
                    _value?.getMinutes(),
                    (val) => handleTimeChange("minute", val.toString()),
                    minuteRefs
                  )}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 p-2 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onChange?.(value);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Ok
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
