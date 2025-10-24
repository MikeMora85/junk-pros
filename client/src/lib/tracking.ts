import { apiRequest } from './queryClient';

export async function trackBusinessEvent(companyId: number, eventType: 'click' | 'call' | 'book_quote' | 'photo_quote' | 'google_reviews', metadata?: any) {
  try {
    await apiRequest('/api/track/event', {
      method: 'POST',
      body: { companyId, eventType, metadata }
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}
