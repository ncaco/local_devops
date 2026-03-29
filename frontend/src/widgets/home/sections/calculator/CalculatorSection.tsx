"use client";

import { useMemo, useState } from "react";

type Unit = "mm" | "cm" | "m" | "km";
type EditableField = Unit | "memo";

type Row = {
  id: number;
  memo: string;
  mm: string;
  cm: string;
  m: string;
  km: string;
};

const unitLabels: Record<Unit, string> = {
  mm: "mm",
  cm: "cm",
  m: "m",
  km: "km",
};

const unitKoreanLabels: Record<Unit, string> = {
  mm: "밀리미터",
  cm: "센티미터",
  m: "미터",
  km: "킬로미터",
};

const koreanDigits = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"] as const;
const smallUnitNames = ["", "십", "백", "천"] as const;
const largeUnitNames = ["", "만", "억", "조", "경"] as const;

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 9,
});

const toMillimeters = (unit: Unit, value: number) => {
  if (unit === "mm") return value;
  if (unit === "cm") return value * 10;
  if (unit === "m") return value * 1000;
  return value * 1000000;
};

const formatValue = (value: number) => {
  if (!Number.isFinite(value)) return "";
  return numberFormatter.format(value);
};

const normalizeInput = (value: string) => value.replace(/,/g, "").trim();

const limitDecimalPlaces = (value: string, maxDecimalPlaces: number) => {
  const sign = value.startsWith("-") ? "-" : "";
  const unsigned = sign ? value.slice(1) : value;
  const [integerPart = "", decimalPart] = unsigned.split(".");

  if (decimalPart === undefined) {
    return `${sign}${integerPart}`;
  }

  const trimmedDecimal = decimalPart.slice(0, maxDecimalPlaces);
  return `${sign}${integerPart}.${trimmedDecimal}`;
};

const convertFourDigitsToKorean = (chunk: string) => {
  const padded = chunk.padStart(4, "0");
  let result = "";

  for (let i = 0; i < 4; i += 1) {
    const digit = Number(padded[i]);
    if (digit === 0) continue;

    const unitIndex = 3 - i;
    const unitName = smallUnitNames[unitIndex];
    if (digit === 1 && unitName !== "") {
      result += unitName;
    } else {
      result += `${koreanDigits[digit]}${unitName}`;
    }
  }

  return result;
};

const toKoreanNumberText = (rawValue: string) => {
  const normalized = normalizeInput(rawValue);
  if (normalized === "") return null;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;

  const isNegative = normalized.startsWith("-");
  const unsigned = isNegative ? normalized.slice(1) : normalized;
  const [intPartRaw, decimalPartRaw] = unsigned.split(".");
  const intPart = intPartRaw.replace(/^0+(?=\d)/, "");

  let intResult = "";
  if (intPart === "0") {
    intResult = "영";
  } else {
    const chunks: string[] = [];
    for (let i = intPart.length; i > 0; i -= 4) {
      const start = Math.max(0, i - 4);
      chunks.unshift(intPart.slice(start, i));
    }

    chunks.forEach((chunk, index) => {
      const converted = convertFourDigitsToKorean(chunk);
      if (converted === "") return;

      const largeUnit = largeUnitNames[chunks.length - 1 - index] ?? "";
      intResult += `${converted}${largeUnit}`;
    });
  }

  let decimalResult = "";
  if (decimalPartRaw && decimalPartRaw.length > 0) {
    decimalResult = `점${decimalPartRaw
      .split("")
      .map((digit) => koreanDigits[Number(digit)])
      .join("")}`;
  }

  const signPrefix = isNegative ? "마이너스 " : "";
  return `${signPrefix}${intResult}${decimalResult}`;
};

const fromMillimeters = (mmValue: number): Omit<Row, "id" | "memo"> => ({
  mm: formatValue(mmValue),
  cm: formatValue(mmValue / 10),
  m: formatValue(mmValue / 1000),
  km: formatValue(mmValue / 1000000),
});

const createEmptyRow = (id: number): Row => ({
  id,
  memo: "",
  mm: "",
  cm: "",
  m: "",
  km: "",
});

const createPresetRow = (id: number, unit: Unit, value: number, memo: string): Row => ({
  id,
  memo,
  ...fromMillimeters(toMillimeters(unit, value)),
});

