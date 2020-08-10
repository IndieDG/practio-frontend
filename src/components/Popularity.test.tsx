import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import { Popularity } from "./Popularity";
import { User } from "../App";
import * as utils from "../utils/response";

const SomeUser: User = {
  id: "some-user-id",
  name: "Some Name",
};

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

describe("Popularity", () => {
  beforeAll(() => jest.spyOn(window, "fetch"));

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should render the initial page", () => {
    const { getByText, getByPlaceholderText } = render(
      <Popularity user={SomeUser} setUserLoggedOut={jest.fn()} />
    );

    expect(getByText("Search Term Popularity Trends")).toBeTruthy();
    expect(getByPlaceholderText("Your term...")).toBeTruthy();
    expect(getByText("Logout")).toBeTruthy();
  });

  it("should not call the api and not display chart when input is empty", async () => {
    const { getByText, queryByText, queryByRole } = render(
      <Popularity user={SomeUser} setUserLoggedOut={jest.fn()} />
    );

    const searchBtn = getByText("Search");

    await act(async () => {
      await fireEvent.click(searchBtn);
    });

    expect(window.fetch).toHaveBeenCalledTimes(0);
    expect(await queryByText("Search Results")).toBeFalsy();
    expect(await queryByRole("term-result-chart")).toBeFalsy();
  });

  it("should call the api and plot the results when fetch is successful", async () => {
    const fetchMock = jest.spyOn(window, "fetch").mockResolvedValueOnce(({
      ok: true,
      json: async () => JSON.stringify(response),
    } as any) as Response);
    const utilsSpy = jest.spyOn(utils, "convertToBarChart");

    const { getByText, getByPlaceholderText, getByRole } = render(
      <Popularity user={SomeUser} setUserLoggedOut={jest.fn()} />
    );
    const searchBtn = getByText("Search");
    const termInput = getByPlaceholderText("Your term...");

    await act(async () => {
      await fireEvent.change(termInput, { target: { value: "Some Term" } });
      await fireEvent.click(searchBtn);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/some-user-id/popularity?keyword=Some Term"
    );
    expect(utilsSpy).toHaveBeenCalledTimes(1);
    expect(utilsSpy).toHaveBeenCalledWith(JSON.stringify(response));
    expect(getByText("Search Results")).toBeTruthy();
    expect(getByRole("term-result-chart")).toBeTruthy();
  });

  it("should call the api and plot the results when fetch is successful", async () => {
    jest
      .spyOn(window, "fetch")
      .mockReturnValue(Promise.reject("rejected fetch"));

    const { getByText, getByPlaceholderText, findByText } = render(
      <Popularity user={SomeUser} setUserLoggedOut={jest.fn()} />
    );
    const searchBtn = getByText("Search");
    const termInput = getByPlaceholderText("Your term...");

    await act(async () => {
      await fireEvent.change(termInput, { target: { value: "Some Term" } });
      await fireEvent.click(searchBtn);
    });

    expect(await findByText("Some thing went wrong")).toBeTruthy();
    expect(
      await findByText(
        "User request limit may have been reached. Please try again later on."
      )
    ).toBeTruthy();
  });
});
