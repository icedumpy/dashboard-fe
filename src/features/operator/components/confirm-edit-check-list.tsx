interface ConfirmChecklistProps {
  variant?: "defect" | "scrap";
}

export default function ConfirmEditChecklist({
  variant = "defect",
}: ConfirmChecklistProps) {
  return (
    <div className="p-4 space-y-2 border rounded-md">
      <p>การยืนยันการแก้ไขข้อบกพร่องนี้ คุณยืนยันว่าได้:</p>
      <ul className="list-disc list-inside">
        <li>
          ตรวจสอบรายละเอียด <span className="capitalize">{variant}</span> แล้ว
        </li>
        <li>ดำเนินการแก้ไขแล้ว</li>
      </ul>
    </div>
  );
}
