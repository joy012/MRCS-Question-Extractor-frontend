export const DEFAULT_INTAKES = [
  {
    name: 'january',
    type: 'JANUARY' as const,
    displayName: 'January',
    description: 'January intake for MRCS examinations',
    order: 1,
    color: '#3B82F6',
    icon: 'calendar',
  },
  {
    name: 'april-may',
    type: 'APRIL_MAY' as const,
    displayName: 'April/May',
    description: 'April/May intake for MRCS examinations',
    order: 2,
    color: '#10B981',
    icon: 'calendar',
  },
  {
    name: 'september',
    type: 'SEPTEMBER' as const,
    displayName: 'September',
    description: 'September intake for MRCS examinations',
    order: 3,
    color: '#8B5CF6',
    icon: 'calendar',
  },
] as const; 