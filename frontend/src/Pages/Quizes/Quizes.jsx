import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { baseUrl, getRequest, postRequest } from "../../utils/services";
import IndividualQuiz from "../../Components/IndividualQuiz";

const Quizes = () => {

    const { user } = useContext(AuthContext);
    const [quizes, setQuizes] = useState([]);
    const [quizData, setQuizData] = useState({
        name: "",
        creatorName: user?.name,
        backgroundImage: "",
        description: "",
        pointsPerQuestion: 1,
        questionList: [],
    });

    const updateQuiz = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value })
    }


    //console.log(quizData);

    const submitQuiz = useCallback(async (quizData) => {

        if (quizData.description === "") {
            return console.log("Missing quiz description.");
        }

        if (quizData.name === "") {
            return console.log("Missing quiz name.")
        }


        const response = await postRequest(`${baseUrl}/quizes/`, JSON.stringify(
            {
                name: quizData.name,
                description: quizData.description,
                backgroundImage: quizData.backgroundImage,
                creatorId: user?._id,
                creatorName: user?.name,
                pointsPerQuestion: quizData.pointsPerQuestion,
                numberOfQuestions: quizData.questionList.length,
                questionList: quizData.questionList
            }
        ));

        if (response.error) {
            return console.log(response.error);
        }


    }, []);

    useEffect(() => {
        const getQuizes = async () => {

            const response = await getRequest(`${baseUrl}/quizes`);

            if (response.error) {
                return console.log(response.error);
            }

            setQuizes(response);

        };

        getQuizes();
    }, []);

    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">Create new quiz</h4>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label>Title:</label>
                                    <input type="text" className="form-control" placeholder="Enter title" />
                                </div>
                                <div className="form-group">
                                    <label>Description:</label>
                                    <input type="text" className="form-control" placeholder="Enter description" />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mt-1">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-body custom-list overflow-auto"  style={{maxHeight:"60vw"}}>
                            {
                                quizes.map((quiz) => (
                                    <IndividualQuiz key={quiz._id} quiz={quiz}></IndividualQuiz>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <style>
                
            </style>
        </div>
    );
}

export default Quizes;