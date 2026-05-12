/*
 * Placeholder for interactive scripts.
 *
 * This file can be used to add simple enhancements such as smooth scrolling,
 * mobile menu toggling or simple modal interactions. Currently it contains
 * helper functions for a smooth scroll to anchors.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});