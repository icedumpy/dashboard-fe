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
import { Button } from "@/components/ui/button";
import { Input } from "./input";

import { DATE_FORMAT, TIME_FORMAT } from "@/constants/format";

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

  React.useEffect(() => {
    _setValue(value);
  }, [value]);

  const calendarMonth = Array.isArray(calendarProps?.disabled)
    ? undefined
    : typeof calendarProps?.disabled === "object"
    ? (calendarProps.disabled as { before?: Date; after?: Date })
    : undefined;

  const handleSubmit = React.useCallback(() => {
    onChange?.(_value);
    setOpen(false);
  }, [onChange, _value]);

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
      <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
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
          onSelect={(value) => {
            const date = dayBoundary
              ? dayBoundary === "start"
                ? dayjs(value).startOf("day").toDate()
                : dayjs(value).endOf("day").toDate()
              : value;

            _setValue(date);
          }}
        />
        {time && (
          <div className="p-2 border-t">
            <Input
              type="time"
              id="time-picker"
              step="1"
              onChange={(e) => {
                if (_value) {
                  const [hours, minutes, seconds] = e.target.value
                    .split(":")
                    .map(Number);
                  const newDate = dayjs(_value)
                    .hour(hours)
                    .minute(minutes)
                    .second(seconds)
                    .toDate();
                  _setValue(newDate);
                }
              }}
              defaultValue={
                _value ? dayjs(_value).format(TIME_FORMAT) : undefined
              }
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        )}
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
