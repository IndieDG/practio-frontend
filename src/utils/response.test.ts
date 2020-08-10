import { convertToBarChart } from "./response";

describe("convert to bar chart", () => {
  it("converts valid response to be ploted as bar chart", () => {
    const response = {
      default: {
        timelineData: [
          {
            time: "1072915200",
            formattedTime: "Jan 2004",
            formattedAxisTime: "Jan 1, 2004",
            value: [26],
            hasData: [true],
            formattedValue: ["26"],
          },
          {
            time: "1075593600",
            formattedTime: "Feb 2004",
            formattedAxisTime: "Feb 1, 2004",
            value: [26],
            hasData: [true],
            formattedValue: ["26"],
          },
          {
            time: "1078099200",
            formattedTime: "Mar 2004",
            formattedAxisTime: "Mar 1, 2004",
            value: [25],
            hasData: [true],
            formattedValue: ["25"],
          },
        ],
      },
    };

    expect(convertToBarChart(JSON.stringify(response))).toStrictEqual([
      ["Jan 2004", 26],
      ["Feb 2004", 26],
      ["Mar 2004", 25],
    ]);
  });

  it("returns empty array when invalid response", () => {
    const invalidResponse = {};
    expect(convertToBarChart(JSON.stringify(invalidResponse))).toStrictEqual(
      []
    );
  });
});