export default function CalculatorSection() {
  const [rows, setRows] = useState<Row[]>([
    createPresetRow(1, "cm", 10, "테스트1"),
    createPresetRow(2, "cm", 100, "테스트2"),
    createPresetRow(3, "cm", 1000, "테스트3"),
  ]);
  const [nextRowId, setNextRowId] = useState(4);
  const [feedback, setFeedback] = useState("");
  const [lastEdited, setLastEdited] = useState<{ rowId: number; field: EditableField } | null>(null);
  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([]);

  const filledRows = useMemo(
    () => rows.filter((row) => row.memo !== "" || row.mm !== "" || row.cm !== "" || row.m !== "" || row.km !== ""),
    [rows],
  );

  const setFeedbackWithTimeout = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(""), 2200);
  };

  const onChangeValue = (rowId: number, unit: Unit, nextValue: string) => {
    setLastEdited({ rowId, field: unit });
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id !== rowId) return row;

        const normalized = normalizeInput(nextValue);
        const isNumericInput = /^-?\d*\.?\d*$/.test(normalized);

        if (normalized === "") {
          return { ...row, mm: "", cm: "", m: "", km: "" };
        }

        if (!isNumericInput) {
          return { ...row, [unit]: nextValue };
        }

        const limited = limitDecimalPlaces(normalized, 3);
        const isIntermediateDecimal =
          limited === "-" || limited === "." || limited === "-." || /^-?\d+\.$/.test(limited);
        if (isIntermediateDecimal) {
          return { ...row, [unit]: limited };
        }

        const parsed = Number(limited);
        if (!Number.isFinite(parsed)) {
          return { ...row, [unit]: nextValue };
        }

        const mmValue = toMillimeters(unit, parsed);
        return { id: row.id, memo: row.memo, ...fromMillimeters(mmValue) };
      }),
    );
  };

  const onChangeMemo = (rowId: number, nextValue: string) => {
    setLastEdited({ rowId, field: "memo" });
    setRows((prevRows) => prevRows.map((row) => (row.id === rowId ? { ...row, memo: nextValue } : row)));
  };

  const addRow = () => {
    setRows((prevRows) => [...prevRows, createEmptyRow(nextRowId)]);
    setNextRowId((prev) => prev + 1);
  };

  const removeRow = (rowId: number) => {
    setRows((prevRows) => (prevRows.length === 1 ? prevRows : prevRows.filter((row) => row.id !== rowId)));
    setExpandedRowIds((prev) => prev.filter((id) => id !== rowId));
  };

  const toggleRowExpand = (rowId: number) => {
    setExpandedRowIds((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
  };

  const toTableText = () => {
    const header = ["No", "Memo", "mm", "cm", "m", "km"].join("\t");
    const lines = filledRows.map((row, index) => [String(index + 1), row.memo, row.mm, row.cm, row.m, row.km].join("\t"));
    return [header, ...lines].join("\n");
  };

  const copyTableText = async () => {
    if (filledRows.length === 0) {
      setFeedbackWithTimeout("복사할 데이터가 없습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(toTableText());
      setFeedbackWithTimeout("표 텍스트를 복사했습니다.");
    } catch {
      setFeedbackWithTimeout("텍스트 복사에 실패했습니다.");
    }
  };

  const drawTableImage = () => {
    const columns: Unit[] = ["mm", "cm", "m", "km"];
    const indexWidth = 56;
    const memoWidth = 260;
    const cellWidth = 170;
    const headerHeight = 44;
    const rowHeight = 40;
    const tableWidth = indexWidth + memoWidth + columns.length * cellWidth;
    const tableHeight = headerHeight + filledRows.length * rowHeight;
    const dpr = window.devicePixelRatio || 1;

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(tableWidth * dpr);
    canvas.height = Math.floor(tableHeight * dpr);
    canvas.style.width = `${tableWidth}px`;
    canvas.style.height = `${tableHeight}px`;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.scale(dpr, dpr);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, tableWidth, tableHeight);

    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, tableWidth, headerHeight);

    context.strokeStyle = "#cbd5e1";
    context.lineWidth = 1;

    const verticalLines = [0.5, indexWidth + 0.5, indexWidth + memoWidth + 0.5];
    for (let i = 1; i <= columns.length; i += 1) {
      verticalLines.push(indexWidth + memoWidth + i * cellWidth + 0.5);
    }
    verticalLines.forEach((lineX) => {
      context.beginPath();
      context.moveTo(lineX, 0);
      context.lineTo(lineX, tableHeight);
      context.stroke();
    });

    for (let y = 0; y <= filledRows.length + 1; y += 1) {
      const lineY = y === 0 ? 0.5 : headerHeight + (y - 1) * rowHeight + 0.5;
      context.beginPath();
      context.moveTo(0, lineY);
      context.lineTo(tableWidth, lineY);
      context.stroke();
    }

    context.font = "600 13px Pretendard, sans-serif";
    context.fillStyle = "#0f172a";
    context.textBaseline = "middle";
    context.fillText("No", 16, headerHeight / 2);
    context.fillText("Memo", indexWidth + 12, headerHeight / 2);
    columns.forEach((unit, index) => {
      const x = indexWidth + memoWidth + index * cellWidth + 12;
      context.fillText(unitLabels[unit], x, headerHeight / 2);
    });

    context.font = "400 12px Pretendard, sans-serif";
    context.fillStyle = "#1e293b";
    filledRows.forEach((row, rowIndex) => {
      const centerY = headerHeight + rowIndex * rowHeight + rowHeight / 2;
      context.fillText(String(rowIndex + 1), 16, centerY);
      context.fillText(row.memo || "-", indexWidth + 12, centerY);
      columns.forEach((unit, index) => {
        const x = indexWidth + memoWidth + index * cellWidth + 12;
        context.fillText(row[unit] || "-", x, centerY);
      });
    });

    return canvas;
  };

  const copyTableImage = async () => {
    if (filledRows.length === 0) {
      setFeedbackWithTimeout("복사할 데이터가 없습니다.");
      return;
    }

    const canvas = drawTableImage();
    if (!canvas) {
      setFeedbackWithTimeout("이미지 생성에 실패했습니다.");
      return;
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((nextBlob) => resolve(nextBlob), "image/png");
    });

    if (!blob) {
      setFeedbackWithTimeout("이미지 생성에 실패했습니다.");
      return;
    }

    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setFeedbackWithTimeout("표 이미지를 복사했습니다.");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "length-converter-table.png";
      link.click();
      URL.revokeObjectURL(url);
      setFeedbackWithTimeout("클립보드 미지원: PNG 파일로 다운로드했습니다.");
    } catch {
      setFeedbackWithTimeout("이미지 복사에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white py-8 md:py-10">
      <div className="w-full px-4 pb-4 sm:px-6 md:pb-0 lg:px-10 2xl:px-14">
        <div className="mb-5 md:mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 md:text-xs">Calculator</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900 md:mt-2 md:text-3xl">단위 변환 계산기</h1>
          <p className="mt-2 text-sm text-slate-600">
            길이 단위를 입력하면 같은 행의 단위가 자동 변환됩니다. 모바일에서는 Memo와 mm를 먼저 입력하고 나머지 단위를 펼쳐 편집할 수 있습니다.
          </p>
        </div>

        <div className="mb-5 flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3">
          <button
            type="button"
            className="shrink-0 rounded-lg border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            1. 길이 변환기
          </button>
          <button
            type="button"
            className="shrink-0 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500"
            disabled
          >
            2. 준비중
          </button>
        </div>

        <div className="space-y-3 md:hidden">
          {rows.map((row, index) => {
            const isExpanded = expandedRowIds.includes(row.id);

            return (
              <article key={row.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500">Row {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={rows.length === 1}
                  >
                    삭제
                  </button>
                </div>
                <div className="space-y-2.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Memo
                    <input
                      type="text"
                      value={row.memo}
                      onChange={(event) => onChangeMemo(row.id, event.target.value)}
                      placeholder="메모 입력"
                      className={`mt-1.5 h-10 w-full rounded-md border px-2.5 text-sm text-slate-900 outline-none ring-[var(--primary)] transition focus:border-[var(--primary)] focus:ring-1 ${
                        lastEdited?.rowId === row.id && lastEdited.field === "memo"
                          ? "border-[var(--primary)] bg-sky-50/70"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                  </label>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    <span className="flex items-center justify-between gap-2">
                      <span>mm</span>
                      <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
                        {unitKoreanLabels.mm}
                      </span>
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={row.mm}
                      onChange={(event) => onChangeValue(row.id, "mm", event.target.value)}
                      placeholder="mm"
                      className={`mt-1.5 h-10 w-full rounded-md border px-2.5 text-sm text-slate-900 outline-none ring-[var(--primary)] transition focus:border-[var(--primary)] focus:ring-1 ${
                        lastEdited?.rowId === row.id && lastEdited.field === "mm"
                          ? "border-[var(--primary)] bg-sky-50/70"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {toKoreanNumberText(row.mm) ? (
                      <p className="mt-1 text-[10px] font-medium normal-case tracking-normal text-slate-500">
                        {toKoreanNumberText(row.mm)}
                      </p>
                    ) : null}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRowExpand(row.id)}
                  className="mt-3 h-9 w-full rounded-md border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  {isExpanded ? "단위 접기" : "cm / m / km 펼치기"}
                </button>
                {isExpanded ? (
                  <div className="mt-3 grid grid-cols-1 gap-2.5">
                    {(["cm", "m", "km"] as Unit[]).map((unit) => (
                      <label key={unit} className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                        <span className="flex items-center justify-between gap-2">
                          <span>{unit}</span>
                          <span className="text-[10px] font-medium normal-case tracking-normal text-slate-400">
                            {unitKoreanLabels[unit]}
                          </span>
                        </span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={row[unit]}
                          onChange={(event) => onChangeValue(row.id, unit, event.target.value)}
                          placeholder={unit}
                          className={`mt-1.5 h-10 w-full rounded-md border px-2.5 text-sm text-slate-900 outline-none ring-[var(--primary)] transition focus:border-[var(--primary)] focus:ring-1 ${
                            lastEdited?.rowId === row.id && lastEdited.field === unit
                              ? "border-[var(--primary)] bg-sky-50/70"
                              : "border-slate-200 bg-white"
                          }`}
                        />
                        {toKoreanNumberText(row[unit]) ? (
                          <p className="mt-1 text-[10px] font-medium normal-case tracking-normal text-slate-500">
                            {toKoreanNumberText(row[unit])}
                          </p>
                        ) : null}
                      </label>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
          <table className="min-w-full table-fixed text-sm">
            <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">
              <tr>
                <th className="w-14 border-b border-slate-200 px-3 py-2.5">No</th>
                <th className="w-64 border-b border-slate-200 px-3 py-2.5">Memo</th>
                <th className="border-b border-slate-200 px-3 py-2.5">
                  mm <span className="ml-1 text-[10px] normal-case tracking-normal text-slate-400">{unitKoreanLabels.mm}</span>
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5">
                  cm <span className="ml-1 text-[10px] normal-case tracking-normal text-slate-400">{unitKoreanLabels.cm}</span>
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5">
                  m <span className="ml-1 text-[10px] normal-case tracking-normal text-slate-400">{unitKoreanLabels.m}</span>
                </th>
                <th className="border-b border-slate-200 px-3 py-2.5">
                  km <span className="ml-1 text-[10px] normal-case tracking-normal text-slate-400">{unitKoreanLabels.km}</span>
                </th>
                <th className="w-20 border-b border-slate-200 px-3 py-2.5">행</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id} className="bg-white">
                  <td className="border-b border-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-500">{index + 1}</td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    <input
                      type="text"
                      value={row.memo}
                      onChange={(event) => onChangeMemo(row.id, event.target.value)}
                      placeholder="메모 입력"
                      className={`h-9 w-full rounded-md border px-2.5 text-sm text-slate-900 outline-none ring-[var(--primary)] transition focus:border-[var(--primary)] focus:ring-1 ${
                        lastEdited?.rowId === row.id && lastEdited.field === "memo"
                          ? "border-[var(--primary)] bg-sky-50/70"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                  </td>
                  {(["mm", "cm", "m", "km"] as Unit[]).map((unit) => (
                    <td key={unit} className="border-b border-slate-100 px-3 py-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={row[unit]}
                        onChange={(event) => onChangeValue(row.id, unit, event.target.value)}
                        placeholder={unit}
                        className={`h-9 w-full rounded-md border px-2.5 text-sm text-slate-900 outline-none ring-[var(--primary)] transition focus:border-[var(--primary)] focus:ring-1 ${
                          lastEdited?.rowId === row.id && lastEdited.field === unit
                            ? "border-[var(--primary)] bg-sky-50/70"
                            : "border-slate-200 bg-white"
                          }`}
                      />
                      {toKoreanNumberText(row[unit]) ? (
                        <p className="mt-1 text-[10px] font-medium text-slate-500">{toKoreanNumberText(row[unit])}</p>
                      ) : null}
                    </td>
                  ))}
                  <td className="border-b border-slate-100 px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="h-8 w-full rounded-md border border-slate-200 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={rows.length === 1}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 hidden flex-wrap items-center gap-2 md:flex">
          <button
            type="button"
            onClick={addRow}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
          >
            행 추가
          </button>
          <button
            type="button"
            onClick={copyTableText}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
          >
            표 텍스트 복사
          </button>
          <button
            type="button"
            onClick={copyTableImage}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            표 이미지 복사
          </button>
          {feedback ? <p className="ml-1 text-xs font-medium text-slate-600">{feedback}</p> : null}
        </div>
      </div>

      {feedback ? (
        <p className="fixed right-4 left-4 z-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-700 shadow-sm md:hidden"
          style={{ bottom: "calc(7.75rem + env(safe-area-inset-bottom))" }}
        >
          {feedback}
        </p>
      ) : null}

      <div
        className="fixed right-4 left-4 z-40 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur-sm md:hidden"
        style={{ bottom: "calc(4.25rem + env(safe-area-inset-bottom))" }}
      >
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={addRow}
            className="h-10 rounded-lg border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800"
          >
            행 추가
          </button>
          <button
            type="button"
            onClick={copyTableText}
            className="h-10 rounded-lg border border-slate-300 bg-white px-2 text-[11px] font-semibold text-slate-800"
          >
            텍스트 복사
          </button>
          <button
            type="button"
            onClick={copyTableImage}
            className="h-10 rounded-lg bg-slate-900 px-2 text-[11px] font-semibold text-white"
          >
            이미지 복사
          </button>
        </div>
      </div>
    </div>
  );
}
