/**
 * IMPORTS
 */
import { useEffect, useState } from "react";
import { AppState } from "react-native";

const MS_PER_MINUTE = 60_000;

const getElapsedMinutes = (startedAtMs: number) => Math.max(0, Math.floor((Date.now() - startedAtMs) / MS_PER_MINUTE));

// Tempo até o próximo minuto cheio contado a partir do início (ou até o início, se for futuro).
const getDelayToNextMinute = (startedAtMs: number) => {
  const diff = Date.now() - startedAtMs;
  return diff < 0 ? -diff : MS_PER_MINUTE - (diff % MS_PER_MINUTE);
};

// Minutos desde `startedAtMs`, atualizados na virada de cada minuto.
// - Re-render só de quem chama, e só quando o minuto muda (mesmo valor → React ignora).
// - Pausa em segundo plano e recalcula ao voltar (o relógio do aparelho é a fonte da verdade).
// - Limpa timer e listener ao desmontar ou quando o início muda.
// Use em um componente folha (só o texto do tempo), nunca no ViewModel da tela.
const useElapsedMinutes = (startedAtMs: number | null) => {
  const [minutes, setMinutes] = useState(() => (startedAtMs === null ? 0 : getElapsedMinutes(startedAtMs)));

  useEffect(() => {
    if (startedAtMs === null) {
      setMinutes(0);
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;

    const stop = () => {
      if (timeout !== undefined) clearTimeout(timeout);
      timeout = undefined;
    };

    const tick = () => {
      stop();
      setMinutes(getElapsedMinutes(startedAtMs));
      timeout = setTimeout(tick, getDelayToNextMinute(startedAtMs));
    };

    tick();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") tick();
      else stop();
    });

    return () => {
      stop();
      subscription.remove();
    };
  }, [startedAtMs]);

  return minutes;
};

/**
 * EXPORTS
 */
export { useElapsedMinutes };
