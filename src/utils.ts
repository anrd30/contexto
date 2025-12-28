import { formatDistanceToNow } from 'date-fns';

export const formatTimeAgo = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getLatestContext = (contexts: any[]) => {
  if (contexts.length === 0) return null;
  return contexts[contexts.length - 1];
};
