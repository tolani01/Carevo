'use client';

export type UserRole = 
  | 'owner' 
  | 'admin' 
  | 'location_manager' 
  | 'provider' 
  | 'nurse' 
  | 'front_desk' 
  | 'billing_specialist' 
  | 'pa_coordinator' 
  | 'lab_results' 
  | 'auditor';

export interface RolePermissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canAssignTasks: boolean;
  canViewAllTasks: boolean;
  canViewAdmin: boolean;
  canManageUsers: boolean;
  canManageLocations: boolean;
  canViewSecurity: boolean;
  canCreateChannels: boolean;
  canUploadFiles: boolean;
  canViewReports: boolean;
  isReadOnly: boolean;
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  owner: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: true,
    canManageUsers: true,
    canManageLocations: true,
    canViewSecurity: true,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: true,
    isReadOnly: false
  },
  admin: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: true,
    canManageUsers: true,
    canManageLocations: true,
    canViewSecurity: true,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: true,
    isReadOnly: false
  },
  location_manager: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: true,
    canManageUsers: true,
    canManageLocations: true,
    canViewSecurity: true,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: true,
    isReadOnly: false
  },
  provider: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: false,
    canManageUsers: false,
    canManageLocations: false,
    canViewSecurity: false,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: false,
    isReadOnly: false
  },
  nurse: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: false,
    canManageUsers: false,
    canManageLocations: false,
    canViewSecurity: false,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: false,
    isReadOnly: false
  },
  front_desk: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: false,
    canManageUsers: false,
    canManageLocations: false,
    canViewSecurity: false,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: false,
    isReadOnly: false
  },
  billing_specialist: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: false,
    canManageUsers: false,
    canManageLocations: false,
    canViewSecurity: false,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: false,
    isReadOnly: false
  },
  pa_coordinator: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: false,
    canManageUsers: false,
    canManageLocations: false,
    canViewSecurity: false,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: false,
    isReadOnly: false
  },
  lab_results: {
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canAssignTasks: true,
    canViewAllTasks: true,
    canViewAdmin: false,
    canManageUsers: false,
    canManageLocations: false,
    canViewSecurity: false,
    canCreateChannels: true,
    canUploadFiles: true,
    canViewReports: false,
    isReadOnly: false
  },
  auditor: {
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canAssignTasks: false,
    canViewAllTasks: true,
    canViewAdmin: false,
    canManageUsers: false,
    canManageLocations: false,
    canViewSecurity: false,
    canCreateChannels: false,
    canUploadFiles: false,
    canViewReports: true,
    isReadOnly: true
  }
};

export function useRolePermissions(userRole: UserRole = 'provider'): RolePermissions {
  return rolePermissions[userRole] || rolePermissions.provider;
}

export function canAccessPage(userRole: UserRole, page: string): boolean {
  const permissions = rolePermissions[userRole] || rolePermissions.provider;
  
  switch (page) {
    case 'admin':
      return permissions.canViewAdmin;
    case 'board':
    case 'my':
    case 'chat':
      return true; // All roles can access these pages
    default:
      return true;
  }
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    location_manager: 'Location Manager',
    provider: 'Provider',
    nurse: 'Nurse/MA',
    front_desk: 'Front Desk',
    billing_specialist: 'Billing Specialist',
    pa_coordinator: 'PA Coordinator',
    lab_results: 'Lab/Results Coordinator',
    auditor: 'Auditor (Read-Only)'
  };
  
  return displayNames[role] || 'Unknown Role';
}
