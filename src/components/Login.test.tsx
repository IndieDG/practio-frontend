import React from "react";
import { render } from "@testing-library/react";
import { Login } from "./Login";

describe("Login", () => {
  it("should render the title", () => {
    const { getByText } = render(
      <Login setUser={jest.fn()} setUserLoggedIn={jest.fn()} />
    );

    expect(getByText("Popularity Trends")).toBeTruthy();
  });
});
