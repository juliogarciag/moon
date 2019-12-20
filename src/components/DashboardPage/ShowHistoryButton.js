import React, { useState } from "react";
import { Clock } from "react-feather";
import { useQuery } from "@apollo/react-hooks";
import numbro from "numbro";
import Modal from "components/Modal";
import { formatDate, formatTime } from "lib/formatDateAndTime";
import getEntryHistoryQuery from "./getEntryHistory.graphql";

function EntryHistory({ entry }) {
  const { loading, data } = useQuery(getEntryHistoryQuery, {
    variables: { entryId: entry.id },
    fetchPolicy: "no-cache"
  });

  if (loading) {
    return <span>Loading...</span>;
  }

  return (
    <table className="table-fixed">
      <thead className="border-b border-black">
        <tr>
          <th className="px-4 py-2 text-left text-sm">Version time</th>
          <th className="px-4 py-2 text-left text-sm">Description</th>
          <th className="px-4 py-2 text-left text-sm">Date</th>
          <th className="px-4 py-2 text-right text-sm">Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.entryVersions.map(item => (
          <tr key={item.id} className="border-b border-gray-600">
            <td className="px-4 py-2 text-sm">{formatTime(item.createdAt)}</td>
            <td className="px-4 py-2 text-sm">{item.description}</td>
            <td className="px-4 py-2 text-sm">{formatDate(item.date)}</td>
            <td className="px-4 py-2 text-right font-mono text-sm">
              {numbro(item.amountCents / 100).formatCurrency({
                average: false,
                thousandSeparated: true,
                mantissa: 2
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ShowHistoryButton({ row: { original: entry } }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        onClick={() => setShowModal(show => !show)}
        className="mr-2"
        title={`${showModal ? "Hide" : "Show"} History`}
      >
        <Clock
          size={18}
          strokeWidth={entry.isLastOfMonth || entry.isLastOfYear ? 2.5 : 2}
        />
      </button>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <EntryHistory entry={entry} />
      </Modal>
    </>
  );
}

export default ShowHistoryButton;
