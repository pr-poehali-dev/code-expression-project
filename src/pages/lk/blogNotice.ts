// Отслеживание: видел ли пользователь последний опубликованный пост блога.
// Сравниваем дату последнего поста (с backend) с датой, сохранённой в localStorage.

const KEY = "blog_last_seen_date";
export const BLOG_SEEN_EVENT = "blog-seen";

export function getBlogSeenDate(): string {
  return localStorage.getItem(KEY) || "";
}

export function markBlogSeen(latestPostDate: string): void {
  if (!latestPostDate) return;
  localStorage.setItem(KEY, latestPostDate);
  window.dispatchEvent(new Event(BLOG_SEEN_EVENT));
}
