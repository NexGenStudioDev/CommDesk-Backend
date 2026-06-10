import { Router } from "express";
import { permissionController } from "./Permission.controller";

const router = Router();

router.get(
  "/permissions/:userId",
  permissionController.getUserPermissions.bind(permissionController),
);
router.post(
  "/permissions/:userId",
  permissionController.addPermissions.bind(permissionController),
);
router.post(
  "/permissions/:userId/assign-organization",
  permissionController.assignOrganization.bind(permissionController),
);
router.get(
  "/permissions/:userId/check",
  permissionController.checkPermission.bind(permissionController),
);
router.delete(
  "/permissions/:userId",
  permissionController.removePermission.bind(permissionController),
);

export { router as PermissionRoutes };
