import { useQueryState } from "nuqs";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TABS } from "../constants/tabs";

export default function TabsCard() {
  const [tabs, setTabs] = useQueryState("tabs", {
    defaultValue: TABS[0].value,
  });
  return (
    <Tabs defaultValue={tabs} className="w-full" onValueChange={setTabs}>
      <TabsList className="w-full h-auto text-white bg-primary">
        {TABS.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex w-1/2 py-2"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
