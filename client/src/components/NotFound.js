import React from 'react'; ////NotFound component - route accessed does not exist (404)

const NotFound = () => {
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
                        Sorry, Page Not Found!
            </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound;