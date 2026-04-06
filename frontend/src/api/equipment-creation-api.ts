import { apiFetch } from "../auth/client";
import { resolveCollectionId } from "../config/collection-mapping";

export interface EquipmentCreationValues {
  title: string;
  acronym: string;
  internalId: string;
  ownerOu: string;
  ownerRp: string;
  description: string;
}

function makeMeta(value: string, authority?: string | null) {
  return {
    value,
    language: null,
    authority: authority ?? null,
    confidence: authority ? 600 : -1,
    place: 0,
  };
}

export async function createEquipmentWorkspaceItem(
  values: EquipmentCreationValues,
): Promise<number> {
  const collectionId = await resolveCollectionId("Equipment");

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );

  const newId: number = created?.id;
  if (!newId) throw new Error("Workspace item creation failed.");

  const ops: Array<{ op: string; path: string; value: any }> = [];

  const add = (section: string, field: string, raw: string, authority?: string) => {
    const v = raw.trim();
    if (!v) return;
    ops.push({
      op: "add",
      path: `/sections/${section}/${field}`,
      value: [makeMeta(v, authority)],
    });
  };

  add("equipment", "dc.title", values.title);
  add("equipment", "oairecerif.acronym", values.acronym);
  add("equipment", "oairecerif.internalid", values.internalId);
  add("equipment", "crisequipment.ownerou", values.ownerOu);
  add("equipment", "crisequipment.ownerrp", values.ownerRp);
  add("equipment", "dc.description", values.description);

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return newId;
}
