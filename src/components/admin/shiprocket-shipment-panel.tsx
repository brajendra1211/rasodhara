"use client";

import { useState, useTransition } from "react";
import { retryShiprocketShipment } from "@/lib/actions/shiprocket";

export function ShiprocketShipmentPanel({
  orderId,
  shiprocketOrderId,
  shiprocketAwbCode,
  shiprocketCourierName,
  shiprocketTrackingUrl,
  shiprocketError,
}: {
  orderId: string;
  shiprocketOrderId: string | null;
  shiprocketAwbCode: string | null;
  shiprocketCourierName: string | null;
  shiprocketTrackingUrl: string | null;
  shiprocketError: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(shiprocketError);

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await retryShiprocketShipment(orderId);
      if (!result.success) {
        setError(result.error ?? "Failed to create shipment.");
      }
    });
  }

  if (shiprocketOrderId) {
    return (
      <div className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4 text-xs text-zinc-500 dark:border-zinc-800">
        <p>Shiprocket order: {shiprocketOrderId}</p>
        {shiprocketAwbCode ? (
          <>
            <p>AWB: {shiprocketAwbCode}</p>
            {shiprocketCourierName && <p>Courier: {shiprocketCourierName}</p>}
            {shiprocketTrackingUrl && (
              <a
                href={shiprocketTrackingUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-amber-700 hover:underline dark:text-amber-400"
              >
                Track shipment
              </a>
            )}
          </>
        ) : (
          <p>Courier not yet assigned &mdash; assign one from the Shiprocket dashboard.</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-zinc-200 p-4 text-sm dark:border-zinc-800">
      <p className="text-zinc-500">No Shiprocket shipment yet.</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="button"
        onClick={handleCreate}
        disabled={pending}
        className="w-fit rounded-full border border-amber-700 px-4 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-60 dark:text-amber-400 dark:hover:bg-amber-950"
      >
        {pending ? "Creating..." : "Create Shiprocket shipment"}
      </button>
    </div>
  );
}
