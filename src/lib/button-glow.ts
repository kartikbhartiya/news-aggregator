'use client';

/**
 * Apple-grade Button Click Glow & Tactile Feedback
 * Emits a radial specular light pulse from the click coordinates and triggers micro-haptics.
 */
export function handleButtonClickGlow(e: any) {
  if (!e) return;
  const target = (e.currentTarget || e.target) as HTMLElement;
  if (!target) return;

  // Find nearest clickable container if clicked on an icon/child
  const btn = (target.closest('button, [role="button"], a, .apple-btn, .apple-clickable') as HTMLElement) || target;
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left;
  const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top;

  // Remove existing glow pulse if present
  const existingGlow = btn.querySelector('.apple-click-glow');
  if (existingGlow) existingGlow.remove();

  // Create luminous specular glow element
  const glow = document.createElement('span');
  glow.className = 'apple-click-glow pointer-events-none absolute rounded-full -translate-x-1/2 -translate-y-1/2 z-30';
  glow.style.left = `${x}px`;
  glow.style.top = `${y}px`;
  glow.style.width = `${Math.max(rect.width, rect.height) * 2.4}px`;
  glow.style.height = `${Math.max(rect.width, rect.height) * 2.4}px`;
  glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(167, 243, 208, 0.4) 30%, rgba(99, 102, 241, 0.2) 55%, transparent 70%)';
  glow.style.mixBlendMode = 'overlay';
  glow.style.animation = 'apple-glow-burst 550ms cubic-bezier(0.16, 1, 0.3, 1) forwards';

  // Ensure relative positioning
  const computedPos = window.getComputedStyle(btn).position;
  if (computedPos === 'static') {
    btn.style.position = 'relative';
  }
  btn.style.overflow = 'hidden';

  btn.appendChild(glow);

  // Trigger iOS / Android light haptic feedback if available
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(10);
    } catch {
      // Non-blocking
    }
  }

  setTimeout(() => {
    glow.remove();
  }, 580);
}
