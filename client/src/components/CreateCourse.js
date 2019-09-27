import React, { Component } from 'react';
import CourseForm from './CourseForm';

export default class CreateCourse extends Component {
    constructor() {
        super();

        this.state = {
            title: '',
            description: '',
            materialsNeeded: '',
            estimatedTime: '',
            errors: []
        };
    }

    render() {
        const { context } = this.props;
        const authUser = context.authenticatedUser;
        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                {/** use CourseForm component, adding in the elements linked to the state variables
                react to changes in the input elements calling this.change to update stored
                state value as the user types (similar to Project 7)
           **/}
                <CourseForm
                    cancel={this.cancel}
                    errors={this.state.errors}
                    submit={this.submit}
                    submitButtonText="Create Course"
                    userName={authUser.firstName + " " + authUser.lastName}
                    titleElement={() => (
                        <React.Fragment>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={this.state.title}
                                onChange={this.change}
                                className="input-title course--title--input"
                                placeholder="Course title..." />
                        </React.Fragment>
                    )}
                    descriptionElement={() => (
                        <React.Fragment>
                            <textarea
                                id="description"
                                name="description"
                                type="description"
                                value={this.state.description}
                                onChange={this.change}
                                placeholder="Course description..." />
                        </React.Fragment>
                    )}
                    estimatedTimeElement={() => (
                        <React.Fragment>
                            <input
                                id="estimatedTime"
                                name="estimatedTime"
                                type="text"
                                value={this.state.estimatedTime}
                                onChange={this.change}
                                className="course--time--input"
                                placeholder="Hours" />
                        </React.Fragment>
                    )}
                    materialsNeededElement={() => (
                        <React.Fragment>
                            <textarea
                                id="materialsNeeded"
                                name="materialsNeeded"
                                type="materialsNeeded"
                                value={this.state.materialsNeeded}
                                onChange={this.change}
                                placeholder="List materials..." />
                        </React.Fragment>
                    )} />
            </div>
        );
    }

    change = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        this.setState(() => {
            return {
                [name]: value
            };
        });
    }

    //  SUBMIT method  for  title, description, estimatedTime and materialsNeeded.
    submit = () => {
        const { context } = this.props;

        const title = this.state.title;
        const description = this.state.description;
        const estimatedTime = this.state.estimatedTime;
        const materialsNeeded = this.state.materialsNeeded;

    // Create course
        const course = {
            title,
            description,   
            estimatedTime,
            materialsNeeded,
        };

        context.data.createCourse(course, context.authenticatedUser, context.authenticatedUserPwd)
            .then(courseCreateResult => {
                if (title === '' || description === '') {
                    this.setState({
                        errors: ["Please provide required information"]
                    });
                    return;
              
                } else {
                    this.props.history.push('/');
                }
            })
            .catch((err) => {
                console.log(err);
                this.props.history.push('/error');
            });
    }

    cancel = () => {
        this.props.history.push('/');
    }
}