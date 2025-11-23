"use client";

import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  email: string;
  fio: string | null;
  created_at: string;
}

export default function AdminContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fio: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("Пользователь успешно создан!");
        setFormData({ fio: "", email: "", password: "" });
        loadUsers();
      } else {
        setStatus(`Ошибка: ${data.error || "Неизвестная ошибка"}`);
      }
    } catch (error) {
      setStatus("Ошибка при создании пользователя");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Создать пользователя</h2>
        <form onSubmit={handleCreateUser} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm text-gray-600 mb-1">ФИО</label>
            <input
              required
              type="text"
              value={formData.fio}
              onChange={(e) => setFormData({ ...formData, fio: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Иванов Иван Иванович"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="user@example.com"
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Пароль</label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-md border px-3 py-2"
              placeholder="••••••••"
              disabled={submitting}
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Создание..." : "Создать пользователя"}
          </Button>
          {status && (
            <p className={`text-sm ${status.includes("Ошибка") ? "text-red-600" : "text-green-600"}`}>
              {status}
            </p>
          )}
        </form>
      </div>

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
                  <th className="border border-gray-300 px-4 py-2 text-left">Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.fio || "Не указано"}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {new Date(user.created_at).toLocaleDateString("ru-RU")}
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

