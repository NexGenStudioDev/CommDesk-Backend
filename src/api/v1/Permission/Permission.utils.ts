import { PermissionSchemaType } from "./Permission.model";

class PermissionUtils {
  public normalizePermissions(input: Partial<PermissionSchemaType>[]) {
    try {
      if (!Array.isArray(input))
        throw new TypeError("permissions must be an array");
      return input.map((p) => ({
        name: String(p.name || "").trim(),
        action: (p.action as PermissionSchemaType["action"]) || "read",
        resource: String(p.resource || "").trim(),
        description: p.description ? String(p.description) : undefined,
        level: typeof p.level === "number" ? this.clampLevel(p.level) : 0,
      }));
    } catch (err) {
      throw err;
    }
  }

  public dedupeByResource(perms: PermissionSchemaType[]) {
    try {
      const map = new Map<string, PermissionSchemaType>();
      for (const p of perms) {
        if (!p || !p.resource) continue;
        const key = p.resource;
        const existing = map.get(key);
        if (!existing) map.set(key, p);
        else if ((p.level || 0) > (existing.level || 0)) map.set(key, p);
      }
      return Array.from(map.values());
    } catch (err) {
      throw err;
    }
  }

  public clampLevel(level?: number) {
    try {
      if (typeof level !== "number" || Number.isNaN(level)) return 0;
      if (level <= 0) return 0;
      if (level >= 100) return 100;
      return Math.floor(level);
    } catch (err) {
      throw err;
    }
  }

  public matches(
    p: PermissionSchemaType,
    opts: { name?: string; resource?: string; minLevel?: number } = {},
  ) {
    try {
      const { name, resource, minLevel = 0 } = opts;
      if (name && p.name !== name) return false;
      if (resource && p.resource !== resource) return false;
      if ((p.level || 0) < this.clampLevel(minLevel)) return false;
      return true;
    } catch (err) {
      throw err;
    }
  }
}

export let permissionUtils = new PermissionUtils();
