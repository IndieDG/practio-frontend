import React, { useState } from "react";
import styled from "styled-components";
import { GoogleLogout } from "react-google-login";
import { User, CLIENT_ID } from "../App";
import { Chart } from "react-charts";
import { convertToBarChart } from "../utils/response";

const Container = styled.div`
  text-align: center;
`;

const BarChart = styled.div`
  width: 98%;
  height: 400px;
  margin: 20px;
`;

const LogOut = styled.div`
  margin: 25px;
`;

const series = {
  type: "bar",
};
const axes = [
  { primary: true, type: "ordinal", position: "bottom" },
  { position: "left", type: "linear", stacked: false },
];

const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw Error(`${response.status}`);
  }
  return response;
};

type PopularityProps = {
  user: User;
  setUserLoggedOut: () => void;
};

export const Popularity: React.FC<PopularityProps> = ({
  user,
  setUserLoggedOut,
}) => {
  const [term, setTerm] = useState("");
  const [popularityResult, setPopularityResult] = useState<unknown>(undefined);
  const [isFailedRequest, setIsFailedRequest] = useState(false);

  const loadPopularityTerms = async (userId: string, term: string) => {
    fetch(`http://localhost:8000/${userId}/popularity?keyword=${term}`)
      .then(handleErrors)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        const converted = [
          { label: `Popularity for ${term}`, data: convertToBarChart(result) },
        ];
        setPopularityResult(converted);
        setIsFailedRequest(false);
      })
      .catch((e) => {
        console.log(e);
        setIsFailedRequest(true);
      });
  };

  return (
    <>
      <Container>
        <h1>Search Term Popularity Trends</h1>
        <input
          type="text"
          placeholder="Your term..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
        <button
          onClick={() => {
            loadPopularityTerms(user.id, term);
          }}
          disabled={!term}
        >
          Search
        </button>
        {isFailedRequest && (
          <>
            <h2>Some thing went wrong</h2>
            <h5>
              User request limit may have been reached. Please try again later
              on.
            </h5>
          </>
        )}
        {!isFailedRequest && popularityResult && (
          <BarChart role="term-result-chart">
            <h2>Search Results</h2>
            <Chart
              data={popularityResult || {}}
              axes={axes}
              series={series}
              tooltip
            />
          </BarChart>
        )}
        <br />
        <LogOut>
          <GoogleLogout
            clientId={CLIENT_ID}
            onLogoutSuccess={setUserLoggedOut}
            buttonText="Logout"
          />
        </LogOut>
      </Container>
    </>
  );
};
