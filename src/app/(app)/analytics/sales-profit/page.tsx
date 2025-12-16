import { DatalensEmbed } from "@/components/analytics/DatalensEmbed";

export default function Page() {
    return (
        <div className="bg-white min-h-full flex-grow p-4 flex flex-col">
            <DatalensEmbed dashboardId="6f18iqgzdbcqr-ufg-prodazhi-i-pribyl" />
        </div>
    );
}
