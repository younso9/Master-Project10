import React from 'react';

export default (props) => {
    const {
        cancel,
        errors,
        submit,
        submitButtonText,
        userName,
        titleElement,
        descriptionElement,
        estimatedTimeElement,
        materialsNeededElement
    } = props;

    function handleSubmit(event) {
        event.preventDefault();
        submit();
    }

    function handleCancel(event) {
        event.preventDefault();
        cancel();
    }

    return (
        <div>
            <ErrorsDisplay errors={errors} />
            <form onSubmit={handleSubmit}>
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <div>{titleElement()}</div>
                        <p>By {userName}</p>
                    </div>
                    <div className="course--description">
                        <div>{descriptionElement()}</div>
                    </div>
                </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                <div>{estimatedTimeElement()}</div>
                            </li>
                            <li className="course--stats--list--item">
                                <h4>Materials Needed</h4>
                                <div>{materialsNeededElement()}</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="grid-100 pad-bottom">
                    <button className="button" type="submit">{submitButtonText}</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

// If validation errors exist, this method will show
function ErrorsDisplay({ errors }) {
    let errorsDisplay = null;

    if (errors.length) {
        errorsDisplay = (
            <div>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div className="validation-errors">
                    <ul>
                        {errors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            </div>
        );
    }

    return errorsDisplay;
}