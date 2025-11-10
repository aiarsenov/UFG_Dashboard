"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import "./UserMenu.scss";

export default function UserMenu() {
    return (
        <div className="user-menu">
            <Avatar className="user-menu__avatar">
                <AvatarFallback>ИИ</AvatarFallback>
            </Avatar>

            <div className="user-menu__text">
                <div>Иванов Иван Иванович</div>
                <span>ivan@yandex.ru</span>
            </div>
        </div>
    );
}
