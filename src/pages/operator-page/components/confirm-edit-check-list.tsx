export default function ConfirmEditChecklist() {
  return (
    <div className="p-4 space-y-2 border rounded-md">
      <p>การยืนยันการแก้ไขข้อบกพร่องนี้ คุณยืนยันว่าได้:</p>
      <ul className="list-disc list-inside">
        <li>ตรวจสอบรายละเอียด Defect แล้ว</li>
        <li>ดำเนินการแก้ไขแล้ว</li>
      </ul>
    </div>
  );
}
