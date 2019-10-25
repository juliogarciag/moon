import React, { useMemo, useRef } from "react";
import { useTable, usePagination } from "react-table";
import { sortBy } from "ramda";
import classNames from "classnames";
import numbro from "numbro";
import DescriptionCell from "./DescriptionCell";
import DateCell from "./DateCell";
import AmountCentsCell from "./AmountCentsCell";
import CreateEntryButton from "./CreateEntryButton";
import DeleteEntryButton from "./DeleteEntryButton";
import styles from "./EntriesTable.module.css";

const sortEntries = sortBy(entry => new Date(entry.date));

function processEntries(entries) {
  const sortedEntries = sortEntries(entries);
  let total = 0;

  const processedEntries = sortedEntries.map(entry => {
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
  return processedEntries;
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

      const focusNext = () => {
        const nextColumn = column.index + 1;
        const nextCell = cellRefs.current[row.index][nextColumn];
        if (nextCell) {
          nextCell.focus();
        }
      };

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

  const data = useMemo(() => processEntries(entries), [entries]);

  const pageSize = 25;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage
  } = useTable(
    {
      columns,
      data,
      disablePageResetOnDataChange: true,
      initialState: {
        pageIndex: data.length / pageSize - 1,
        pageSize: pageSize
      }
    },
    usePagination
  );

  return (
    <>
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
          {page.map(row => {
            return (
              prepareRow(row) || (
                <div {...row.getRowProps()} className={styles.dataRow}>
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
          })}
        </div>
      </div>
      <div>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous Page
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next Page
        </button>
        <div>
          Page {pageIndex + 1} of {pageOptions.length}
        </div>
      </div>
    </>
  );
}

export default EntriesTable;
