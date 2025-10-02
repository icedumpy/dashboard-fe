import { useQueryState } from "nuqs";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

import { VIEWER_TABS } from "../constants/viewer-tabs";

export default function ViewerTabs() {
  const [tabs, setTabs] = useQueryState("tab", {
    defaultValue: VIEWER_TABS[0].value,
  });

  const onTabChange = (value: string) => {
    setTabs(value);
  };

  return (
    <Tabs defaultValue={tabs} className="w-full" onValueChange={onTabChange}>
      <TabsList className="w-full h-auto text-white bg-primary">
        {VIEWER_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex w-1/2 py-2"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
