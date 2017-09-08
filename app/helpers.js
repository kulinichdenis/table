export const isCellBeingSelected = ({ row, column, startRow, endRow, startColumn, endColumn, selectedStart }) => {
  const minRow = Math.min(startRow, endRow);
  const maxRow = Math.max(startRow, endRow);
  const minColumn = Math.min(startColumn, endColumn);
  const maxColumn = Math.max(startColumn, endColumn);
  return (
    selectedStart &&
    (row >= minRow &&
      row <= maxRow &&
      column >= minColumn &&
      column <= maxColumn)
  );
};
