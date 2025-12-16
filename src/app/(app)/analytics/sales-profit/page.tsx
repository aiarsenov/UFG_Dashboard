import { DatalensEmbed } from "@/components/analytics/DatalensEmbed";

export default function Page() {
    // Используем новый embedId для "Продажи и прибыль"
    // ID: 6qz9vl9990isq
    return (
        <div className="bg-white min-h-full flex-grow p-4 flex flex-col">
            <DatalensEmbed embedId="6qz9vl9990isq" />
        </div>
    );
}
