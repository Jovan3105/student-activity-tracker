import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { baseUrl, getRequest, postRequest } from "../../utils/services";
import IndividualQuiz from "../../Components/IndividualQuiz";
import { useNavigate, useParams } from "react-router-dom";

const Quizes = () => {

    const { user } = useContext(AuthContext);
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [quizes, setQuizes] = useState([]);
    const [quizData, setQuizData] = useState({
        name: "",
        creatorName: user?.name,
        backgroundImage: "",
        description: "",
        pointsPerQuestion: 1,
        questionList: [],
        subjectId: subjectId
    });
    const subject = JSON.parse(sessionStorage.getItem("Subject"));

    const updateQuiz = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value })
    }


    //console.log(quizData.questionList.length);
    console.log(quizData);
    const submitQuiz = useCallback(async () => {

        if (quizData.description.length < 1) {
            return window.alert("Missing quiz description.")
        }

        if (quizData.name.length < 1) {
            return window.alert("Missing quiz name.");
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
                questionList: quizData.questionList,
                subjectId: quizData.subjectId
            }
        ));

        if (response.error) {
            return console.log(response.error);
        }

        //console.log("response", response);
        navigate(`/quizes/${response._id}`);

    }, [quizData]);


    useEffect(() => {
        const getQuizes = async () => {

            const response = await getRequest(`${baseUrl}/quizes/${subjectId}/quizes`);

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
                            <div className="form-group">
                                <label>Name:</label>
                                <input type="text" className="form-control" placeholder="Enter title" name="name" value={quizData?.name} onChange={updateQuiz} />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <input type="text" className="form-control" placeholder="Enter description" name="description" value={quizData?.description} onChange={updateQuiz} />
                            </div>
                            <button className="btn btn-primary btn-block mt-1" onClick={submitQuiz}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <h3 className="text-center">{subject.name + " " + subject.year}</h3>
                </div>
            </div>
            <br></br>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-body custom-list overflow-auto" style={{ maxHeight: "60vw" }}>
                            {
                                quizes.length != 0 ?
                                    quizes.map((quiz) => (
                                        <IndividualQuiz key={quiz._id} quiz={quiz}></IndividualQuiz>
                                    ))
                                    : <div>
                                        <p className="text-center"><b>No quizes for this subject yet.</b></p>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
        </div>
    );
}

export default Quizes;