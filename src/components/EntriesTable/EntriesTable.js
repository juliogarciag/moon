import React, {
  useMemo,
  useRef,
  createContext,
  useContext,
  useCallback
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
import styles from "./EntriesTable.module.css";

// NOTE: Bypass re-render of react-window's FixedSizedList component
// re-rendering FixedSizedList component ends up in focus lose.
const PrepareRowsContext = createContext();

function Row({ index, style }) {
  const { rows, prepareRow } = useContext(PrepareRowsContext);
  const row = rows[index];

  return (
    prepareRow(row) || (
      <div {...row.getRowProps({ style })} className={styles.dataRow}>
        {row.cells.map(cell => {
          return (
            <div
              {...cell.getCellProps()}
              className={classNames(
                styles.dataCell,
                styles[`dataCell--${cell.column.id}`]
              )}
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
          {React.createElement(component, {
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
      <div className={styles.wrapper}>
        <div {...getTableProps()} className={styles.table}>
          <div className={styles.header}>
            {headerGroups.map(headerGroup => (
              <div
                {...headerGroup.getHeaderGroupProps()}
                className={styles.headerRow}
              >
                {headerGroup.headers.map(column => (
                  <div
                    {...column.getHeaderProps()}
                    className={classNames(
                      styles.headerCell,
                      styles[`headerCell--${column.id}`]
                    )}
                  >
                    {column.render("Header")}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()} className={styles.data}>
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
        <ul className={styles.dateLinks}>
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
