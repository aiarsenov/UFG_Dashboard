// import { DatalensEmbed } from "@/components/analytics/DatalensEmbed";

// export default function Page() {
//     return (
//         <div className="bg-white min-h-full flex-grow p-4">
//             <DatalensEmbed />
//         </div>
//     );
// }

import NotFound from "@/components/NotFound";

export default function Page() {
    return (
        <div className="p-4 min-h-full bg-white flex-grow">
            <NotFound />
        </div>
    );
}
