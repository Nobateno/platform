import { describe, expect, it } from "vitest";
import { supportedLanguages } from "@/shared/i18n";
import { overviewResources } from "@/domains/overview/i18n";
import { reservationsResources } from "@/domains/reservations/i18n";
import { availabilityResources } from "@/domains/availability/i18n";

type Resource = { [key: string]: string | Resource };

const leafPaths = (resource: Resource, parent = ""): string[] =>
  Object.entries(resource).flatMap(([key, value]) => {
    const path = parent ? `${parent}.${key}` : key;
    return typeof value === "string" ? [path] : leafPaths(value, path);
  });

const leafValues = (resource: Resource): string[] =>
  Object.values(resource).flatMap((value) =>
    typeof value === "string" ? [value] : leafValues(value),
  );

describe("overview, reservations, and availability locale resources", () => {
  it("provides the same non-empty keys for all nine languages", () => {
    for (const resources of [
      overviewResources,
      reservationsResources,
      availabilityResources,
    ]) {
      const expectedPaths = leafPaths(resources.en).sort();
      for (const language of supportedLanguages) {
        const localized = resources[language];
        expect(leafPaths(localized).sort()).toEqual(expectedPaths);
        for (const value of leafValues(localized)) {
          expect(value.trim()).not.toBe("");
        }
      }
    }
  });

  it("keeps the primary English and Persian operations headings localized", () => {
    expect(overviewResources.en.page).toMatchObject({ title: "Today at Nobateno" });
    expect(overviewResources.fa.page).toMatchObject({ title: "امروز در نوبت‌نو" });
    expect(reservationsResources.en.list).toMatchObject({ title: "Appointments" });
    expect(reservationsResources.fa.list).toMatchObject({ title: "نوبت‌ها" });
    expect(availabilityResources.en.page).toMatchObject({ title: "Hours and availability" });
    expect(availabilityResources.fa.page).toMatchObject({ title: "ساعات کاری و ظرفیت" });
  });
});
