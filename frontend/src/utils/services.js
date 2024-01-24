export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
    //console.log("body",body);
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body
    });

    const data = await response.json();
    // data is returned as a json message with a status code

    if (!response.ok) {
        let message;

        if (data?.message) {
            message = data.message; // other server messages that we dont have control of
        }
        else {
            message = data; // our custom messages
        }

        return { error: true, message };
    }


    return data;
}
export const getRequest = async (url) => {

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
        let message = "An error occurred.";

        if (data?.message) {
            message = data.message;
        }

        return { error: true, message };
    }

    return data;
};

export const deleteRequest = async (url) => {

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('DELETE request successful:', data);
        })
        .catch(error => {
            console.error('Error during DELETE request:', error);
        });
};

export const patchRequest = async (url, body) => {

    return await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('PATCH request successful:', data);
            return data;
        })
        .catch(error => {
            console.error('Error during PATCH request:', error);
        });
};
