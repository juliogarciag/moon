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
import { times, sortBy, prop } from "ramda";
import useWindowSize from "./useWindowSize";
import classNames from "classnames";
import numbro from "numbro";
import DescriptionCell from "./DescriptionCell";
import DateCell from "./DateCell";
import AmountCentsCell from "./AmountCentsCell";
import CreateEntryButton from "./CreateEntryButton";
import DeleteEntryButton from "./DeleteEntryButton";
import getLocalizedMonth from "./getLocalizedMonth";
import { Link } from "react-feather";

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

function EntriesTable({ entries, years, months, todayTotal }) {
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
            <DeleteEntryButton {...props} />
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

  const fixedListRef = useRef(null);

  const goToEntryId = entryId => {
    const dataIndex = entries.findIndex(entry => entry.id === entryId);
    fixedListRef.current.scrollToItem(dataIndex);
  };

  const goToMostRecentEntry = () => {
    const mostRecentEntry = sortBy(prop("todayCloseness"), entries)[0];
    if (mostRecentEntry) {
      goToEntryId(mostRecentEntry.id);
    }
  };

  return (
    <PrepareRowsContext.Provider value={{ rows, prepareRow }}>
      <div className="flex">
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
              ref={fixedListRef}
            >
              {Row}
            </FixedSizeList>
          </div>
        </div>

        <div className="py-2 h-screen overflow-auto text-sm">
          <div className="pb-2 px-4 border-b border-black border-solid mb-2">
            <span className="font-bold">Total: </span>
            <span className="font-mono leading-none">
              {numbro(todayTotal / 100).formatCurrency({
                average: false,
                thousandSeparated: true,
                mantissa: 2,
                currencySymbol: "$ "
              })}
            </span>
          </div>
          <div className="px-4 pb-2 border-b border-black">
            <button onClick={goToMostRecentEntry} className="hover:underline">
              <Link size={12} className="inline mr-2" />
              Most Recent
            </button>
          </div>
          <ul>
            {years.map(year => (
              <li key={year}>
                <div className="px-4 pt-2 font-bold">{year}</div>
                <ul className="pl-4 py-2 border-b border-black">
                  {months[year].map(({ month, firstEntryId }) => {
                    return (
                      <li key={month}>
                        <button
                          className="hover:underline"
                          onClick={() => goToEntryId(firstEntryId)}
                        >
                          <Link size={12} className="inline mr-2" />
                          {getLocalizedMonth(month)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PrepareRowsContext.Provider>
  );
}

export default EntriesTable;
