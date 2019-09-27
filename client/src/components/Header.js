// This is the Stateless functional component 
import React from 'react';
import { Link } from 'react-router-dom';

//withRouter gives the Header access to the 'this.props.location' attribute.
import { withRouter } from 'react-router';

class Header extends React.PureComponent {
    render() {
        const { context } = this.props;
        const authUser = context.authenticatedUser;

        const pathway = this.props.location.pathname;

        return (
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo">Courses</h1>
                    <nav>

                        {authUser ? (  // Ternary operator to render content representing the current state 
                            <React.Fragment>
                                <span>Welcome, {authUser.firstName + " " + authUser.lastName}!</span>
                                <Link to="/signout">Sign Out</Link>
                            </React.Fragment>
                        ) : (
                                <React.Fragment>
                                    <Link className="signup" to={{
                                        pathname: '/signup',
                                        state: { from: pathway }
                                    }} >Sign Up</Link>
                                    <Link className="signin" to={{
                                        pathname: '/signin',
                                        state: { from: pathway }
                                    }} >Sign In</Link>
                                </React.Fragment>
                            )}
                    </nav>
                </div>
            </div>
        );
    }
};

export default withRouter(Header);