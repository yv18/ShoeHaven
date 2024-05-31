import React from 'react';
import { Link } from 'react-router-dom';

function EmpSearchByFilter({ getFilterData }) {
  return (
    <>
      <div className="FO">
        <div className="FO1">
          <div><h4>Department</h4></div>
          <div>
          <Link to={"/filter/?dept=IT"} className="filterLink" onClick={getFilterData}>IT</Link>
          <Link to={"/filter/?dept=Marketing"} className="filterLink" onClick={getFilterData}>Marketing</Link>
          <Link to={"/filter/?dept=HR"} className="filterLink" onClick={getFilterData}>HR</Link>
          <Link to={"/filter/?dept=Engineering"} className="filterLink" onClick={getFilterData}>Engineering</Link>
          </div>
        </div>
        
        <div className="FO1">
          <div><h4>Title</h4></div>
          <div>
          <Link to={"/filter/?title=Employee"} className="filterLink" onClick={getFilterData}>Employee</Link>
          <Link to={"/filter/?title=Manager"} className="filterLink" onClick={getFilterData}>Manager</Link>
          <Link to={"/filter/?title=Director"} className="filterLink" onClick={getFilterData}>Director</Link>
          <Link to={"/filter/?title=VP"} className="filterLink" onClick={getFilterData}>VP</Link></div>
        </div>

        
        <div className="FO1">
          <div><h4>Employee Type</h4></div>
          <div>
          <Link to={"/filter/?type=FullTime"} className="filterLink" onClick={getFilterData}>FullTime</Link>
          <Link to={"/filter/?type=PartTime"} className="filterLink" onClick={getFilterData}>PartTime</Link>
          <Link to={"/filter/?type=Contract"} className="filterLink" onClick={getFilterData}>Contract</Link>
          <Link to={"/filter/?type=Seasonal"} className="filterLink" onClick={getFilterData}>Seasonal</Link>
          </div>
        </div>
      </div>
    </>
  )
}

//  this function will  be passed as a prop to the EmployeeList component and called whenever there is a change in search
export default EmpSearchByFilter;
