// Team Manager
// Manages teams, workspaces, and team members

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';
export type TeamPermission = 'read' | 'write' | 'delete' | 'admin' | 'billing';

export interface TeamMember {
  userId: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions: TeamPermission[];
  joinedAt: number;
  lastActiveAt?: number;
  isActive: boolean;
  avatar?: string;
}

export interface Team {
  teamId: string;
  ownerId: string;
  name: string;
  description?: string;
  logo?: string;
  members: Map<string, TeamMember>;
  workspaces: string[]; // workspace IDs
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
  settings?: TeamSettings;
}

export interface Workspace {
  workspaceId: string;
  teamId: string;
  name: string;
  description?: string;
  icon?: string;
  createdBy: string;
  members: string[]; // user IDs
  chartsLimit: number;
  reportsLimit: number;
  storageGBLimit: number;
  createdAt: number;
  updatedAt: number;
}

export interface TeamSettings {
  defaultRole: UserRole;
  requireApproval: boolean;
  allowPublicSharing: boolean;
  ssoEnabled: boolean;
  twoFactorRequired: boolean;
  dataRetentionDays: number;
}

/**
 * Team Manager
 * Manages team creation, member management, and workspaces
 */
export class TeamManager {
  private teams: Map<string, Team> = new Map();
  private workspaces: Map<string, Workspace> = new Map();
  private teamStorageKey = 'kotravel_teams';
  private workspaceStorageKey = 'kotravel_workspaces';

  constructor() {
    this.loadTeams();
    this.loadWorkspaces();
  }

  /**
   * Create new team
   */
  createTeam(data: Omit<Team, 'teamId' | 'members' | 'workspaces' | 'createdAt' | 'updatedAt' | 'isActive'>): Team {
    const team: Team = {
      ...data,
      teamId: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      members: new Map(),
      workspaces: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
      settings: {
        defaultRole: 'member',
        requireApproval: false,
        allowPublicSharing: true,
        ssoEnabled: false,
        twoFactorRequired: false,
        dataRetentionDays: 90,
      },
    };

    // Add owner as first member
    team.members.set(data.ownerId, {
      userId: data.ownerId,
      email: '', // should be provided
      displayName: 'Owner',
      role: 'owner',
      permissions: ['read', 'write', 'delete', 'admin', 'billing'],
      joinedAt: Date.now(),
      isActive: true,
    });

    this.teams.set(team.teamId, team);
    this.persistTeams();
    return team;
  }

  /**
   * Get team by ID
   */
  getTeam(teamId: string): Team | null {
    return this.teams.get(teamId) || null;
  }

  /**
   * Get user's teams
   */
  getUserTeams(userId: string): Team[] {
    return Array.from(this.teams.values()).filter(team =>
      team.members.has(userId)
    );
  }

