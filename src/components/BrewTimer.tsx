import React, { useState, useRef, useEffect, useCallback } from "react";
import { Vibration, AppState, type AppStateStatus } from "react-native";
import { styled, DefaultTheme } from "styled-components/native";
import * as Haptics from "expo-haptics";

interface BrewTimerProps {
  /** Countdown length in seconds (step cue from recipe). */
  initialTime?: number;
  onComplete?: () => void;
  /** Legacy name: also triggers haptic + optional vibration when countdown hits zero. */
  vibrate?: boolean;
}

const TimerContainer = styled.View`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
  align-items: center;
  justify-content: center;
  margin: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`} 0;
`;

const TimerDisplay = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.mono};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.accent.gold};
  text-align: center;
`;

const TimerHint = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  text-align: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const TimerControls = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const TimerButton = styled.TouchableOpacity<{
  variant: "primary" | "secondary";
}>`
  background-color: ${({
    theme,
    variant,
  }: {
    theme: DefaultTheme;
    variant: "primary" | "secondary";
  }) =>
    variant === "primary"
      ? theme.colors.accent.gold
      : theme.colors.background.tertiary};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  margin: 0 ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.sm}px`};
  min-width: 100px;
  align-items: center;
`;

const ButtonText = styled.Text<{ variant: "primary" | "secondary" }>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.displaySmall};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({
    theme,
    variant,
  }: {
    theme: DefaultTheme;
    variant: "primary" | "secondary";
  }) =>
    variant === "primary"
      ? theme.colors.text.onAccent
      : theme.colors.text.primary};
`;

/**
 * **Countdown** timer aligned to wall clock: remaining time = deadline − now.
 * Survives brief backgrounding: when the app returns to the foreground, the
 * display resyncs from the same deadline (minimal recovery for v1).
 *
 * Changing `initialTime` does not restart the countdown. To start fresh with a
 * new length, give the timer a new `key`.
 */
export const BrewTimer: React.FC<BrewTimerProps> = ({
  initialTime = 180,
  onComplete,
  vibrate = true,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const deadlineMsRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsLeftRef = useRef(initialTime);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  const clearRunningInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const fireComplete = useCallback(() => {
    deadlineMsRef.current = null;
    setIsRunning(false);
    clearRunningInterval();
    secondsLeftRef.current = 0;
    setSecondsLeft(0);
    if (vibrate) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {
          Vibration.vibrate(400);
        },
      );
    }
    onCompleteRef.current?.();
  }, [vibrate]);

  const syncFromDeadline = useCallback(() => {
    if (deadlineMsRef.current == null) {
      return;
    }
    const left = Math.max(
      0,
      Math.ceil((deadlineMsRef.current - Date.now()) / 1000),
    );
    secondsLeftRef.current = left;
    setSecondsLeft(left);
    if (left <= 0) {
      fireComplete();
    }
  }, [fireComplete]);

  useEffect(() => {
    if (!isRunning) {
      clearRunningInterval();
      return;
    }
    intervalRef.current = setInterval(syncFromDeadline, 250);
    return () => clearRunningInterval();
  }, [isRunning, syncFromDeadline]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "active" && isRunning) {
        syncFromDeadline();
      }
    });
    return () => sub.remove();
  }, [isRunning, syncFromDeadline]);

  const pause = useCallback(() => {
    if (deadlineMsRef.current != null) {
      const left = Math.max(
        0,
        Math.ceil((deadlineMsRef.current - Date.now()) / 1000),
      );
      secondsLeftRef.current = left;
      setSecondsLeft(left);
    }
    deadlineMsRef.current = null;
    setIsRunning(false);
    clearRunningInterval();
  }, []);

  const toggleTimer = () => {
    if (isRunning) {
      pause();
      return;
    }
    const base =
      secondsLeftRef.current <= 0 ? initialTime : secondsLeftRef.current;
    deadlineMsRef.current = Date.now() + base * 1000;
    setIsRunning(true);
  };

  const resetTimer = () => {
    pause();
    secondsLeftRef.current = initialTime;
    setSecondsLeft(initialTime);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const timeSpoken = formatTime(secondsLeft);

  return (
    <TimerContainer accessibilityLiveRegion="polite">
      <TimerHint>Countdown · tap Start when you begin this step</TimerHint>
      <TimerDisplay
        accessibilityLabel={`Time remaining ${timeSpoken}`}
        importantForAccessibility="yes"
      >
        {timeSpoken}
      </TimerDisplay>
      <TimerControls>
        <TimerButton
          variant="primary"
          onPress={toggleTimer}
          accessibilityRole="button"
          accessibilityLabel={isRunning ? "Pause timer" : "Start timer"}
        >
          <ButtonText variant="primary">
            {isRunning ? "Pause" : "Start"}
          </ButtonText>
        </TimerButton>
        <TimerButton
          variant="secondary"
          onPress={resetTimer}
          accessibilityRole="button"
          accessibilityLabel="Reset timer"
        >
          <ButtonText variant="secondary">Reset</ButtonText>
        </TimerButton>
      </TimerControls>
    </TimerContainer>
  );
};
