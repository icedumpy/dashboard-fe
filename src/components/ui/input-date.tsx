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

import { DATE_FORMAT } from "@/contants/format";
interface InputDateProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  calendarProps: {
    disabled?: Matcher | Matcher[];
  };
  format?: string;
}

export function InputDate({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  format = DATE_FORMAT,
  calendarProps,
}: InputDateProps) {
  const [open, setOpen] = React.useState(false);

  const calendarMonth = Array.isArray(calendarProps?.disabled)
    ? undefined
    : typeof calendarProps?.disabled === "object"
    ? (calendarProps.disabled as { before?: Date; after?: Date })
    : undefined;

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
          defaultMonth={value}
          mode="single"
          selected={value}
          captionLayout="dropdown"
          disabled={calendarProps?.disabled}
          startMonth={calendarMonth?.before}
          endMonth={calendarMonth?.after}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
