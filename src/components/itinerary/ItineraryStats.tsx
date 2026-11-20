import { getTranslations } from "next-intl/server";
import { durationParts, formatKm } from "@/lib/format";
import { IconClock, IconMountain, IconPin, IconRoute } from "@/components/ui/icons";

export async function formatDuration(min: number) {
  const t = await getTranslations("itinerary");
  const { h, m } = durationParts(min);
  return h > 0 ? t("hours", { h, m }).trim() : t("minutes", { count: m });
}

export async function ItineraryStats({
  durationMin,
  lengthM,
  difficulty,
  stops,
  locale,
  variant = "compact",
}: {
  durationMin: number;
  lengthM: number;
  difficulty: "facile" | "media" | "impegnativa";
  stops: number;
  locale: string;
  variant?: "compact" | "large";
}) {
  const t = await getTranslations("itinerary");
  const td = await getTranslations("difficulty");
  const items = [
    { icon: IconClock, label: t("duration"), value: await formatDuration(durationMin) },
    { icon: IconRoute, label: t("length"), value: formatKm(lengthM, locale) },
    { icon: IconMountain, label: t("difficulty"), value: td(difficulty) },
    { icon: IconPin, label: null, value: t("stops", { count: stops }) },
  ];
  if (variant === "large") {
    return (
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-pietra-200 sm:grid-cols-4">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={value} className="bg-white p-4">
            <dt className="flex items-center gap-1.5 text-xs text-pietra-500">
              <Icon size={15} /> {label ?? t("chapters")}
            </dt>
            <dd className="mt-1 font-serif text-xl text-pietra-900">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <ul className="flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-pietra-600">
      {items.map(({ icon: Icon, label, value }) => (
        <li key={value} className="inline-flex items-center gap-1">
          <Icon size={15} />
          {label && <span className="sr-only">{label}:</span>}
          {value}
        </li>
      ))}
    </ul>
  );
}
