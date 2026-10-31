import { LearningActivity, LearningGoal, UserProfile } from '../types';
import { formatDate } from './formatters';

function triggerDownload(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvCell(cell: string | number | undefined | null): string {
  if (cell === undefined || cell === null) return '""';
  const str = String(cell).replace(/"/g, '""');
  return `"${str}"`;
}

export function exportActivitiesToCsv(activities: LearningActivity[], user: UserProfile) {
  const headers = [
    'Session ID',
    'Date',
    'Skill Name',
    'Category',
    'Activity Type',
    'Role (Teaching/Learning)',
    'Duration (Minutes)',
    'Duration (Hours)',
    'Partner Name',
    'Key Takeaways',
    'Session Notes',
  ];

  const rows = activities.map((act) => [
    escapeCsvCell(act.id),
    escapeCsvCell(formatDate(act.date)),
    escapeCsvCell(act.skillName),
    escapeCsvCell(act.category),
    escapeCsvCell(act.activityType),
    escapeCsvCell(act.isTeaching ? 'Teaching / Mentoring' : 'Learning / Practicing'),
    escapeCsvCell(act.durationMinutes),
    escapeCsvCell((act.durationMinutes / 60).toFixed(1)),
    escapeCsvCell(act.partnerName || 'Self / Solo'),
    escapeCsvCell(act.keyTakeaways?.join(' | ') || ''),
    escapeCsvCell(act.notes),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const safeName = user.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${safeName}_learning_activities_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(csvContent, filename);
}

export function exportGoalsToCsv(goals: LearningGoal[], user: UserProfile) {
  const headers = [
    'Goal ID',
    'Title',
    'Skill Name',
    'Category',
    'Status',
    'Progress (%)',
    'Target Date',
    'Milestones Completed',
    'Total Milestones',
    'Milestone Details',
    'Description',
  ];

  const rows = goals.map((g) => {
    const completedM = g.milestones.filter((m) => m.completed).length;
    const totalM = g.milestones.length;
    const milestoneSummary = g.milestones
      .map((m) => `[${m.completed ? 'X' : ' '}] ${m.title}`)
      .join(' | ');

    return [
      escapeCsvCell(g.id),
      escapeCsvCell(g.title),
      escapeCsvCell(g.skillName),
      escapeCsvCell(g.category),
      escapeCsvCell(g.status),
      escapeCsvCell(g.progress),
      escapeCsvCell(formatDate(g.targetDate)),
      escapeCsvCell(completedM),
      escapeCsvCell(totalM),
      escapeCsvCell(milestoneSummary),
      escapeCsvCell(g.description),
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const safeName = user.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `${safeName}_learning_goals_${new Date().toISOString().slice(0, 10)}.csv`;
  triggerDownload(csvContent, filename);
}
