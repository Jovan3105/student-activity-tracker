import moment from "moment"
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

const IndividualQuiz = ({ quiz }) => {

    //const creatorName = getRequest(`${baseUrl}/users/find/${quiz?.creatorId}`);

    const cutText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "...";
        }
        return shortText;
    };

    //console.log(quiz?.creatorId);
    //console.log(creatorName);
    return (
        <div className="container">
            <div className="card m-3">
                <div className="row">
                    <div className="col-md-4">
                        <img src={quiz?.backgroundImage} className="img-fluid" alt="Responsive Image" />
                    </div>

                    <div className="col-md-4">
                        <h2 className="mb-3">{quiz?.name}</h2>
                        <p>
                            {cutText(quiz?.description)}
                        </p>
                        <p>
                            <i>Created at: {moment(quiz.createdAt).calendar()}</i>
                        </p>
                        <p>
                            <i>By: {quiz?.creatorName}</i>
                        </p>
                    </div>

                    <div className="col-md-4">
                        <div className="mt-5">
                            <button type="button" className="btn btn-primary mb-2">Start</button>
                            <br />
                            <button type="button" className="btn btn-secondary mb-2">Modify</button>
                            <br />
                            <button type="button" className="btn btn-danger mb-2">Delete</button>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default IndividualQuiz;