  /**
   * Add team member
   */
  addMember(teamId: string, member: TeamMember): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    team.members.set(member.userId, member);
    team.updatedAt = Date.now();
    this.persistTeams();
    return true;
  }

  /**
   * Remove team member
   */
  removeMember(teamId: string, userId: string): boolean {
    const team = this.teams.get(teamId);
    if (!team || team.ownerId === userId) {
      // Cannot remove owner
      return false;
    }

    const removed = team.members.delete(userId);
    if (removed) {
      team.updatedAt = Date.now();
      this.persistTeams();
    }
    return removed;
  }

  /**
   * Update member role
   */
  updateMemberRole(teamId: string, userId: string, role: UserRole): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    const member = team.members.get(userId);
    if (!member || team.ownerId === userId) {
      return false;
    }

    member.role = role;
    member.permissions = this.getPermissionsForRole(role);
    team.updatedAt = Date.now();
    this.persistTeams();
    return true;
  }

  /**
   * Get team members
   */
  getTeamMembers(teamId: string): TeamMember[] {
    const team = this.teams.get(teamId);
    return team ? Array.from(team.members.values()) : [];
  }

  /**
   * Create workspace
   */
  createWorkspace(data: Omit<Workspace, 'workspaceId' | 'createdAt' | 'updatedAt'>): Workspace {
    const workspace: Workspace = {
      ...data,
      workspaceId: `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.workspaces.set(workspace.workspaceId, workspace);

    const team = this.teams.get(data.teamId);
    if (team) {
      team.workspaces.push(workspace.workspaceId);
      team.updatedAt = Date.now();
      this.persistTeams();
    }

    this.persistWorkspaces();
    return workspace;
  }

  /**
   * Get workspace
   */
  getWorkspace(workspaceId: string): Workspace | null {
    return this.workspaces.get(workspaceId) || null;
  }

  /**
   * Get team workspaces
   */
  getTeamWorkspaces(teamId: string): Workspace[] {
    const team = this.teams.get(teamId);
    if (!team) return [];

    return team.workspaces
      .map(wsId => this.workspaces.get(wsId))
      .filter(Boolean) as Workspace[];
  }

  /**
   * Add workspace member
   */
  addWorkspaceMember(workspaceId: string, userId: string): boolean {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace || workspace.members.includes(userId)) {
      return false;
    }

    workspace.members.push(userId);
    workspace.updatedAt = Date.now();
    this.persistWorkspaces();
    return true;
  }

  /**
   * Remove workspace member
   */
  removeWorkspaceMember(workspaceId: string, userId: string): boolean {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) return false;

    const index = workspace.members.indexOf(userId);
    if (index > -1) {
      workspace.members.splice(index, 1);
      workspace.updatedAt = Date.now();
      this.persistWorkspaces();
      return true;
    }
    return false;
  }

  /**
   * Update team settings
   */
  updateTeamSettings(teamId: string, settings: Partial<TeamSettings>): boolean {
    const team = this.teams.get(teamId);
    if (!team || !team.settings) return false;

    team.settings = { ...team.settings, ...settings };
    team.updatedAt = Date.now();
    this.persistTeams();
    return true;
  }

  /**
   * Check member permission
   */
  hasMemberPermission(teamId: string, userId: string, permission: TeamPermission): boolean {
    const team = this.teams.get(teamId);
    if (!team) return false;

    const member = team.members.get(userId);
    return member ? member.permissions.includes(permission) : false;
  }

  /**
   * Get member role
   */
  getMemberRole(teamId: string, userId: string): UserRole | null {
    const team = this.teams.get(teamId);
    if (!team) return null;

    const member = team.members.get(userId);
    return member ? member.role : null;
  }

  /**
   * Export team data
   */
  exportTeamData(teamId: string): string | null {
    const team = this.teams.get(teamId);
    if (!team) return null;

    return JSON.stringify({
      team: {
        ...team,
        members: Array.from(team.members.values()),
      },
      workspaces: this.getTeamWorkspaces(teamId),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  // ==================== PRIVATE METHODS ====================

  private getPermissionsForRole(role: UserRole): TeamPermission[] {
    const permissionMap: Record<UserRole, TeamPermission[]> = {
      owner: ['read', 'write', 'delete', 'admin', 'billing'],
      admin: ['read', 'write', 'delete', 'admin'],
      member: ['read', 'write'],
      viewer: ['read'],
    };
    return permissionMap[role] || [];
  }

  private persistTeams(): void {
    try {
      const teamsData = Array.from(this.teams.values()).map(team => ({
        ...team,
        members: Array.from(team.members.entries()).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, TeamMember>),
      }));
      localStorage.setItem(this.teamStorageKey, JSON.stringify(teamsData));
    } catch (error) {
      console.error('Failed to save teams:', error);
    }
  }

  private loadTeams(): void {
    try {
      const data = localStorage.getItem(this.teamStorageKey);
      if (data) {
        const teamsData = JSON.parse(data);
        teamsData.forEach((teamData: any) => {
          const members = new Map(Object.entries(teamData.members || {}));
          const team: Team = {
            ...teamData,
            members,
          };
          this.teams.set(team.teamId, team);
        });
      }
    } catch (error) {
      console.error('Failed to load teams:', error);
    }
  }

  private persistWorkspaces(): void {
    try {
      const workspacesArray = Array.from(this.workspaces.values());
      localStorage.setItem(this.workspaceStorageKey, JSON.stringify(workspacesArray));
    } catch (error) {
      console.error('Failed to save workspaces:', error);
    }
  }

  private loadWorkspaces(): void {
    try {
      const data = localStorage.getItem(this.workspaceStorageKey);
      if (data) {
        const workspaces = JSON.parse(data) as Workspace[];
        workspaces.forEach(workspace => {
          this.workspaces.set(workspace.workspaceId, workspace);
        });
      }
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  }
}

// Global team manager instance
let teamManager: TeamManager | null = null;

export function initializeTeamManager(): TeamManager {
  if (!teamManager) {
    teamManager = new TeamManager();
  }
  return teamManager;
}

export function getTeamManager(): TeamManager {
  if (!teamManager) {
    teamManager = new TeamManager();
  }
  return teamManager;
}
