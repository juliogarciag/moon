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
import DeleteEntryButton from "./DeleteEntryButton";
import getLocalizedMonth from "./getLocalizedMonth";

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
        className="flex items-center border-b border-solid border-gray-600 overflow-hidden"
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

function EntriesTable({ entries, years, months }) {
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
        Cell: ({ cell: { value } }) =>
          numbro(value / 100).formatCurrency({
            average: false,
            thousandSeparated: true,
            mantissa: 2
          })
      },
      {
        Header: "Actions",
        id: "actions",
        Cell: props => (
          <>
            <CreateEntryButton {...props} />
            <DeleteEntryButton {...props} />
          </>
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

  const navigateToEntryId = entryId => {
    const dataIndex = entries.findIndex(entry => entry.id === entryId);
    fixedListRef.current.scrollToItem(dataIndex);
  };

  return (
    <PrepareRowsContext.Provider value={{ rows, prepareRow }}>
      <div className="flex">
        <div {...getTableProps()} className="text-sm font-mono w-1/2">
          <div className="border-b border-solid border-black">
            {headerGroups.map(headerGroup => (
              <div {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <div
                    {...column.getHeaderProps()}
                    className={classNames(
                      "inline-block font-bold p-2",
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
              itemSize={35}
              ref={fixedListRef}
            >
              {Row}
            </FixedSizeList>
          </div>
        </div>
        <ul>
          <li>
            <button
              onClick={() => {
                if (entries.length > 0) {
                  navigateToEntryId(entries[entries.length - 1].id);
                }
              }}
            >
              Most Recent
            </button>
          </li>
          {years.map(year => (
            <li key={year}>
              <div>{year}</div>
              <ul>
                {months[year].map(({ month, firstEntryId }) => {
                  return (
                    <li key={month}>
                      <button onClick={() => navigateToEntryId(firstEntryId)}>
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
    </PrepareRowsContext.Provider>
  );
}

export default EntriesTable;
