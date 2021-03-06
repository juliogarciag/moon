import React, {
  useMemo,
  createContext,
  useContext,
  memo,
  useState,
  useEffect,
  useCallback
} from "react";
import { useTable } from "react-table";
import { FixedSizeList } from "react-window";
import classNames from "classnames";
import numbro from "numbro";
import useWindowSize from "./useWindowSize";
import DescriptionCell from "components/DescriptionCell";
import DateCell from "components/DateCell";
import AmountCentsCell from "components/AmountCentsCell";
import CreateEntryButton from "./CreateEntryButton";
import DiscardEntryButton from "./DiscardEntryButton";
import ShowHistoryButton from "./ShowHistoryButton";
import SelectionContext from "./SelectionContext";

// NOTE: Bypass re-render of react-window's FixedSizedList component
// because re-rendering FixedSizedList component ends up in lose of focus.
const PrepareRowsContext = createContext();

const COLUMN_STYLES = {
  description: "w-4/12",
  date: "w-2/12",
  amountCents: "w-2/12 text-right",
  totalCents: "w-2/12 text-right",
  actions: "w-2/12 text-right"
};

function Row({ index, style }) {
  const { rows, prepareRow } = useContext(PrepareRowsContext);
  const row = rows[index];
  const entry = row.original;

  return (
    prepareRow(row) || (
      <div
        {...row.getRowProps({ style })}
        className={classNames(
          "flex items-center border-b border-r border-solid border-gray-400",
          {
            [`${
              entry.isInTheFuture ? "bg-gray-300" : "bg-marzipan-300"
            } font-bold`]: entry.isLastOfMonth,
            [`${
              entry.isInTheFuture ? "bg-gray-500" : "bg-marzipan-700"
            } font-bold`]: entry.isLastOfYear,
            "border-t-2": entry.isFirstInTheFuture
          }
        )}
      >
        {row.cells.map(cell => {
          return (
            <div
              {...cell.getCellProps()}
              className={COLUMN_STYLES[cell.column.id]}
            >
              {cell.render("Cell")}
            </div>
          );
        })}
      </div>
    )
  );
}

function wrapEditableCell(Component) {
  return props => {
    const { selection, setSelection } = useContext(SelectionContext);
    const entryId = props.row.original.id;
    const columnId = props.column.id;
    const isSelected =
      entryId === selection.entryId && columnId === selection.columnId;

    const handleClick = () => {
      if (isSelected) {
        if (!selection.isOpen) {
          setSelection({ ...selection, isOpen: true });
        }
      } else {
        setSelection({ entryId, columnId, isOpen: false });
      }
    };

    const closeCell = useCallback(() => {
      setSelection({ ...selection, isOpen: false });
    }, [selection, setSelection]);

    const isEntrySpecial = entry => entry.isLastOfMonth || entry.isLastOfYear;

    return (
      <div
        onClick={handleClick}
        className="flex w-full h-full relative"
        style={{ height: "38px" }}
      >
        {isSelected ? (
          <div className="pointer-events-none w-full h-full absolute border-solid border-2 border-blue-600"></div>
        ) : (
          <div
            className={classNames("w-full h-full absolute", {
              "border-r border-solid border-gray-300": !isEntrySpecial(
                props.row.original
              )
            })}
          ></div>
        )}
        <Component
          {...props}
          isOpen={isSelected && selection.isOpen}
          closeCell={closeCell}
        />
      </div>
    );
  };
}

const WrappedDescriptionCell = wrapEditableCell(DescriptionCell);
const WrappedDateCell = wrapEditableCell(DateCell);
const WrappedAmountCell = wrapEditableCell(AmountCentsCell);

const COLUMNS_ORDER = ["description", "date", "amountCents"];

