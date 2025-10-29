import styled from "styled-components";

/**
 * Styled components for Menu.
 *
 * Keeping styles isolated improves readability, reusability and allows
 * future theming (ThemeProvider) without changing component logic.
 */

/**
 * Overlay that covers the screen when menu is open.
 */
export const Overlay = styled.div`
  position: fixed;
  inset: 0; /* shorthand for top:0; right:0; bottom:0; left:0; */
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
  background-color: #222;
  color: #fff;
  min-width: 320px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
`;

/**
 * Title style
 */
export const Title = styled.h1`
  margin: 0;
  margin-bottom: 1rem;
  font-size: 1.6rem;
`;

/**
 * Buttons wrapper
 */
export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
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
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  background-color: ${(p) => (p.selected ? "#4CAF50" : "#444")};
  border: none;
  border-radius: 6px;
  color: white;
  outline: ${(p) => (p.selected ? "2px solid #b8ffb0" : "none")};
  box-shadow: ${(p) =>
    p.selected ? "inset 0 -3px 0 rgba(0,0,0,0.12)" : "none"};
  transition:
    background-color 120ms ease,
    outline 120ms ease;
  text-align: center;
  user-select: none;

  &:active {
    transform: translateY(1px);
  }

  &:focus {
    outline: 3px solid rgba(184, 255, 176, 0.18);
  }
`;

/**
 * Small helper text below the buttons
 */
export const HelperText = styled.p`
  margin-top: 1rem;
  opacity: 0.85;
  font-size: 0.9rem;
`;
