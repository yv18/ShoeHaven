import React, { Component } from "react";
import NavigationBar from './Navbar.jsx';

class EmployeeUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removeRecordID: "", 
      updateEmp: {},
      updateMSG: "", // to diplay msg when data is updated
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search); // this will get the url from browser
    const id = params.get('id');
    this.setState({ removeRecordID: id });
    this.RetriveDatabyID(id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.removeRecordID !== this.state.removeRecordID) {
      this.RetriveDatabyID(this.state.removeRecordID);
    }
  }

  // this will use for retriving the user information
  RetriveDatabyID = (id) => {
    const query = `
      query {
        updateUserByID(_id:"${id}") {
          _id,
          FirstName,
          LastName,
          Age,
          DateOfJoining,
          Title,
          Department,
          EmployeeType,
        }
      }
    `;

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then(async (response) => {
        const data = await response.json();
        this.setState({ updateEmp: data.data.updateUserByID });
      })
      .catch(error => console.error('Error fetching data:', error));
  }




  // this will  handle the delete button click event in list view page
  handleSubmit = (e) => {
    e.preventDefault();
    const form = document.forms.udateform;
    const { removeRecordID } = this.state;
    const query = `
      mutation postUpdateData {
        postUpdateData(
          _id:"${removeRecordID}"
          Title: "${form.title.value}",
          Department: "${form.dept.value}",
          EmployeeType:"${form.emptype.value}"
        )
        {
          Title
        }
      }
    `;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then(async (response) => {
        const data = await response.json();
        form.reset();
        this.setState({ updateMSG: "Record has been updated!" }); // this will display msg 
      setTimeout(() => {
        this.setState({ updateMSG: "" });
      }, 3000);  // this will clear the msg after 3 seconds
      })
      .catch(error => console.error('Error in update section', error)); // this will catch error if got any
  };

  render() {
    const { updateEmp } = this.state;
    return (
      <>
      <NavigationBar/>
      <div>
        <div>
          <form name="udateform" onSubmit={this.handleSubmit}>
            <div>
            <p>First Name: {updateEmp.FirstName}</p>
            <p>Last Name: {updateEmp.LastName}</p>
            <p>Age: {updateEmp.Age}</p>
            <p>Date Of Joining: {updateEmp.DateOfJoining}</p>
              <label For="YI"> Department</label>
              {!!updateEmp.Department &&
                <select id="YI" name="dept" defaultValue={updateEmp.Department}>
                  <option value="IT">IT</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                </select>
              }
            </div>
            <div>
              <label For="YI">
                Title
              </label>
              {!!updateEmp.Title &&
                <select id="YI" name="title" defaultValue={updateEmp.Title}>
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Director">Director</option>
                  <option value="VP">VP</option>
                </select>
              }
            </div>
            <div>
              <label For="YI"> EmployeeType </label>
              {!!updateEmp.EmployeeType &&
                <select id="YI" name="emptype" defaultValue={updateEmp.EmployeeType}>
                  <option value="FullTime">FullTime</option>
                  <option value="PartTime">PartTime</option>
                  <option value="Contract">Contract</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              }
            </div>
            <span style={{color:"green"}}>{this.state.updateMSG}</span>
            <button type="submit">Update</button>
          </form>
          
        </div>
      </div>
      </>
    );
  }
}

export default EmployeeUpdate;
