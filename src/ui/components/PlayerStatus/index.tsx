import React from "react";
import {
  Container,
  HeaderRow,
  Title,
  StatRow,
  Label,
  Value,
  HealthBarWrapper,
  HealthFill,
  ScoreBadge,
} from "./index.styles";

/**
 * Props for PlayerStatus component.
 *
 * - `health`: current player health value (clamped 0..maxHealth).
 * - `score`: current player score.
 * - `maxHealth`: optional maximum health value used to render the bar. Default: 100.
 */
export type PlayerStatusProps = {
  health: number;
  score: number;
  maxHealth?: number;
};

/**
 * Utility: clamp a number between min and max (inclusive).
 * Small pure function kept for testability and to avoid inline magic.
 * @param v - value to clamp
 * @param min - minimum allowed value
 * @param max - maximum allowed value
 */
function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/**
 * PlayerStatus
 *
 * Presents a compact, accessible HUD element with:
 * - Title ("Player")
 * - Health row with a colored progress bar
 * - Score row with an accent badge
 *
 * Design choices:
 * - The component is pure and stateless: it receives values via props and renders deterministically.
 * - Presentation is extracted to styled components to keep logic and markup small and testable.
 * - Health fill transition uses CSS for smooth visual updates (no layout thrashing).
 * - Accessibility: `role="status"` is used by parent where appropriate; the element uses clear text labels.
 *
 * Example usage:
 * <PlayerStatus health={78} score={1240} maxHealth={120} />
 */
export const PlayerStatus: React.FC<PlayerStatusProps> = ({
  health,
  score,
  maxHealth = 100,
}) => {
  // Ensure maxHealth is positive and avoid division by zero.
  const safeMax = Math.max(1, maxHealth);

  // Clamp health to valid range and compute fill percent for the bar.
  const clamped = clamp(Math.round(health), 0, safeMax);
  const fillPercent = (clamped / safeMax) * 100;

  return (
    <Container aria-label="Player status" role="group">
      <HeaderRow>
        <Title>Player</Title>
        <ScoreBadge aria-hidden={false} title={`Score: ${score}`}>
          <span>⭐</span>
          <span>{score}</span>
        </ScoreBadge>
      </HeaderRow>

      <StatRow aria-hidden={false}>
        <Label>Health</Label>
        <Value>
          {clamped}/{safeMax}
        </Value>
      </StatRow>

      <HealthBarWrapper
        aria-hidden={false}
        aria-label={`Health ${clamped} of ${safeMax}`}
      >
        <HealthFill fillPercent={fillPercent} />
      </HealthBarWrapper>
    </Container>
  );
};

export default PlayerStatus;
