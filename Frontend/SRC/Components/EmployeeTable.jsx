import React, { Component } from "react";
import { Link } from "react-router-dom";

class EmployeeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      __deletionMessage: "" // this will  be used to display a message when an employee is deleted
    };
    
  }

  // this  function will delete the selected employee and then update the table list
  RemovePersonData = (id) => {
    let query = `
      mutation RemovePersonData {
        RemovePersonData(
          _id: "${id}"
        )
          {
          _id
          }
        }
    `;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(async (response) => {
      let data = await response.json();
      this.props.RetriveEmpData();
      this.setState({ __deletionMessage: "Record has been deleted!" });
      setTimeout(() => {
        this.setState({ __deletionMessage: "" });
      }, 3000);
    });
  };

  render() {
    const { data, EmpType, EmpTitle, EmpDept } = this.props;

    let ChangeInfo = data.filter((Y) => {
      return Y.EmployeeType === EmpType || Y.Title === EmpTitle || Y.Department === EmpDept;
    });
    // this will check what user want filter and diplay data acoording to it.
    
    let CollectionArray = !!ChangeInfo.length > 0 ? ChangeInfo : data;

    return (
      <>
      <span className="dtMsg" style={{color:"red"}}>{this.state.__deletionMessage}</span>  {/* To diplay the delete msg*/}
      <div>
        <table>
          <thead>
            <tr>
              <th>FirstName</th>
              <th>LastName</th>
              <th>Age</th>
              <th>DateOfJoining</th>
              <th>Title</th>
              <th>Department</th>
              <th>EmployeeType</th>
              <th>CurrentStatus</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {CollectionArray &&
              CollectionArray.map((Y) => {
                return (
                  <tr key={Y._id}>
                    <td>{Y.FirstName}</td>
                    <td>{Y.LastName}</td>
                    <td>{Y.Age}</td>
                    <td>{Y.DateOfJoining}</td>
                    <td>{Y.Title}</td>
                    <td>{Y.Department}</td>
                    <td>{Y.EmployeeType}</td>
                    <td>{Y.CurrentStatus ? "1" : "0"}</td>
                    <td>
                      <Link to={`/update?id=${Y._id}`} className="updateLinkbtn" params={{ EmpID: Y }}>Update</Link>  {/* this will let user on differnt page and get the data of partiular emp information */}
                      <button className="deleteLinkbtn" onClick={() => this.RemovePersonData(Y._id)}>Remove</button>   {/* this will delete selected userData */}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      </>
    );
  }
}

export default EmployeeTable;
