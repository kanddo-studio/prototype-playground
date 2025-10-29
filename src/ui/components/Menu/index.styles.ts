import styled from "styled-components";

/**
 * Styled components for Menu.
 *
 * Keeping styles isolated improves readability, reusability and allows
 * future theming (ThemeProvider) without changing component logic.
 *
 * Visual style aligned with PlayerStatus for consistency:
 * - Dark semi-transparent backgrounds
 * - Subtle gradients and rounded corners
 * - Smooth transitions and focus states
 */

/**
 * Overlay that covers the screen when menu is open.
 */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

/**
 * Card container for the menu content.
 */
export const Card = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(34, 34, 34);
  color: #ffffff;
  min-width: 320px;
  border-radius: 12px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.4),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  font-family:
    Inter,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial;
  opacity: 0.95;
`;

/**
 * Title style
 */
export const Title = styled.h1`
  margin: 0;
  margin-bottom: 1.25rem;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

/**
 * Buttons wrapper
 */
export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

/**
 * Props used to style selected state.
 */
export type ActionButtonProps = {
  selected?: boolean;
};

/**
 * Action button used for each menu option.
 * Uses props.selected to highlight the current choice.
 */
export const ActionButton = styled.button<ActionButtonProps>`
  padding: 0.875rem 1.125rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background: ${(p) =>
    p.selected
      ? "linear-gradient(135deg, #ff5f6d, #ff5f6d)"
      : "rgba(68, 68, 68, 0.6)"};
  border: none;
  border-radius: 8px;
  color: white;
  outline: ${(p) => (p.selected ? "2px solid #ff5f6d" : "none")};
  box-shadow: ${(p) =>
    p.selected
      ? "0 4px 12px rgba(76, 175, 80, 0.24)"
      : "0 2px 6px rgba(0, 0, 0, 0.12)"};
  transition:
    background 160ms ease,
    outline 120ms ease,
    box-shadow 160ms ease,
    transform 80ms ease;
  text-align: center;
  user-select: none;

  &:active {
    transform: translateY(1px);
  }

  &:focus {
    outline: 3px solid rgba(184, 255, 176, 0.22);
  }
`;

/**
 * Small helper text below the buttons
 */
export const HelperText = styled.p`
  margin-top: 1.25rem;
  opacity: 0.82;
  font-size: 0.875rem;
  line-height: 1.4;
`;
