"use client";

import { Calendar, Grid3x3, List, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const metrics = [
  { label: "Объем продаж", value: "96 919", unit: "ед.", note: "доля от общего 100%" },
  { label: "Выручка", value: "175 599 954", unit: "руб.", note: "доля от общего 100%" },
  { label: "Средняя цена", value: "1 812", unit: "руб.", note: "доля от общего 100%" },
  { label: "Net выручка", value: "136 311 315", unit: "руб.", note: "доля от общего 100%" },
  { label: "Доля net выручки", value: "67.3", unit: "%", note: "доля от общего 100%" },
  { label: "Контрибуционная прибыль", value: "115 763 536", unit: "руб.", note: "доля от общего 100%" },
];

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      {/* Фильтры */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-4">
        <Select defaultValue="period">
          <SelectTrigger className="w-[280px]">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            <SelectValue>Период 01.11.2024 - 30.11.2024</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="period">Период 01.11.2024 - 30.11.2024</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="day">
          <SelectTrigger className="w-[200px]">
            <SelectValue>Гранулярность День</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">День</SelectItem>
            <SelectItem value="week">Неделя</SelectItem>
            <SelectItem value="month">Месяц</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="ml-auto">
          <RotateCcw className="h-4 w-4 mr-2" />
          Сбросить фильтры
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Карточки метрик */}
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="bg-white">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {metric.value} <span className="text-lg text-gray-500">{metric.unit}</span>
              </div>
              <div className="text-xs text-gray-500">{metric.note}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Графики */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* График 1: Сводные показатели */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Сводные показатели</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                <p className="text-gray-400">График (комбинированный: столбцы + линия)</p>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">Показатель 1 (левая ось Y - гистограмма)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                  <span className="text-gray-700">Показатель 2 (правая ось Y - график)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* График 2: Детализация */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Детализация</h3>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                <p className="text-gray-400">График (комбинированный: столбцы + линии)</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                  <span className="text-gray-700">MR BIGMAN</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-transparent"></div>
                  <span className="text-gray-700">TRUE BALANCE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-transparent"></div>
                  <span className="text-gray-700">Бест Трикотаж</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-300"></div>
                  <span className="text-gray-700">Дисконт Центр</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
                  <span className="text-gray-700">Смешные цены</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Детализация справа */}
        <div className="space-y-4">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex gap-4 mb-4 border-b">
                <button className="pb-2 px-2 text-sm font-semibold text-[#ff6a2b] border-b-2 border-[#ff6a2b]">
                  Тренд
                </button>
                <button className="pb-2 px-2 text-sm text-gray-600 hover:text-gray-900">
                  Структура
                </button>
              </div>
              <div className="space-y-4">
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                  <p className="text-xs text-gray-400">График тренда 1</p>
                </div>
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                  <p className="text-xs text-gray-400">График тренда 2</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-700"></div>
                  <span>Показатель Объем продаж, ед.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full border border-blue-500 bg-transparent"></div>
                  <span>Показатель Средняя цена, руб.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
