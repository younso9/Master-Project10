import React, { Component } from 'react';
import Data from '../Data';

//This defines the components and creates constructor defining its default state
class Courses extends Component {
  constructor() { // Default constructor
    super();
    this.state = { //default state: courses empty array, isLoading boolean true
      courses: [],
      isLoading: true
    };
  }

  fetchCourses = () => {  // This empties the state variables when loading the page - render will show the default state 
    this.setState({ courses: [], isLoading: true });

    const data = new Data();

    data.getCourses()
      .then(responseData => {
        this.setState({ courses: responseData, isLoading: false });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }
  // This constructs a link div for the course and is passed into map method of the array
  mapJsonToCourseLink = (course, i) => {
    return <div className="grid-33" key={i}><a className="course--module course--link" href={"/courses/" + course.id}>
      <h4 className="course--label">Course</h4>
      <h3 className="course--title">{course.title}</h3>
    </a></div>;
  }

  // Once the componentDidMount is called render will continously check if state.isLoading is true or false
  componentDidMount() {
    this.fetchCourses();
  }

  render() {
    let courseList = [];

    if (this.state.courses.length > 0) { //This will display if the courses array has content 
      courseList = this.state.courses.map(this.mapJsonToCourseLink);
    }

    else if (!this.state.isLoading) {  // This will show Nothing Found message if there are no courseList in the array, 
      courseList = <li>No results found...</li>;
    }

    else {  // This will display the generic Loading panel
      courseList = <li>Loading...</li>;
    }

    return <div>
      <div className="bounds">
        {courseList}
        <div className="grid-33"><a className="course--module course--add--module" href="/courses/create">
          <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 13 13" className="add">
            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
          </svg>New Course</h3>
        </a></div>
      </div>
    </div>;

  }

}

export default Courses;