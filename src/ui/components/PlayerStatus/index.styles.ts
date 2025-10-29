import styled from "styled-components";

/**
 * Styled components for PlayerStatus.
 *
 * Keeping presentation isolated improves reusability, theming and readability.
 * Use ThemeProvider in the future to centralize colors / spacing.
 */

/** Wrapper for the whole status widget */
export const Container = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.45);
  border-radius: 8px;
  min-width: 180px;
  color: #ffffff;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial;
`;

/** Top row containing title and optional badges */
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/** Title "Player" */
export const Title = styled.div`
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
`;

/** Generic row for each stat */
export const StatRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/** Label on left side of a stat row */
export const Label = styled.span`
  font-size: 0.82rem;
  opacity: 0.9;
`;

/** Value on right side of a stat row */
export const Value = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

/** Wrapper for the health bar */
export const HealthBarWrapper = styled.div`
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.25rem;
`;

/** Colored fill of the health bar */
export const HealthFill = styled.div<{ $fillPercent: number }>`
  height: 100%;
  width: ${(p) => Math.max(0, Math.min(100, p.$fillPercent))}%;
  transition: width 220ms ease;
  background: linear-gradient(90deg, #ff5f6d, #ffc371);
`;

/** Accent badge for the score */
export const ScoreBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
`;
