import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomeTable = () => {
  const [data, setData] = useState([]);
  const T1 = { border: "1px solid darkblue" };

  useEffect(() => {
    const DataFetching = async () => {
      try {
        const response = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "{ retriveUserInformation { _id FirstName LastName Age DateOfJoining Title Department EmployeeType CurrentStatus }}" }),
        });
        const { data } = await response.json();
        setData(data.retriveUserInformation || []);
      } catch (error) {
        console.error("Error", error);
      }
    };

    DataFetching();
  }, []);
  //this is the query for graphQL server to get all user information

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={T1}>FirstName</th>
            <th style={T1}>LastName</th>
            <th style={T1}>Age</th>
            <th style={T1}>DateOfJoining</th>
            <th style={T1}>Title</th>
            <th style={T1}>Department</th>
            <th style={T1}>EmployeeType</th>
            <th style={T1}>CurrentStatus</th>
          </tr>
        </thead>
        <tbody>
          {data.map((Y) => {
            return (
              <tr key={Y._id}>
                <td style={T1}>{Y.FirstName}</td>
                <td style={T1}>{Y.LastName}</td>
                <td style={T1}>{Y.Age}</td>
                <td style={T1}>{Y.DateOfJoining}</td>
                <td style={T1}>{Y.Title}</td>
                <td style={T1}>{Y.Department}</td>
                <td style={T1}>{Y.EmployeeType}</td>
                <td style={T1}>{Y.CurrentStatus ? "1" : "0"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// So this function I have created for just To display the record into the table on the home page 

export default HomeTable;
