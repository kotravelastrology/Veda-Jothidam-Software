// Role-Based Access Control (RBAC)
// Manages permissions, roles, and access control

export type ResourceType = 'chart' | 'report' | 'team' | 'workspace' | 'settings' | 'billing' | 'api';
export type ActionType = 'create' | 'read' | 'update' | 'delete' | 'share' | 'export' | 'admin';

export interface Permission {
  id: string;
  resource: ResourceType;
  action: ActionType;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isCustom: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ResourceAccess {
  resourceId: string;
  resourceType: ResourceType;
  userId: string;
  role: Role;
  grantedAt: number;
  grantedBy: string;
}

/**
 * Role-Based Access Control (RBAC)
 * Manages permissions, roles, and access control
 */
export class RoleBasedAccessControl {
  private roles: Map<string, Role> = new Map();
  private resourceAccess: Map<string, ResourceAccess[]> = new Map();
  private rolesStorageKey = 'kotravel_rbac_roles';
  private accessStorageKey = 'kotravel_rbac_access';

  constructor() {
    this.initializeDefaultRoles();
    this.loadRoles();
    this.loadResourceAccess();
  }

  /**
   * Create custom role
   */
  createRole(data: Omit<Role, 'id' | 'isCustom' | 'createdAt' | 'updatedAt'>): Role {
    const role: Role = {
      ...data,
      id: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isCustom: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.roles.set(role.id, role);
    this.persistRoles();
    return role;
  }

  /**
   * Get role by ID
   */
  getRole(roleId: string): Role | null {
    return this.roles.get(roleId) || null;
  }

  /**
   * Get all roles
   */
  getAllRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Update role
   */
  updateRole(roleId: string, updates: Partial<Role>): Role | null {
    const role = this.roles.get(roleId);
    if (!role) return null;

    Object.assign(role, updates);
    role.updatedAt = Date.now();
    this.persistRoles();
    return role;
  }

  /**
   * Delete custom role
   */
  deleteRole(roleId: string): boolean {
    const role = this.roles.get(roleId);
    if (!role || !role.isCustom) return false;

    return this.roles.delete(roleId);
  }

  /**
   * Grant access to resource
   */
  grantAccess(
    resourceId: string,
    resourceType: ResourceType,
    userId: string,
    roleId: string,
    grantedBy: string
  ): ResourceAccess | null {
    const role = this.roles.get(roleId);
    if (!role) return null;

    const access: ResourceAccess = {
      resourceId,
      resourceType,
      userId,
      role,
      grantedAt: Date.now(),
      grantedBy,
    };

    const key = `${resourceType}:${resourceId}`;
    if (!this.resourceAccess.has(key)) {
      this.resourceAccess.set(key, []);
    }

    this.resourceAccess.get(key)!.push(access);
    this.persistResourceAccess();
    return access;
  }

  /**
   * Revoke access to resource
   */
  revokeAccess(resourceId: string, resourceType: ResourceType, userId: string): boolean {
    const key = `${resourceType}:${resourceId}`;
    const accesses = this.resourceAccess.get(key);

    if (!accesses) return false;

    const index = accesses.findIndex(a => a.userId === userId);
    if (index > -1) {
      accesses.splice(index, 1);
      this.persistResourceAccess();
      return true;
    }
    return false;
  }

  /**
   * Check if user can perform action on resource
   */
  canUserAction(
    userId: string,
    resourceId: string,
    resourceType: ResourceType,
    action: ActionType
  ): boolean {
    const key = `${resourceType}:${resourceId}`;
    const accesses = this.resourceAccess.get(key);

    if (!accesses) return false;

    const access = accesses.find(a => a.userId === userId);
    if (!access) return false;

    return access.role.permissions.some(p => p.resource === resourceType && p.action === action);
  }

  /**
   * Get user's access to resource
   */
  getUserResourceAccess(userId: string, resourceId: string, resourceType: ResourceType): ResourceAccess | null {
    const key = `${resourceType}:${resourceId}`;
    const accesses = this.resourceAccess.get(key);

    return accesses ? accesses.find(a => a.userId === userId) || null : null;
  }

  /**
   * Get all resources user has access to
   */
  getUserResources(userId: string, resourceType?: ResourceType): ResourceAccess[] {
    const accesses: ResourceAccess[] = [];

    this.resourceAccess.forEach((resourceAccesses, key) => {
      const [type] = key.split(':');
      if (!resourceType || type === resourceType) {
        accesses.push(...resourceAccesses.filter(a => a.userId === userId));
      }
    });

    return accesses;
  }

  /**
   * Add permission to role
   */
  addPermissionToRole(roleId: string, permission: Permission): boolean {
    const role = this.roles.get(roleId);
    if (!role) return false;

    if (role.permissions.some(p => p.id === permission.id)) {
      return false;
    }

    role.permissions.push(permission);
    role.updatedAt = Date.now();
    this.persistRoles();
    return true;
  }

  /**
   * Remove permission from role
   */
  removePermissionFromRole(roleId: string, permissionId: string): boolean {
    const role = this.roles.get(roleId);
    if (!role) return false;

    const index = role.permissions.findIndex(p => p.id === permissionId);
    if (index > -1) {
      role.permissions.splice(index, 1);
      role.updatedAt = Date.now();
      this.persistRoles();
      return true;
    }
    return false;
  }

  /**
   * Check if user has permission
   */
  hasPermission(userId: string, permission: Permission, resourceId?: string, resourceType?: ResourceType): boolean {
    // Check if user is super admin or has global permission
    if (resourceId && resourceType) {
      return this.canUserAction(userId, resourceId, resourceType, permission.action);
    }

    // Check if user has permission globally
    // This would need team/organization level checking
    return false;
  }

  /**
   * Get default roles
   */
  getDefaultRoles(): Role[] {
    return Array.from(this.roles.values()).filter(r => !r.isCustom);
  }

  /**
   * Audit access changes
   */
  getAccessAudit(resourceId: string, resourceType: ResourceType): ResourceAccess[] {
    const key = `${resourceType}:${resourceId}`;
    return this.resourceAccess.get(key) || [];
  }

  // ==================== PRIVATE METHODS ====================

  private initializeDefaultRoles(): void {
    // Owner role
    this.roles.set('role_owner', {
      id: 'role_owner',
      name: 'Owner',
      description: 'Full access to all resources',
      permissions: [
        { id: 'perm_1', resource: 'chart', action: 'create', description: 'Create charts' },
        { id: 'perm_2', resource: 'chart', action: 'read', description: 'Read charts' },
        { id: 'perm_3', resource: 'chart', action: 'update', description: 'Update charts' },
        { id: 'perm_4', resource: 'chart', action: 'delete', description: 'Delete charts' },
        { id: 'perm_5', resource: 'chart', action: 'share', description: 'Share charts' },
        { id: 'perm_6', resource: 'report', action: 'create', description: 'Create reports' },
        { id: 'perm_7', resource: 'report', action: 'read', description: 'Read reports' },
        { id: 'perm_8', resource: 'report', action: 'update', description: 'Update reports' },
        { id: 'perm_9', resource: 'report', action: 'delete', description: 'Delete reports' },
        { id: 'perm_10', resource: 'team', action: 'admin', description: 'Manage team' },
        { id: 'perm_11', resource: 'billing', action: 'admin', description: 'Manage billing' },
        { id: 'perm_12', resource: 'api', action: 'admin', description: 'Manage API' },
      ],
      isCustom: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Admin role
    this.roles.set('role_admin', {
      id: 'role_admin',
      name: 'Admin',
      description: 'Administrative access',
      permissions: [
        { id: 'perm_1', resource: 'chart', action: 'create', description: 'Create charts' },
        { id: 'perm_2', resource: 'chart', action: 'read', description: 'Read charts' },
        { id: 'perm_3', resource: 'chart', action: 'update', description: 'Update charts' },
        { id: 'perm_4', resource: 'chart', action: 'delete', description: 'Delete charts' },
        { id: 'perm_5', resource: 'chart', action: 'share', description: 'Share charts' },
        { id: 'perm_6', resource: 'report', action: 'create', description: 'Create reports' },
        { id: 'perm_7', resource: 'report', action: 'read', description: 'Read reports' },
        { id: 'perm_8', resource: 'report', action: 'update', description: 'Update reports' },
        { id: 'perm_9', resource: 'report', action: 'delete', description: 'Delete reports' },
        { id: 'perm_10', resource: 'team', action: 'admin', description: 'Manage team' },
      ],
      isCustom: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Member role
    this.roles.set('role_member', {
      id: 'role_member',
      name: 'Member',
      description: 'Standard member access',
      permissions: [
        { id: 'perm_1', resource: 'chart', action: 'create', description: 'Create charts' },
        { id: 'perm_2', resource: 'chart', action: 'read', description: 'Read charts' },
        { id: 'perm_3', resource: 'chart', action: 'update', description: 'Update charts' },
        { id: 'perm_5', resource: 'chart', action: 'share', description: 'Share charts' },
        { id: 'perm_6', resource: 'report', action: 'create', description: 'Create reports' },
        { id: 'perm_7', resource: 'report', action: 'read', description: 'Read reports' },
        { id: 'perm_8', resource: 'report', action: 'update', description: 'Update reports' },
      ],
      isCustom: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Viewer role
    this.roles.set('role_viewer', {
      id: 'role_viewer',
      name: 'Viewer',
      description: 'Read-only access',
      permissions: [
        { id: 'perm_2', resource: 'chart', action: 'read', description: 'Read charts' },
        { id: 'perm_7', resource: 'report', action: 'read', description: 'Read reports' },
      ],
      isCustom: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  private persistRoles(): void {
    try {
      const rolesArray = Array.from(this.roles.values());
      localStorage.setItem(this.rolesStorageKey, JSON.stringify(rolesArray));
    } catch (error) {
      console.error('Failed to save roles:', error);
    }
  }

  private loadRoles(): void {
    try {
      const data = localStorage.getItem(this.rolesStorageKey);
      if (data) {
        const roles = JSON.parse(data) as Role[];
        roles.forEach(role => {
          if (!this.roles.has(role.id)) {
            this.roles.set(role.id, role);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  }

  private persistResourceAccess(): void {
    try {
      const accessArray = Array.from(this.resourceAccess.values()).flat();
      localStorage.setItem(this.accessStorageKey, JSON.stringify(accessArray));
    } catch (error) {
      console.error('Failed to save resource access:', error);
    }
  }

  private loadResourceAccess(): void {
    try {
      const data = localStorage.getItem(this.accessStorageKey);
      if (data) {
        const accesses = JSON.parse(data) as ResourceAccess[];
        accesses.forEach(access => {
          const key = `${access.resourceType}:${access.resourceId}`;
          if (!this.resourceAccess.has(key)) {
            this.resourceAccess.set(key, []);
          }
          this.resourceAccess.get(key)!.push(access);
        });
      }
    } catch (error) {
      console.error('Failed to load resource access:', error);
    }
  }
}

// Global RBAC instance
let rbac: RoleBasedAccessControl | null = null;

export function initializeRBAC(): RoleBasedAccessControl {
  if (!rbac) {
    rbac = new RoleBasedAccessControl();
  }
  return rbac;
}

export function getRBAC(): RoleBasedAccessControl {
  if (!rbac) {
    rbac = new RoleBasedAccessControl();
  }
  return rbac;
}
