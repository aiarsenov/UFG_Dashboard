"use client";

import Develop from "@/assets/icons/develop.svg";

export default function NotFound() {
    return (
        <div className="min-h-full flex justify-center p-10">
            <div className="flex items-center gap-2">
                <h1 className="text-[24px] font-medium">
                    Раздел находится в разработке
                </h1>
                <Develop className="flex-[0_0_35px] w-35px] h-[35px] text-[#8c8b98]" />
            </div>
        </div>
    );
}