function EntriesTable({ entries, tableWindowRef, setNewEntryId }) {
  const [hasFirstSelectionHappened, setHasFirstSelectionHappened] = useState(
    false
  );

  const { selection, setSelection } = useContext(SelectionContext);

  useEffect(() => {
    if (
      entries.length > 0 &&
      !hasFirstSelectionHappened &&
      selection.entryId === null
    ) {
      setSelection({
        entryId: entries[0].id,
        columnId: "description",
        isOpen: false
      });
      setHasFirstSelectionHappened(true);
    }
  }, [entries]);

  const columns = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: WrappedDescriptionCell
      },
      {
        Header: () => (
          <>
            Date <span className="font-light">(mm/dd/yyyy)</span>
          </>
        ),
        accessor: "date",
        Cell: WrappedDateCell
      },
      {
        Header: "Amount",
        accessor: "amountCents",
        Cell: WrappedAmountCell
      },
      {
        Header: "Total",
        accessor: "totalCents",
        Cell: ({ cell: { value } }) => (
          <span className="font-mono">
            {numbro(value / 100).formatCurrency({
              average: false,
              thousandSeparated: true,
              mantissa: 2
            })}
          </span>
        )
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: props => (
          <div className="flex justify-end">
            <CreateEntryButton
              {...props}
              afterCreate={newEntry => {
                setNewEntryId(newEntry.id);
              }}
            />
            <DiscardEntryButton {...props} />
            <ShowHistoryButton {...props} />
          </div>
        )
      }
    ],
    [entries, selection, setSelection]
  );

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow
  } = useTable({
    columns,
    data: entries
  });

  const windowSize = useWindowSize();
  const tableHeight = useMemo(() => {
    const headerHeight = 38;
    return windowSize.innerHeight - headerHeight;
  }, [windowSize]);

  const handleRight = useCallback(() => {
    if (selection.entryId) {
      const currentColumnIndex = COLUMNS_ORDER.indexOf(selection.columnId);
      const nextColumnIndex = currentColumnIndex + 1;
      const nextColumnId = COLUMNS_ORDER[nextColumnIndex];

      if (nextColumnId) {
        setSelection({
          entryId: selection.entryId,
          columnId: nextColumnId,
          isOpen: false
        });
      }
    }
  }, [selection, setSelection]);

  const handleLeft = useCallback(() => {
    if (selection.entryId) {
      const currentColumnIndex = COLUMNS_ORDER.indexOf(selection.columnId);
      const nextColumnIndex = currentColumnIndex - 1;
      const nextColumnId = COLUMNS_ORDER[nextColumnIndex];

      if (nextColumnId) {
        setSelection({
          entryId: selection.entryId,
          columnId: nextColumnId,
          isOpen: false
        });
      }
    }
  }, [selection, setSelection]);

  const handleUp = useCallback(() => {
    if (selection.entryId) {
      const entryIndex = entries.findIndex(
        entry => entry.id === selection.entryId
      );
      const nextIndex = entryIndex - 1;
      const nextEntry = entries[nextIndex];

      if (nextEntry) {
        setSelection({
          entryId: nextEntry.id,
          columnId: selection.columnId,
          isOpen: false
        });
      }
    }
  }, [selection, setSelection, entries]);

  const handleDown = useCallback(() => {
    if (selection.entryId) {
      const entryIndex = entries.findIndex(
        entry => entry.id === selection.entryId
      );
      const nextIndex = entryIndex + 1;
      const nextEntry = entries[nextIndex];

      if (nextEntry) {
        setSelection({
          entryId: nextEntry.id,
          columnId: selection.columnId,
          isOpen: false
        });
      }
    }
  }, [selection, setSelection, entries]);

  const handlePageDown = useCallback(() => {
    if (selection.entryId) {
      const entryIndex = entries.findIndex(
        entry => entry.id === selection.entryId
      );
      const nextIndex = entryIndex + 20;
      const nextEntry = entries[nextIndex] || entries[entries.length - 1];

      if (nextEntry) {
        setSelection({
          entryId: nextEntry.id,
          columnId: selection.columnId,
          isOpen: false
        });
      }
    }
  }, [selection, setSelection, entries]);

  const handlePageUp = useCallback(() => {
    if (selection.entryId) {
      const entryIndex = entries.findIndex(
        entry => entry.id === selection.entryId
      );
      const nextIndex = entryIndex - 20;
      const nextEntry = entries[nextIndex] || entries[0];

      if (nextEntry) {
        setSelection({
          entryId: nextEntry.id,
          columnId: selection.columnId,
          isOpen: false
        });
      }
    }
  }, [selection, setSelection, entries]);

  const handleHome = useCallback(() => {
    const nextEntry = entries[0];

    if (nextEntry) {
      setSelection({
        entryId: nextEntry.id,
        columnId: selection.columnId || "description",
        isOpen: false
      });
    }
  }, [selection, setSelection, entries]);

  const handleEnd = useCallback(() => {
    const nextEntry = entries[entries.length - 1];

    if (nextEntry) {
      setSelection({
        entryId: nextEntry.id,
        columnId: selection.columnId || "description",
        isOpen: false
      });
    }
  }, [selection, setSelection, entries]);

  const handleEnter = useCallback(() => {
    if (selection.entryId) {
      setSelection({ ...selection, isOpen: true });
    }
  }, [selection, setSelection]);

  const KEY_HANDLERS = {
    ArrowRight: handleRight,
    ArrowLeft: handleLeft,
    ArrowUp: handleUp,
    ArrowDown: handleDown,
    PageDown: handlePageDown,
    PageUp: handlePageUp,
    Home: handleHome,
    End: handleEnd,
    Enter: handleEnter
  };

  const handleKeyDown = event => {
    const handler = KEY_HANDLERS[event.key];
    if (handler) {
      handler();
    }
  };

  return (
    <PrepareRowsContext.Provider value={{ rows, prepareRow }}>
      <div
        {...getTableProps()}
        onKeyDown={handleKeyDown}
        tabIndex="0"
        className="text-sm w-1/2 outline-none"
        data-entries-table
      >
        <div className="border-b border-solid border-black">
          {headerGroups.map(headerGroup => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <div
                  {...column.getHeaderProps()}
                  className={classNames(
                    "inline-block font-bold p-2",
                    index === headerGroup.headers.length - 1
                      ? "border-r border-solid border-black"
                      : "",
                    COLUMN_STYLES[column.id]
                  )}
                >
                  {column.render("Header")}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()}>
          <FixedSizeList
            height={tableHeight}
            itemCount={rows.length}
            itemSize={38}
            ref={tableWindowRef}
          >
            {Row}
          </FixedSizeList>
        </div>
      </div>
    </PrepareRowsContext.Provider>
  );
}

export default memo(EntriesTable);
