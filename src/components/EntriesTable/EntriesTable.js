import React, {
  useMemo,
  useRef,
  createContext,
  useContext,
  useCallback
} from "react";
import { useTable } from "react-table";
import { FixedSizeList } from "react-window";
import useWindowSize from "./useWindowSize";
import { sortBy, memoizeWith, identity } from "ramda";
import classNames from "classnames";
import numbro from "numbro";
import calculateMonths from "./calculateMonths";
import DescriptionCell from "./DescriptionCell";
import DateCell from "./DateCell";
import AmountCentsCell from "./AmountCentsCell";
import CreateEntryButton from "./CreateEntryButton";
import DeleteEntryButton from "./DeleteEntryButton";
import styles from "./EntriesTable.module.css";

const sortEntries = sortBy(entry => new Date(entry.date));

const getLocalizedMonth = memoizeWith(identity, index => {
  const objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(index);

  const locale = "en-us",
    month = objDate.toLocaleString(locale, { month: "long" });

  return month;
});

function processEntries(entries) {
  const sortedEntries = sortEntries(entries);
  let total = 0;

  const data = sortedEntries.map(entry => {
    total = total + entry.amountCents;
    const mappedEntry = {
      id: entry.id,
      description: entry.description,
      date: entry.date,
      amountCents: entry.amountCents,
      totalCents: total
    };
    return mappedEntry;
  });

  const { years, months } = calculateMonths(sortedEntries);

  return {
    data,
    years,
    months
  };
}

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

function EntriesTable({ entries }) {
  const cellRefs = useRef(
    useMemo(() => entries.map(() => [null, null, null]), [entries.length])
  );

  function withRef(component) {
    return props => {
      const { row, column } = props;

      const attachRef = element => {
        cellRefs.current[row.index] = cellRefs.current[row.index] || [];
        cellRefs.current[row.index][column.index] = element;
      };

      const focusNext = useCallback(() => {
        const nextColumn = column.index + 1;
        const nextCell = cellRefs.current[row.index][nextColumn];
        if (nextCell) {
          nextCell.focus();
        }
      }, [cellRefs.current]);

      return (
        <div>
          {React.createElement(component, {
            ...props,
            focusNext,
            ref: attachRef
          })}
        </div>
      );
    };
  }

  const columns = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: withRef(DescriptionCell)
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: withRef(DateCell)
      },
      {
        Header: "Amount",
        accessor: "amountCents",
        Cell: withRef(AmountCentsCell)
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

  const { data, years, months } = useMemo(() => processEntries(entries), [
    entries
  ]);

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow
  } = useTable({
    columns,
    data
  });

  const windowSize = useWindowSize();
  const tableHeight = useMemo(() => {
    const headerHeight = 49;
    return windowSize.innerHeight - headerHeight;
  }, [windowSize]);

  const fixedListRef = useRef(null);

  const navigateToEntryId = entryId => {
    const dataIndex = data.findIndex(entry => entry.id === entryId);
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
