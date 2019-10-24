import React, { useMemo } from "react";
import { useTable, usePagination } from "react-table";
import DescriptionCell from "./DescriptionCell";
import DateCell from "./DateCell";
import AmountCentsCell from "./AmountCentsCell";
import CreateEntryButton from "./CreateEntryButton";
import DeleteEntryButton from "./DeleteEntryButton";
import { sortBy } from "ramda";

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
  const columns = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: DescriptionCell
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: DateCell
      },
      {
        Header: "Amount",
        accessor: "amountCents",
        Cell: AmountCentsCell
      },
      {
        Header: "Total",
        accessor: "totalCents",
        Cell: ({ cell: { value } }) => (value / 100).toFixed(2)
      },
      {
        Header: "Actions",
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
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            row =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
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
