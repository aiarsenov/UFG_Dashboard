"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  email: string;
  fio: string | null;
  created_at: string;
  banned: boolean;
  approved: boolean;
  isAdmin: boolean;
}

export default function DashboardContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setStatus("Ошибка загрузки пользователей");
      }
    } catch (error) {
      setStatus("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  }

  async function handleBanUser(userId: string, email: string, currentBanned: boolean) {
    if (!confirm(`Вы уверены, что хотите ${currentBanned ? "разблокировать" : "заблокировать"} пользователя ${email}?`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, banned: !currentBanned }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Пользователь ${currentBanned ? "разблокирован" : "заблокирован"}!`);
        loadUsers();
      } else {
        setStatus(`Ошибка: ${data.error || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      setStatus("Ошибка при изменении статуса пользователя");
    }
  }

  async function handleApproveUser(userId: string, email: string) {
    if (!confirm(`Одобрить регистрацию пользователя ${email}?`)) {
      return;
    }

    try {
      const response = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`Пользователь ${email} одобрен! Ему отправлено уведомление на email.`);
        loadUsers();
      } else {
        setStatus(`Ошибка: ${data.error || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      setStatus("Ошибка при одобрении пользователя");
    }
  }

  return (
    <div className="space-y-6">
      {status && (
        <div className={`p-4 rounded-md ${status.includes("Ошибка") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {status}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Все пользователи</h2>
        {loading ? (
          <p>Загрузка...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-600">Пользователи не найдены</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ФИО</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Роль</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Дата регистрации</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Одобрен</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Статус</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.fio || "Не указано"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${user.isAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                        {user.isAdmin ? "Админ" : "Пользователь"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(user.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${user.approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                        {user.approved ? "Да" : "Нет"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${user.banned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                        {user.banned ? "Заблокирован" : "Активен"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-2">
                        {!user.approved && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveUser(user.id, user.email)}
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          variant={user.banned ? "default" : "destructive"}
                          size="sm"
                          onClick={() => handleBanUser(user.id, user.email, user.banned)}
                        >
                          {user.banned ? "Разблокировать" : "Заблокировать"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

