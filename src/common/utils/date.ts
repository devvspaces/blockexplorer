

/**
 * Convert a number of milliseconds to a human readable time.
 * Format: 1h 1m 1s 1ms
 * Or
 * Format: 1h 1m 1s
 * Or
 * Format: 1m 1s
 * Or
 * Format: 1s 1ms
 * Or
 * Format: X seconds
 * Or
 * Format: X mins
 * @param ms 
 */
export function readableTimestamp(ms: number) {

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingSeconds = seconds % 60;
  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 60;

  const humanTime = [
    remainingHours > 0 ? `${remainingHours}h` : '',
    remainingMinutes > 0 ? `${remainingMinutes}m` : '',
    remainingSeconds > 0 ? `${remainingSeconds}s` : '',
  ].join(' ').trim();

  return humanTime;

}