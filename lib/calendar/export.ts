import ical from 'ical-generator';
import type { Calendar, Post } from '@/types';

export function generateICalendar(calendar: Calendar) {
  const cal = ical({ name: 'Social Media Calendar' });

  calendar.posts.forEach((post: Post) => {
    const postDate = new Date(post.date);
    const endDate = new Date(postDate);
    endDate.setHours(23, 59, 59);
    
    cal.createEvent({
      start: postDate,
      end: endDate,
      summary: `Social Media Post: ${post.category}`,
      description: `Post Type: ${post.postType}\nCategory: ${post.category}\nTopic: ${post.topic}\nFunnel Stage: ${post.funnelStage}\nVirality: ${post.virality}%\n\nContent:\n${post.content}`,
    });
  });

  return cal;
}

export function downloadICalendar(calendar: Calendar, filename: string = 'social-calendar.ics') {
  const cal = generateICalendar(calendar);
  const blob = new Blob([cal.toString()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

