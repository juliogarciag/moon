import { format } from "date-fns";

function dateTextToUTCDate(dateText) {
  const date = new Date(dateText);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

function formatDate(dateText) {
  return format(dateTextToUTCDate(dateText), "MM/dd/yyyy");
}

function formatTime(dateText) {
  return format(dateTextToUTCDate(dateText), "MM/dd/yyyy hh:mm:ss");
}

export { formatDate, formatTime };
