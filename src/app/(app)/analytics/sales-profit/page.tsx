import { DatalensEmbed } from "@/components/analytics/DatalensEmbed";

export default function Page() {
    // Используем существующий embedId из настроек DataLens
    // kw1mro94lpou5 - это ID встраивания "UFG-data-iframe"
    return (
        <div className="bg-white min-h-full flex-grow p-4 flex flex-col">
            <DatalensEmbed embedId="kw1mro94lpou5" />
        </div>
    );
}
