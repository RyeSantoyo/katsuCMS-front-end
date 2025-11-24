// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-800">
        {value || "-"}
      </span>
    </div>
  );
}
