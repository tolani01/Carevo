export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'provider' | 'auditor';
  department?: string;
  avatar?: string;
  isOnline?: boolean;
  phone?: string;
  first_name?: string;
  last_name?: string;
  organization_id?: string;
}

export interface UserAssignment {
  id: string;
  taskId: string;
  userId: string;
  assignedBy: string;
  assignedAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  note?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface TaskAssignmentHistory {
  id: string;
  taskId: string;
  field: 'assignee' | 'status' | 'priority' | 'due_date';
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
  reason?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@carevo.dev',
    role: 'provider',
    department: 'Cardiology',
    isOnline: true,
    phone: '+1 (555) 123-4567',
    first_name: 'Sarah',
    last_name: 'Johnson',
    organization_id: 'demo-org'
  },
  {
    id: '2',
    name: 'Nurse Mike Chen',
    email: 'mike.chen@carevo.dev',
    role: 'provider',
    department: 'Nursing',
    isOnline: true,
    phone: '+1 (555) 234-5678',
    first_name: 'Mike',
    last_name: 'Chen',
    organization_id: 'demo-org'
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@carevo.dev',
    role: 'provider',
    department: 'Pediatrics',
    isOnline: false,
    phone: '+1 (555) 345-6789',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    organization_id: 'demo-org'
  },
  {
    id: '4',
    name: 'Lisa Wang',
    email: 'lisa.wang@carevo.dev',
    role: 'admin',
    department: 'Administration',
    isOnline: true,
    phone: '+1 (555) 456-7890',
    first_name: 'Lisa',
    last_name: 'Wang',
    organization_id: 'demo-org'
  },
  {
    id: '5',
    name: 'Tom Anderson',
    email: 'tom.anderson@carevo.dev',
    role: 'provider',
    department: 'Lab',
    isOnline: false,
    phone: '+1 (555) 567-8901',
    first_name: 'Tom',
    last_name: 'Anderson',
    organization_id: 'demo-org'
  },
  {
    id: '6',
    name: 'Maria Garcia',
    email: 'maria.garcia@carevo.dev',
    role: 'provider',
    department: 'Billing',
    isOnline: true,
    phone: '+1 (555) 678-9012',
    first_name: 'Maria',
    last_name: 'Garcia',
    organization_id: 'demo-org'
  },
  {
    id: '7',
    name: 'Dr. James Wilson',
    email: 'james.wilson@carevo.dev',
    role: 'provider',
    department: 'Emergency',
    isOnline: true,
    phone: '+1 (555) 789-0123',
    first_name: 'James',
    last_name: 'Wilson',
    organization_id: 'demo-org'
  },
  {
    id: '8',
    name: 'Nurse Jennifer Lee',
    email: 'jennifer.lee@carevo.dev',
    role: 'provider',
    department: 'Surgery',
    isOnline: false,
    phone: '+1 (555) 890-1234',
    first_name: 'Jennifer',
    last_name: 'Lee',
    organization_id: 'demo-org'
  }
];

export const getRoleDisplay = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrator';
    case 'owner': return 'Owner';
    case 'provider': return 'Healthcare Provider';
    case 'auditor': return 'Auditor';
    default: return role;
  }
};

export const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin':
    case 'owner':
      return 'Shield';
    default:
      return 'UserCircle';
  }
};

export const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin':
    case 'owner':
      return 'bg-purple-100 text-purple-700';
    case 'provider':
      return 'bg-blue-100 text-blue-700';
    case 'auditor':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
