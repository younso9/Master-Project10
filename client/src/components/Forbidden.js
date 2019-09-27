import React from 'react';

//Forbidden component is reached when access to a route is not permitted
const Forbidden = () => {
  return (
    <div>
      <div className="actions--bar">
        <div className="bounds">
          <div className="grid-100">
            <a className="button button-secondary" href="/courses/">Return to List</a></div>
        </div>
      </div>
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            Sorry, You Do Not Have Access to This Page!
            </div>
        </div>
      </div>
    </div>
  )
}

export default Forbidden;