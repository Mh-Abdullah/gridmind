"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface CellFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  alignment?: "left" | "center" | "right";
  textColor?: string;
  backgroundColor?: string;
  fontSize?: number;
}

interface UseSpreadsheetSyncProps {
  tableId: string;
  userId: string;
  initialName?: string;
}

interface SpreadsheetState {
  cells: { [key: string]: string };
  numRows: number;
  numCols: number;
  name: string;
  cellFormatting: { [key: string]: CellFormatting };
  columnWidths: { [key: number]: number };
  rowHeights: { [key: number]: number };
}

export function useSpreadsheetSync({
  tableId,
  userId,
  initialName = "Untitled Project",
}: UseSpreadsheetSyncProps) {
  const [spreadsheetId, setSpreadsheetId] = useState<Id<"spreadsheets"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Convex mutations
  const getOrCreateSpreadsheet = useMutation(api.spreadsheets.getOrCreateSpreadsheet);
  const updateCell = useMutation(api.spreadsheets.updateCell);
  const updateCellsBatch = useMutation(api.spreadsheets.updateCellsBatch);
  const updateMetadata = useMutation(api.spreadsheets.updateSpreadsheetMetadata);
  const updateCellFormattingMutation = useMutation(api.spreadsheets.updateCellFormatting);
  const updateColumnWidthMutation = useMutation(api.spreadsheets.updateColumnWidth);
  const updateRowHeightMutation = useMutation(api.spreadsheets.updateRowHeight);

  // Convex queries - real-time subscriptions
  const spreadsheet = useQuery(
    api.spreadsheets.getSpreadsheet,
    tableId ? { tableId } : "skip"
  );
  const cells = useQuery(
    api.spreadsheets.getCells,
    spreadsheetId ? { spreadsheetId } : "skip"
  );
  const cellFormatting = useQuery(
    api.spreadsheets.getCellFormatting,
    spreadsheetId ? { spreadsheetId } : "skip"
  );
  const columnWidths = useQuery(
    api.spreadsheets.getColumnWidths,
    spreadsheetId ? { spreadsheetId } : "skip"
  );
  const rowHeights = useQuery(
    api.spreadsheets.getRowHeights,
    spreadsheetId ? { spreadsheetId } : "skip"
  );

  // Debounce refs for batching updates
  const pendingCellUpdates = useRef<Map<string, string>>(new Map());
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize spreadsheet
  useEffect(() => {
    if (!tableId || !userId) return;

    const init = async () => {
      setIsLoading(true);
      try {
        const id = await getOrCreateSpreadsheet({
          tableId,
          userId,
          name: initialName,
        });
        setSpreadsheetId(id);
      } catch (error) {
        console.error("Failed to initialize spreadsheet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [tableId, userId, initialName, getOrCreateSpreadsheet]);

  // Set spreadsheetId when query returns
  useEffect(() => {
    if (spreadsheet?._id) {
      setSpreadsheetId(spreadsheet._id);
      setIsLoading(false);
    }
  }, [spreadsheet]);

  // Flush pending cell updates
  const flushCellUpdates = useCallback(async () => {
    if (!spreadsheetId || pendingCellUpdates.current.size === 0) return;

    setIsSaving(true);
    try {
      const updates = Array.from(pendingCellUpdates.current.entries()).map(
        ([cellKey, value]) => ({ cellKey, value })
      );
      pendingCellUpdates.current.clear();

      await updateCellsBatch({
        spreadsheetId,
        cells: updates,
      });
      setLastSaved(new Date());
    } catch (error) {
      console.error("Failed to save cells:", error);
    } finally {
      setIsSaving(false);
    }
  }, [spreadsheetId, updateCellsBatch]);

  // Debounced cell update
  const setCellValue = useCallback(
    (row: number, col: number, value: string) => {
      if (!spreadsheetId) return;

      const cellKey = `${row}-${col}`;
      pendingCellUpdates.current.set(cellKey, value);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer to flush updates after 300ms of inactivity
      debounceTimerRef.current = setTimeout(() => {
        flushCellUpdates();
      }, 300);
    },
    [spreadsheetId, flushCellUpdates]
  );

  // Immediate cell update (for important changes)
  const setCellValueImmediate = useCallback(
    async (row: number, col: number, value: string) => {
      if (!spreadsheetId) return;

      setIsSaving(true);
      try {
        await updateCell({
          spreadsheetId,
          cellKey: `${row}-${col}`,
          value,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to save cell:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [spreadsheetId, updateCell]
  );

  // Batch update cells (for paste, import operations)
  const setCellsBatch = useCallback(
    async (cellUpdates: { [key: string]: string }) => {
      if (!spreadsheetId) return;

      setIsSaving(true);
      try {
        const updates = Object.entries(cellUpdates).map(([cellKey, value]) => ({
          cellKey,
          value,
        }));
        await updateCellsBatch({
          spreadsheetId,
          cells: updates,
        });
        setLastSaved(new Date());
      } catch (error) {
        console.error("Failed to batch save cells:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [spreadsheetId, updateCellsBatch]
  );

  // Update spreadsheet metadata
  const setMetadata = useCallback(
    async (updates: { name?: string; numRows?: number; numCols?: number }) => {
      if (!spreadsheetId) return;

      try {
        await updateMetadata({
          spreadsheetId,
          ...updates,
        });
      } catch (error) {
        console.error("Failed to update metadata:", error);
      }
    },
    [spreadsheetId, updateMetadata]
  );

  // Update cell formatting
  const setCellFormatting = useCallback(
    async (row: number, col: number, formatting: CellFormatting) => {
      if (!spreadsheetId) return;

      try {
        await updateCellFormattingMutation({
          spreadsheetId,
          cellKey: `${row}-${col}`,
          formatting,
        });
      } catch (error) {
        console.error("Failed to update cell formatting:", error);
      }
    },
    [spreadsheetId, updateCellFormattingMutation]
  );

  // Update column width
  const setColumnWidth = useCallback(
    async (colIndex: number, width: number) => {
      if (!spreadsheetId) return;

      try {
        await updateColumnWidthMutation({
          spreadsheetId,
          colIndex,
          width,
        });
      } catch (error) {
        console.error("Failed to update column width:", error);
      }
    },
    [spreadsheetId, updateColumnWidthMutation]
  );

  // Update row height
  const setRowHeight = useCallback(
    async (rowIndex: number, height: number) => {
      if (!spreadsheetId) return;

      try {
        await updateRowHeightMutation({
          spreadsheetId,
          rowIndex,
          height,
        });
      } catch (error) {
        console.error("Failed to update row height:", error);
      }
    },
    [spreadsheetId, updateRowHeightMutation]
  );

  // Flush on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Flush remaining updates synchronously
      if (pendingCellUpdates.current.size > 0) {
        flushCellUpdates();
      }
    };
  }, [flushCellUpdates]);

  // Flush before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingCellUpdates.current.size > 0) {
        // Use sendBeacon for reliable last-minute saves
        flushCellUpdates();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [flushCellUpdates]);

  // Stabilize objects to prevent new references on every render
  const stableCells = useMemo(() => cells ?? {}, [JSON.stringify(cells)]);
  const stableCellFormatting = useMemo(() => cellFormatting ?? {}, [JSON.stringify(cellFormatting)]);
  const stableColumnWidths = useMemo(() => columnWidths ?? {}, [JSON.stringify(columnWidths)]);
  const stableRowHeights = useMemo(() => rowHeights ?? {}, [JSON.stringify(rowHeights)]);

  return {
    // State
    spreadsheetId,
    isLoading,
    isSaving,
    lastSaved,
    
    // Real-time data from Convex (stabilized)
    cells: stableCells,
    cellFormatting: stableCellFormatting,
    columnWidths: stableColumnWidths,
    rowHeights: stableRowHeights,
    spreadsheet: spreadsheet ?? null,

    // Actions
    setCellValue,
    setCellValueImmediate,
    setCellsBatch,
    setMetadata,
    setCellFormatting,
    setColumnWidth,
    setRowHeight,
    flushCellUpdates,
  };
}
