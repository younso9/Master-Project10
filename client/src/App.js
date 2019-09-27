
import React, { Component } from 'react';
import './global.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';
import Forbidden from './components/Forbidden';
import PrivateRoute from './PrivateRoute';
import withContext from './components/Context';

//define components which contain the Context proivded by withContext()
const HeaderWithContext = withContext(Header);
const CourseDetailWithContext = withContext(CourseDetail);
const CreateCourseWithContext = withContext(CreateCourse);
const UpdateCourseWithContext = withContext(UpdateCourse);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <HeaderWithContext />
          <Switch>
            <Route exact path="/" component={Courses} />
            <Route exact path="/signin" component={UserSignInWithContext} />} />
          <Route exact path="/signup" component={UserSignUpWithContext} />
            <Route exact path="/signout" component={UserSignOutWithContext} />
            <Route exact path="/courses" component={Courses} />
            <Route exact path="/notfound" component={NotFound} />
            <Route exact path="/forbidden" component={Forbidden} />
            <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
            <PrivateRoute path="/courses/:id/update" component={UpdateCourseWithContext} />
            <Route path="/courses/:id" component={CourseDetailWithContext} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;