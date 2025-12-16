import { DatalensEmbed } from "@/components/analytics/DatalensEmbed";

export default function Page() {
    // Используем новый embedId для "Ключевые показатели"
    // ID: wgpyi46ojpbwg
    return (
        <div className="bg-white min-h-full flex-grow p-4 flex flex-col">
            <DatalensEmbed embedId="wgpyi46ojpbwg" />
        </div>
    );
}
