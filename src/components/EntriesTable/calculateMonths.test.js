import calculateMonths from "./calculateMonths";

const entries = [
  { id: "612", date: "2017-04-17" },
  { id: "613", date: "2017-04-25" },
  { id: "614", date: "2017-05-04" },
  { id: "615", date: "2017-05-04" },
  { id: "616", date: "2017-06-21" },
  { id: "617", date: "2017-06-25" },
  { id: "618", date: "2017-07-17" },
  { id: "619", date: "2017-09-29" },
  { id: "620", date: "2018-03-17" },
  { id: "621", date: "2019-08-17" },
  { id: "622", date: "2019-10-23" }
];

describe("calculateMonths", () => {
  it("calculate months in different years, months and days", () => {
    const { years, months } = calculateMonths(entries);

    expect(years).toEqual(["2017", "2018", "2019"]);
    expect(months["2017"].length).toEqual(5);
    expect(months["2018"].length).toEqual(1);
    expect(months["2019"].length).toEqual(2);
    expect(months["2017"][0].month).toEqual(3);
    expect(months["2017"][0].firstEntryId).toEqual("612");
  });
});
