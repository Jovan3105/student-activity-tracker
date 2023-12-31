import moment from "moment"
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { useNavigate } from "react-router-dom";

const IndividualQuiz = ({ quiz }) => {

    //const creatorName = getRequest(`${baseUrl}/users/find/${quiz?.creatorId}`);
    const navigate = useNavigate();
    const cutText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "...";
        }
        return shortText;
    };

    const modifyQuiz = (e) => {
        navigate(`/quizes/${quiz._id}`);
    }

    //console.log(quiz?.creatorId);
    //console.log(creatorName);
    return (
        <div className="container">
            <div className="card m-3">
                <div className="row">
                    <div className="col-md-4" style={{backgroundImage: "url("+quiz?.backgroundImage+")", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center"}}>
                        {/* <img src={quiz?.backgroundImage} className="img-fluid" alt="Responsive Image" /> */}
                    </div>

                    <div className="col-md-6">
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

                    <div className="col-md-2 d-flex justify-content-center ">
                        <div className="mt-2 mb-2">
                            <button type="button" className="btn btn-primary mb-2">Start</button>
                            <br />
                            <button type="button" className="btn btn-secondary mb-2" onClick={modifyQuiz}>Modify</button>
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