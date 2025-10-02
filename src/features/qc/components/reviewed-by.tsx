import { useItemDetailAPI } from "@/shared/hooks/item/use-item-detail";

export default function ReviewedBy({ itemId }: { itemId?: number }) {
  const { data } = useItemDetailAPI(String(itemId));
  const reviewBy = data?.reviews?.[0]?.reviewed_by_user;
  return <p>{reviewBy?.display_name || "-"}</p>;
}
