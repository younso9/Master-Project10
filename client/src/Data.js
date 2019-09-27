import config from './config';

// interacts with the api application



export default class Data {

    api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
        const url = config.apiBaseUrl + path;

        const options = {
            method,
            headers: {
                //body content is always JSON
                'Content-Type': 'application/json; charset=utf-8',
            },
        };

        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        if (requiresAuth) {
            //Basic Auth is a constructed string using btoa (returns Base64 string)
            //https://en.wikipedia.org/wiki/Base64
            const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
            options.headers['Authorization'] = `Basic ${encodedCredentials}`;
        }
        return fetch(url, options);
    }



    //GET /users, pass in auth using 
    //credentials username and password
    async getUser(username, password) {
        const response = await this.api(`/users`, 'GET', null, true, { username, password });
        if (response.status === 200) {
            return response.json().then(data => data);
        }

        else if (response.status === 401) {
            return null;
        }
        //reached if 500 or any other status code
        else {
            throw new Error();
        }
    }



    //POST /users, create the user in the passed JSON
    async createUser(user) {
        const response = await this.api('/users', 'POST', user);
        if (response.status === 201) {
            return [];
        }
        //POST /users error code is a 400
        else if (response.status === 400) {
            return response.json().then(data => {
                return data.message;
            });
        }
        //reached if 500 or any other status code
        else {
            throw new Error();
        }
    }



    //GET /courses, no parameters required
    async getCourses() {
        const response = await this.api('/courses/', 'GET');
        if (response.status === 200) {
            return response.json().then(data => data);
        }
        //GET /courses error code is 404
        else if (response.status === 404) {
            return null;
        }
        //reached if 500 or any other status code
        else {
            throw new Error();
        }
    }



    //GET /courses/:id, from this ID
    async getCourseById(id) {
        const response = await this.api('/courses/' + id, 'GET');
        if (response.status === 200) {
            return response.json().then(data => data);
        }
        //GET /courses/:id error code is 404
        else if (response.status === 404) {
            return null;
        }
        //reached if 500 or any other status code
        else {
            throw new Error();
        }
    }



    //POST /courses, using the user and password credentials and course JSON
    async createCourse(course, user, password) {
        const username = user.emailAddress;
        const response = await this.api('/courses', 'POST', course, true, { username, password });
        if (response.status === 201) {
            return [];
        }
        //POST /courses error code is 400
        else if (response.status === 400) {
            return response.json().then(data => {
                return data.message;
            });
        }
        //reached if 500 or any other status code
        else {
            throw new Error();
        }
    }




    //PUT /courses/:id, from this ID using these credentials and ID
    async updateCourse(course, id, user, password) {
        const username = user.emailAddress;
        const response = await this.api('/courses/' + id, 'PUT', course, true, { username, password });
        if (response.status === 204) {
            return [];
        }
        //PUT /courses/:id error code is 400
        else if (response.status === 400) {
            return response.json().then(data => {
                return data;
                //in project 9, the error message for PUT /courses/:id didn't have a name value.
                //pass the whole string out as the error validation message
            });
        }
        //reached if 500 or any other status code
        else {
            throw new Error();
        }
    }





    //DELETE /courses/:id, from this ID, for these credentials
    async deleteCourse(id, user, password) {
        const username = user.emailAddress;
        const response = await this.api('/courses/' + id, 'DELETE', null, true, { username, password });
        if (response.status === 204) {
            return [];
        }






        //DELETE /courses/:id error code is 400
        else if (response.status === 400) {
            return response.json().then(data => {
                return data.message;
            });
        }
        //reached if 500 or any other status code
        else {
            throw new Error();
        }
    }
}