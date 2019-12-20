import React, {
  useMemo,
  useRef,
  createContext,
  useContext,
  memo,
  useState,
  useEffect
} from "react";
import { useTable } from "react-table";
import { FixedSizeList } from "react-window";
import { times } from "ramda";
import useWindowSize from "./useWindowSize";
import classNames from "classnames";
import numbro from "numbro";
import DescriptionCell from "./DescriptionCell";
import DateCell from "./DateCell";
import AmountCentsCell from "./AmountCentsCell";
import CreateEntryButton from "./CreateEntryButton";
import DiscardEntryButton from "./DiscardEntryButton";
import ShowHistoryButton from "./ShowHistoryButton";

// NOTE: Bypass re-render of react-window's FixedSizedList component
// re-rendering FixedSizedList component ends up in focus lose.
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
          "flex items-center border-b border-r border-solid border-gray-600",
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

function useCellRefs(entries, columnsCount) {
  const cellRefs = useRef({});

  const attachCellRef = (element, row, column) => {
    const { id } = row.original;
    cellRefs.current[id] =
      cellRefs.current[id] || times(() => null, columnsCount);
    cellRefs.current[id][column.index] = element;
  };

  const focusNext = (row, column) => {
    const nextColumn = column.index === columnsCount - 1 ? 0 : column.index + 1;
    const currentRowIndex = entries.findIndex(
      entry => entry.id === row.original.id
    );
    const nextRowEntry =
      nextColumn === 0
        ? entries[currentRowIndex + 1]
        : entries[currentRowIndex];

    if (nextRowEntry) {
      const nextCell = cellRefs.current[nextRowEntry.id][nextColumn];
      if (nextCell) {
        nextCell.focus();
      }
    }
  };

  const wrapCell = Component => {
    return props => (
      <Component
        {...props}
        ref={element => attachCellRef(element, props.row, props.column)}
        focusNext={() => focusNext(props.row, props.column)}
      />
    );
  };

  return { wrapCell, cellRefs };
}

const COLUMNS_COUNT = 3;

function EntriesTable({ entries, tableWindowRef }) {
  const [newestEntryId, setNewestEntryId] = useState(null);
  const { wrapCell, cellRefs } = useCellRefs(entries, COLUMNS_COUNT);

  useEffect(() => {
    const newCellRefs = cellRefs.current[newestEntryId];
    if (newestEntryId && newCellRefs && newCellRefs.length > 0) {
      newCellRefs[0].focus();
    }
  }, [newestEntryId, cellRefs.current]);

  const columns = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: wrapCell(DescriptionCell)
      },
      {
        Header: () => (
          <>
            Date <span className="font-light">(mm/dd/yyyy)</span>
          </>
        ),
        accessor: "date",
        Cell: wrapCell(DateCell)
      },
      {
        Header: "Amount",
        accessor: "amountCents",
        Cell: wrapCell(AmountCentsCell)
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
              afterCreate={entry => setNewestEntryId(entry.id)}
            />
            <DiscardEntryButton {...props} />
            <ShowHistoryButton {...props} />
          </div>
        )
      }
    ],
    [entries]
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

  return (
    <PrepareRowsContext.Provider value={{ rows, prepareRow }}>
      <div {...getTableProps()} className="text-sm w-1/2">
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
