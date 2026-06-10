"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useSpreadsheetSync } from "@/lib/use-spreadsheet-sync";
import { Loader2 } from "lucide-react";

interface SpreadsheetSyncWrapperProps {
  children: (props: SpreadsheetSyncContext) => React.ReactNode;
}

export interface SpreadsheetSyncContext {
  // Synced state
  cells: { [key: string]: string };
  cellFormatting: { [key: string]: CellFormatting };
  columnWidths: { [key: number]: number };
  rowHeights: { [key: number]: number };
  numRows: number;
  numCols: number;
  projectName: string;

  // Local state setters that also sync to Convex
  setCellValue: (row: number, col: number, value: string) => void;
  setCellsBatch: (cellUpdates: { [key: string]: string }) => void;
  setCellFormatting: (row: number, col: number, formatting: CellFormatting) => void;
  setColumnWidth: (colIndex: number, width: number) => void;
  setRowHeight: (rowIndex: number, height: number) => void;
  setNumRows: (rows: number) => void;
  setNumCols: (cols: number) => void;
  setProjectName: (name: string) => void;

  // Status
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  isConnected: boolean;
}

interface CellFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  alignment?: "left" | "center" | "right";
  textColor?: string;
  backgroundColor?: string;
  fontSize?: number;
}

export function SpreadsheetSyncProvider({
  children,
}: SpreadsheetSyncWrapperProps) {
  const params = useParams();
  const { user } = useAuth();
  const tableId = params?.id as string;

  // Local state that syncs with Convex
  const [localCells, setLocalCells] = useState<{ [key: string]: string }>({});
  const [localFormatting, setLocalFormatting] = useState<{ [key: string]: CellFormatting }>({});
  const [localColumnWidths, setLocalColumnWidths] = useState<{ [key: number]: number }>({});
  const [localRowHeights, setLocalRowHeights] = useState<{ [key: number]: number }>({});
  const [localNumRows, setLocalNumRows] = useState(1);
  const [localNumCols, setLocalNumCols] = useState(1);
  const [localProjectName, setLocalProjectName] = useState("Untitled Project");
  const [isInitialized, setIsInitialized] = useState(false);

  // Only use Convex sync if we have tableId and user
  const shouldSync = Boolean(tableId && user?.id);
  
  const sync = shouldSync
    ? useSpreadsheetSync({
        tableId: tableId || "",
        userId: user?.id || "",
        initialName: localProjectName,
      })
    : null;

  // Initialize local state from Convex data
  useEffect(() => {
    if (sync && !isInitialized) {
      if (Object.keys(sync.cells).length > 0 || sync.spreadsheet) {
        setLocalCells(sync.cells);
        setLocalFormatting(sync.cellFormatting);
        setLocalColumnWidths(sync.columnWidths);
        setLocalRowHeights(sync.rowHeights);
        if (sync.spreadsheet) {
          setLocalNumRows(sync.spreadsheet.numRows || 1);
          setLocalNumCols(sync.spreadsheet.numCols || 1);
          setLocalProjectName(sync.spreadsheet.name || "Untitled Project");
        }
        setIsInitialized(true);
      }
    }
  }, [sync?.cells, sync?.spreadsheet, isInitialized]);

  // Keep local state in sync with Convex (for real-time updates from other clients)
  useEffect(() => {
    if (sync && isInitialized) {
      setLocalCells(sync.cells);
    }
  }, [sync?.cells, isInitialized]);

  useEffect(() => {
    if (sync && isInitialized) {
      setLocalFormatting(sync.cellFormatting);
    }
  }, [sync?.cellFormatting, isInitialized]);

  useEffect(() => {
    if (sync && isInitialized) {
      setLocalColumnWidths(sync.columnWidths);
    }
  }, [sync?.columnWidths, isInitialized]);

  useEffect(() => {
    if (sync && isInitialized) {
      setLocalRowHeights(sync.rowHeights);
    }
  }, [sync?.rowHeights, isInitialized]);

  // Wrapped setters that update local state and sync to Convex
  const setCellValue = useCallback(
    (row: number, col: number, value: string) => {
      const cellKey = `${row}-${col}`;
      setLocalCells((prev) => ({ ...prev, [cellKey]: value }));
      sync?.setCellValue(row, col, value);
    },
    [sync]
  );

  const setCellsBatch = useCallback(
    (cellUpdates: { [key: string]: string }) => {
      setLocalCells((prev) => ({ ...prev, ...cellUpdates }));
      sync?.setCellsBatch(cellUpdates);
    },
    [sync]
  );

  const setCellFormatting = useCallback(
    (row: number, col: number, formatting: CellFormatting) => {
      const cellKey = `${row}-${col}`;
      setLocalFormatting((prev) => ({ ...prev, [cellKey]: formatting }));
      sync?.setCellFormatting(row, col, formatting);
    },
    [sync]
  );

  const setColumnWidth = useCallback(
    (colIndex: number, width: number) => {
      setLocalColumnWidths((prev) => ({ ...prev, [colIndex]: width }));
      sync?.setColumnWidth(colIndex, width);
    },
    [sync]
  );

  const setRowHeight = useCallback(
    (rowIndex: number, height: number) => {
      setLocalRowHeights((prev) => ({ ...prev, [rowIndex]: height }));
      sync?.setRowHeight(rowIndex, height);
    },
    [sync]
  );

  const setNumRows = useCallback(
    (rows: number) => {
      setLocalNumRows(rows);
      sync?.setMetadata({ numRows: rows });
    },
    [sync]
  );

  const setNumCols = useCallback(
    (cols: number) => {
      setLocalNumCols(cols);
      sync?.setMetadata({ numCols: cols });
    },
    [sync]
  );

  const setProjectName = useCallback(
    (name: string) => {
      setLocalProjectName(name);
      sync?.setMetadata({ name });
    },
    [sync]
  );

  // Show loading state
  if (sync?.isLoading && !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading spreadsheet...</p>
        </div>
      </div>
    );
  }

  const context: SpreadsheetSyncContext = {
    cells: localCells,
    cellFormatting: localFormatting,
    columnWidths: localColumnWidths,
    rowHeights: localRowHeights,
    numRows: localNumRows,
    numCols: localNumCols,
    projectName: localProjectName,
    setCellValue,
    setCellsBatch,
    setCellFormatting,
    setColumnWidth,
    setRowHeight,
    setNumRows,
    setNumCols,
    setProjectName,
    isLoading: sync?.isLoading ?? false,
    isSaving: sync?.isSaving ?? false,
    lastSaved: sync?.lastSaved ?? null,
    isConnected: shouldSync,
  };

  return <>{children(context)}</>;
}

// Saving indicator component
export function SavingIndicator({
  isSaving,
  lastSaved,
  isConnected,
}: {
  isSaving: boolean;
  lastSaved: Date | null;
  isConnected: boolean;
}) {
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
        <span>Offline mode</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-xs text-foreground">
        <div className="h-2 w-2 rounded-full bg-foreground" />
        <span>Saved</span>
      </div>
    );
  }

  return null;
}
