import React from "react";
import { useTable } from "react-table";
import DescriptionCell from "./DescriptionCell";
import DateCell from "./DateCell";
import AmountCentsCell from "./AmountCentsCell";
import CreateEntryButton from "./CreateEntryButton";
import DeleteEntryButton from "./DeleteEntryButton";

function EntriesTable({ entries }) {
  const columns = [
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
      Header: "Actions",
      Cell: props => (
        <>
          <CreateEntryButton {...props} />
          <DeleteEntryButton {...props} />
        </>
      )
    }
  ];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data: entries
  });

  return (
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
        {rows.map(
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
  );
}

export default EntriesTable;
