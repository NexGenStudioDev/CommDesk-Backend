# Permission: 0 to Master — API spec

Overview

- Permissions are stored grouped by `userId` in a parent document with a `permission` array.
- Each inner permission object has:
  - `name` (string)
  - `action` ("create" | "read" | "update" | "delete")
  - `resource` (string) — canonical token like `event:create`
  - `description` (string)
  - `level` (number, 0..100) — numeric hierarchy where `0` is lowest and `100` is master

Security model

- All endpoints should be protected behind your existing auth middleware (JWT/session). The example requests below assume a valid bearer token.

Level semantics

- `level` is used to indicate stronger permissions. A check for `minLevel=50` requires the user's permission `level >= 50`.

Endpoints

1. Get user permissions

- URL: `GET /api/v1/permissions/:userId`
- Auth: required
- Response: 200

```json
{
  "success": true,
  "data": [
    {
      "name": "View Event",
      "action": "read",
      "resource": "event:view",
      "level": 0
    }
  ]
}
```

2. Add permissions (batch)

- URL: `POST /api/v1/permissions/:userId`
- Body: array of permission objects
- Example request body:

```json
[
  {
    "name": "View Event",
    "action": "read",
    "resource": "event:view",
    "description": "view events",
    "level": 0
  }
]
```

- Behavior: deduplicates by `resource`, upserts into the user's permission document.
- Response: operation result (Mongo update/create result)

3. Assign organization default permissions

- URL: `POST /api/v1/permissions/:userId/assign-organization`
- Body: none
- Behavior: adds `Default_Organization_Permissions` to the user's permission array (deduped)

4. Check permission

- URL: `GET /api/v1/permissions/:userId/check?name=<permName>&minLevel=<n>`
- Example: `/api/v1/permissions/123/check?name=event:view&minLevel=0`
- Response: `{ "success": true, "hasPermission": true }`

5. Remove permission by resource

- URL: `DELETE /api/v1/permissions/:userId`
- Body: `{ "resource": "event:view" }`
- Behavior: pulls permission objects matching the resource from the user's array

Migration note

- If you later move to a flat-permission model (each permission as its own document), migrate by reading each parent document and creating individual permission documents per array element.

Implementation notes

- The `level` is clamped to 0..100 in the server utilities. Use 100 for master-level permissions.
- Use `$elemMatch` when checking nested permissions (the service implements level-aware checks).

If you want, I can:

- add route-level auth middleware attachments (I left generic because I don't know your auth middleware name), or
- implement a migration script to flatten existing documents.
