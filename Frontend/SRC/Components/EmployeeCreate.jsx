import React, { Component } from "react";
import EmployeeTable from "./EmployeeTable.jsx";
import NavigationBar from './Navbar.jsx';
import { Button } from 'react-bootstrap';

class EmployeeCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FnameValidation: "",
      LnameValidation: "",
      AgeValidation: "",
      DateValidation: ""
    };
    this.dformhandle = this.dformhandle.bind(this);
  }

  // form handeler
  dformhandle(e) {
    e.preventDefault();
    const form = e.target;
    if (
      form.oneName.value === "" ||
      form.secondname.value === "" ||
      form.dateofjoin.value === "" ||
      form.age.value === ""
    ) {
      this.setState({
        FnameValidation: form.oneName.value === "" ? "Check Your First Name" : "",
        LnameValidation: form.secondname.value === "" ? "Check Your Last Name" : "",
        DateValidation: form.dateofjoin.value === "" ? "Please select date of join" : "",
        AgeValidation: form.age.value === "" ? "Enter Your Age" : ""
      });
      return;
    }
    // this will check the all fields 
  
    
    if (form.age.value < 20 || form.age.value > 70) {
      this.setState({
        AgeValidation: "Person with the same age exists. Enter age between 20 to 70"
      });
      return; 
    }
  
    // If all checks pass then reset error msg
    this.setState({
      FnameValidation: "",
      LnameValidation: "",
      AgeValidation: "",
      DateValidation: "",
      msgToDisplay: "Employee data has been stored!"
    });
  
    // this query is used for creating new employee Record into mongoodb
    let query = `
      mutation PushEmployee {
        PushEmployee(
          FirstName: "${form.oneName.value}",
          LastName: "${form.secondname.value}",
          Age: "${form.age.value}",
          DateOfJoining: "${form.dateofjoin.value}",
          Title: "${form.title.value}",
          Department: "${form.empdept.value}",
          EmployeeType:"${form.typeofEmp.value}"
        )
        {
          FirstName
        }
      }
    `;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }).then(async (response) => {
      let data = await response.json();
      form.reset();
    });
  }

  render() {
    const { FnameValidation, LnameValidation, AgeValidation, DateValidation,msgToDisplay } = this.state;

    return (
      <>
      <NavigationBar/>
      <div>
        <div>
          <form name="empform" onSubmit={this.dformhandle}>
            <div>
              <label>First Name</label>
              <input type="text" name="oneName" />
              {FnameValidation && <span style={{ color: "red" }}>{FnameValidation}</span>}
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" name="secondname" />
              {LnameValidation && <span style={{ color: "red" }}>{LnameValidation}</span>}
            </div>
            <div>
              <label>Age</label>
              <input type="number" name="age" />
              {AgeValidation && <span style={{ color: "red" }}>{AgeValidation}</span>}
            </div>
            <div>
              <label>Date Of Join</label>
              <input type="date" name="dateofjoin" />
              {DateValidation && <span style={{ color: "red" }}>{DateValidation}</span>}
            </div>
              <div>
                <label>Department</label>
                <select name="empdept">
                  <option>IT</option>
                  <option>Marketing</option>
                  <option>HR</option>
                  <option>Engineering</option>
                </select>
              </div>
              <div>
                <label>Title</label>
                <select name="title">
                  <option>Employee</option>
                  <option>Manager</option>
                  <option>Director</option>
                  <option>VP</option>
                </select>
              </div>
              <div>
                <label>EmployeeType</label>
                <select name="typeofEmp">
                  <option>FullTime</option>
                  <option>PartTime</option>
                  <option>Contract</option>
                  <option>Seasonal</option>
                </select>
              </div>
            {msgToDisplay && <div style={{ color: "green" }}>{msgToDisplay}</div>} {/*  To display the message */}
            <Button type="submit" variant="primary" >Add</Button>
          </form>
        </div>
      </div>
      </>
    );
  }
}

export default EmployeeCreate;
