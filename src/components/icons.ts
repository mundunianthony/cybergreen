/**
 * Line icons used across the site (24x24, stroke-based). Path data copied verbatim from the
 * original pages, where each icon was repeated inline.
 */
export const icons = {
  recycle:
    '<path d="M7 19H4.8a1.8 1.8 0 0 1-1.6-2.7L5.3 13"/><path d="M11 19h8.2a1.8 1.8 0 0 0 1.6-2.7l-1.2-2"/><path d="m14 16-3 3 3 3"/><path d="M8.3 13.2 5.3 13l-.9 3"/><path d="m9.3 5.6 1.2-2a1.8 1.8 0 0 1 3 0l4 7"/><path d="m13.4 9.4 4.1 1.2.8-3"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><rect x="9.5" y="9.5" width="5" height="5"/>',
  book: '<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5z"/><path d="M4 19.5A1.5 1.5 0 0 0 5.5 21H20v-3"/><path d="M9 8h7M9 11.5h5"/>',
  child:
    '<circle cx="12" cy="5" r="2.5"/><path d="M12 8v6M8 10.5l4 1.5 4-1.5M9.5 21l2.5-7 2.5 7"/><path d="M4.5 13a8.5 8.5 0 0 0 15 0" stroke-dasharray="2 2.5"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M11 18h2"/>',
  phoneText: '<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M9.5 9.5h5M9.5 12.5h5M9.5 15.5h3"/>',
  screen: '<rect x="2.5" y="4" width="19" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  radio:
    '<rect x="2.5" y="8" width="19" height="12" rx="1.5"/><path d="m7 8 9-5"/><circle cx="8.5" cy="14" r="2.5"/><path d="M14 12.5h4M14 15.5h4"/>',
  battery: '<rect x="2.5" y="7" width="17" height="10" rx="1.5"/><path d="M22 11v2"/><path d="M6 10v4M9.5 10v4"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  people:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
} as const;

export type IconName = keyof typeof icons;
