import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

import type { OptionT } from "@/types/option";

interface MultiSelectProps {
  options: OptionT[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  onSearch?: (search: string) => void;
  showSearch?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
  maxCount = 3,
  showSearch = false,
  //   modalPopover = false,
  //   asChild = false,
  onSearch,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const handleUnselect = React.useCallback(
    (item: string) => {
      onChange(value.filter((i) => i !== item));
    },
    [onChange, value]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = e.target as HTMLInputElement;
      if (input.value === "") {
        if (e.key === "Backspace") {
          onChange(value.slice(0, -1));
        }
      }
    },
    [onChange, value]
  );

  const selectables = React.useMemo(
    () => options.filter((option) => !value?.includes(option.value)),
    [options, value]
  );

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            className
          )}
          onClick={() => setOpen(!open)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {value?.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {value?.length > 0 && (
              <>
                {value?.slice(0, maxCount).map((item) => {
                  const option = options.find(
                    (option) => option.value === item
                  );
                  const IconComponent = option?.icon;
                  return (
                    <Badge
                      variant="secondary"
                      key={item}
                      className="mb-1 mr-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(item);
                      }}
                    >
                      {IconComponent && (
                        <IconComponent className="w-4 h-4 mr-2" />
                      )}
                      {option?.label}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(item);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnselect(item);
                        }}
                      >
                        <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })}
                {value.length > maxCount && (
                  <Badge variant="secondary" className="mb-1 mr-1">
                    +{value.length - maxCount} more
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          {showSearch && (
            <CommandInput
              placeholder="Search..."
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                onSearch?.(value);
              }}
              onKeyDown={handleKeyDown}
            />
          )}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {selectables.map((option) => {
                const IconComponent = option.icon;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange([...(value ?? []), option.value]);
                      setSearch("");
                    }}
                  >
                    <Checkbox checked={value?.includes(option.value)} />
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
              {value?.map((item) => {
                const option = options.find((option) => option.value === item);
                if (!option) return null;
                const IconComponent = option.icon;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      handleUnselect(option.value);
                    }}
                  >
                    <Checkbox checked={value?.includes(option.value)} />
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 mr-2 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
