/**
 * IMPORTS
 */
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/shared/data/store/zustand/app/app-store";
import { useNextEntryRoute } from "@/shared/presentation/routes/hooks/use-next-entry-route";

type SyncStepStatus = "pending" | "running" | "done";

type SyncStepItem = {
  key: string;
  label: string;
  status: SyncStepStatus;
};

const SYNC_STEPS = [
  { key: "connect", label: "Conectando ao servidor" },
  { key: "download", label: "Baixando seus dados" },
  { key: "offline", label: "Preparando o uso offline" },
  { key: "finish", label: "Finalizando" },
];

const STEP_DURATION_MS = 1200;

const useSyncViewModel = () => {
  const completeSync = useAppStore((state) => state.completeSync);
  const nextEntryRoute = useNextEntryRoute();
  const [completedSteps, setCompletedSteps] = useState(0);

  // Por enquanto só a tela: cada etapa é simulada com um timer.
  // Quando os endpoints existirem, troque por um SyncService (skill create-api-flow)
  // que avança `completedSteps` conforme cada download termina.
  useEffect(() => {
    if (completedSteps >= SYNC_STEPS.length) return;
    const timer = setTimeout(() => setCompletedSteps((count) => count + 1), STEP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [completedSteps]);

  const steps: SyncStepItem[] = SYNC_STEPS.map((step, index) => ({
    ...step,
    status: index < completedSteps ? "done" : index === completedSteps ? "running" : "pending",
  }));

  const onContinue = useCallback(() => {
    completeSync();
    router.replace(nextEntryRoute());
  }, [completeSync, nextEntryRoute]);

  return {
    steps,
    progress: completedSteps / SYNC_STEPS.length,
    isDone: completedSteps === SYNC_STEPS.length,
    onContinue,
  };
};

type SyncViewModel = ReturnType<typeof useSyncViewModel>;

/**
 * EXPORTS
 */
export type { SyncStepItem, SyncStepStatus, SyncViewModel };
export { useSyncViewModel };
