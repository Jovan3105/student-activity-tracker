import { useParams } from "react-router-dom";
import { baseUrl, getRequest } from "../../utils/services";
import { useEffect, useState } from "react";

const CreateQuiz = () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const { id } = useParams();
    const [quizData, setQuizData] = useState({
        name: "",
        creatorName: `${user?.name}`,
        backgroundImage: "",
        description: "",
        pointsPerQuestion: 1,
        numberOfQuestions: 0,
        questionList: [],
    })

    useEffect(() => {
        const response = getRequest(`${baseUrl}/quizes/${id}`).then((value) => {
            setQuizData(value);
        });

        if (response.error) {
            return console.log(response.error);
        }

        //console.log(response)
    }, [])

    //console.log(quizData);
    //console.log(user);
    
    return (
        <div className="row justify-content-center">
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">{quizData.name}</h4>
                    </div>
                    <div className="card-body">
                        <button className="btn btn-primary btn-block mt-1">Submit</button>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">Create new quiz</h4>
                    </div>
                    <div className="card-body">
                        <button className="btn btn-primary btn-block mt-1">Submit</button>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">Properties</h4>
                    </div>
                    <div className="card-body">
                        <span>Question type</span>&nbsp;
                        <select className="form-select" name="questionType">
                            <option disabled>
                                Select question type
                            </option>
                            <option defaultValue value="Quiz">
                                Quiz
                            </option>
                            <option value="True/False">
                                True/False
                            </option>
                        </select>
                        <button className="btn btn-primary btn-block mt-1">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateQuiz;