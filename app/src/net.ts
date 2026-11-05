/**
 * A signal that aborts a request after `ms`. AbortSignal.timeout() only exists from Safari 16 /
 * Chrome 103; older iPads and phones (common in the schools MOCHILA is for) throw a TypeError on it,
 * which made the first download, sending progress and the teacher counters fail there.
 */
export function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms)
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}
