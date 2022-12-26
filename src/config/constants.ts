import { AnchorHTMLAttributes } from 'react';

/**
 * HTML attributes to spread on anchor elements in Settings.tsx component
 */
export type MenuLinkAttributes = AnchorHTMLAttributes<HTMLAnchorElement>;

export const LINK_ATTRIBUTES: MenuLinkAttributes = {
  role: 'button',
  target: '_blank',
  rel: 'noopener noreferrer',
};
