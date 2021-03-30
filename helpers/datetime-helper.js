const dateFormat = (dateInput) => {
  if (dateInput === null) {
    return "";
  } else {
    var d = new Date(dateInput);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      d.getDate() +
      "-" +
      months[d.getMonth()] +
      "-" +
      d.getFullYear() +
      " " +
      d.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
  }
};

module.exports = {
  dateFormat,
};
