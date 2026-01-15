"use client";

import { useEffect, useState } from "react";
import { RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAUpdateToast() {
  const [show, setShow] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const onUpdate = (registration: ServiceWorkerRegistration) => {
      setShow(true);
      setWaitingWorker(registration.waiting);
    };

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        if (registration.waiting) {
          onUpdate(registration);
        }
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                onUpdate(registration);
              }
            });
          }
        });
      }
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[100]"
        >
          <div className="glass p-4 rounded-2xl border border-[var(--primary)] shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-[var(--primary)] animate-spin-slow" />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">Dostępna aktualizacja!</p>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-black">
                  Odśwież, aby pobrać nowości
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={reloadPage}
                className="px-4 py-2 bg-[var(--primary)] text-black rounded-lg text-xs font-bold hover:scale-105 transition-transform"
              >
                ODŚWIEŻ
              </button>
              <button
                onClick={() => setShow(false)}
                className="p-2 hover:bg-[var(--surface)] transition-colors rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
