import React, {
  useMemo,
  createContext,
  useContext,
  memo,
  useState,
  useEffect
} from "react";
import { useTable } from "react-table";
import { FixedSizeList } from "react-window";
import useWindowSize from "./useWindowSize";
import classNames from "classnames";
import numbro from "numbro";
import DescriptionCell from "components/DescriptionCell";
import DateCell from "components/DateCell";
import AmountCentsCell from "components/AmountCentsCell";
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

function wrapEditableCell(Component, selection, setSelection) {
  return props => {
    const entryId = props.row.original.id;
    const columnId = props.column.id;
    const isSelected =
      entryId === selection.entryId && columnId === selection.columnId;

    const handleClick = () => {
      if (!isSelected) {
        setSelection({ entryId, columnId });
      }
    };

    const isEntrySpecial = entry => entry.isLastOfMonth || entry.isLastOfYear;

    return (
      <div
        onClick={handleClick}
        className="flex w-full h-full relative"
        style={{ height: "38px" }}
      >
        {isSelected ? (
          <div className="w-full h-full absolute border-solid border-2 border-blue-600"></div>
        ) : (
          <div
            className={classNames("w-full h-full absolute", {
              "border-r border-solid border-gray-300": !isEntrySpecial(
                props.row.original
              )
            })}
          ></div>
        )}
        <Component {...props} />
      </div>
    );
  };
}

function EntriesTable({ entries, tableWindowRef }) {
  const [hasFirstSelectionHappened, setHasFirstSelectionHappened] = useState(
    false
  );
  const [selection, setSelection] = useState({ entryId: null, columnId: null });

  useEffect(() => {
    if (
      entries.length > 0 &&
      !hasFirstSelectionHappened &&
      selection.entryId === null
    ) {
      setSelection({ entryId: entries[0].id, columnId: "description" });
      setHasFirstSelectionHappened(true);
    }
  }, [entries]);

  const columns = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: wrapEditableCell(DescriptionCell, selection, setSelection)
      },
      {
        Header: () => (
          <>
            Date <span className="font-light">(mm/dd/yyyy)</span>
          </>
        ),
        accessor: "date",
        Cell: wrapEditableCell(DateCell, selection, setSelection)
      },
      {
        Header: "Amount",
        accessor: "amountCents",
        Cell: wrapEditableCell(AmountCentsCell, selection, setSelection)
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
