import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Data from "../Data";
import ReactMarkdown from "react-markdown";

class CourseDetail extends Component {
  constructor() {
    super(); // This will execute the default constructor

    this.state = {  // courses empty array,
      course: null, 
      isLoading: true, // isLoading boolean true, 
      courseWasFound: false, // courseWasFound false, found ID null
      id: null
    };

    this.deleteCourse = this.deleteCourse.bind(this);
  }

  fetchCourseById = courseId => {
    this.setState({
      course: null,
      isLoading: true,
      courseWasFound: false,
      id: null
    });

    const data = new Data();

    data
      .getCourseById(courseId)
      .then(responseData => {
        if (responseData.id) {
          this.setState({
            course: responseData,
            isLoading: false,
            courseWasFound: true,
            id: responseData.id
          });
        } else {
          this.setState({
            course: responseData,
            isLoading: false,
            courseWasFound: false,
            id: -1
          });
        }
      })
      .catch(error => {
        console.log("Error fetching and parsing data", error);
      });
  };

  // This will make the JSX for a course JSON
  convertJsonToCourseContent = course => {
    return (
      <div className="bounds course--detail">
        <div className="grid-66">
          <div className="course--header">
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
            <p>
              By {course.user.firstName} {course.user.lastName}
            </p>
          </div>
          <div className="course--description">
            <ReactMarkdown>{course.description}</ReactMarkdown>
          </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                <h4>Estimated Time</h4>

                <h3>{course.estimatedTime}</h3>
              </li>
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                <ul>
                  <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // This will get the course for the ID once it loads it
  componentDidMount() {
    this.fetchCourseById(this.props.match.params.id);
  }

  render() {
    let courseFound = null;

    const { context } = this.props;
    const authUser = context.authenticatedUser;

    if (this.state.course) {
      if (this.state.courseWasFound) {
        courseFound = this.convertJsonToCourseContent(this.state.course);
      } else {
        return <Redirect to="/notfound" />;
      }
    } else {
      courseFound = <li>Loading...</li>;
    }

    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              {this.state.courseWasFound &&
              authUser &&
              authUser.id === this.state.course.user.id ? (
                <React.Fragment>
                  <span>
                    <a
                      className="button"
                      href={
                        "/courses/" + this.props.match.params.id + "/update"
                      }
                    >
                      Update Course
                    </a>
                    <button className="button" onClick={this.deleteCourse}>
                     
                      Delete Course
                    </button>
                  </span>
                </React.Fragment>
              ) : (
                <React.Fragment></React.Fragment>
              )}
              <a className="button button-secondary" href="/courses/">
               
                Return to List
              </a>
            </div>
          </div>
        </div>
        {courseFound}
      </div>
    );
  }

  // This delete coure is combined with the application
  deleteCourse = () => {
    const { context } = this.props;

    const id = this.state.id;

    context.data
      .deleteCourse(id, context.authenticatedUser, context.authenticatedUserPwd)
      .then(courseDeleteResult => {
        if (!courseDeleteResult.length) {
          this.props.history.push("/");
        } else {
          this.props.history.push("/error");
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push("/error");
      });
  };
}
export default CourseDetail;
