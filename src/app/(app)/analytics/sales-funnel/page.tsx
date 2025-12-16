import { DatalensEmbed } from "@/components/analytics/DatalensEmbed";

export default function Page() {
    // Используем новый embedId для "Воронка продаж"
    // ID: zjs2yflaga3ij
    return (
        <div className="bg-white min-h-full flex-grow p-4 flex flex-col">
            <DatalensEmbed embedId="zjs2yflaga3ij" />
        </div>
    );
}
