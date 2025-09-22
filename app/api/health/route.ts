import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: [
      'Global header with search and command palette',
      'Mobile-responsive navigation',
      'Keyboard shortcuts (N, A, D, W, ⌘K)',
      'URL persistence for filters',
      'PHI protection warnings',
      'Enhanced empty states',
      'Role-based UI',
      'Waiting reason prompts',
      'Task management with drag & drop',
      'Team chat with task creation'
    ]
  });
}
