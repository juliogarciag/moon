import React, {
  useMemo,
  useRef,
  createContext,
  useContext,
  useCallback,
  createElement
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

  return (
    prepareRow(row) || (
      <div
        {...row.getRowProps({ style })}
        className="flex items-center border-b border-r border-solid border-gray-600"
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

function useTableRefs(rowsCount, columnsCount) {
  const cellRefs = useRef(
    useMemo(() => times(() => times(() => null, columnsCount), rowsCount))
  );

  function withCellRef(component) {
    return props => {
      const { row, column } = props;

      const attachCellRef = element => {
        cellRefs.current[row.index] = cellRefs.current[row.index] || [];
        cellRefs.current[row.index][column.index] = element;
      };

      const focusNext = useCallback(() => {
        const nextColumn =
          column.index < columnsCount - 1 ? column.index + 1 : 0;
        const nextRow = nextColumn === 0 ? row.index + 1 : row.index;
        const nextCell = cellRefs.current[nextRow][nextColumn];

        if (nextCell) {
          nextCell.focus();
        }
      }, [cellRefs.current]);

      return (
        <div>
          {createElement(component, {
            ...props,
            focusNext,
            ref: attachCellRef
          })}
        </div>
      );
    };
  }

  return withCellRef;
}

function EntriesTable({ entries, tableWindowRef }) {
  const columnsCount = 3;
  const withCellRef = useTableRefs(entries.length, columnsCount);

  const columns = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: withCellRef(DescriptionCell)
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: withCellRef(DateCell)
      },
      {
        Header: "Amount",
        accessor: "amountCents",
        Cell: withCellRef(AmountCentsCell)
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
            <CreateEntryButton {...props} />
            <DiscardEntryButton {...props} />
          </div>
        )
      }
    ],
    []
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
    const headerHeight = 49;
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

export default EntriesTable;
