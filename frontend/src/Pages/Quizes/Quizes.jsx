import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../../utils/services";
import IndividualQuiz from "../../Components/IndividualQuiz";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import "./style.css";

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
    const [showModal, setShowModal] = useState(false);

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

    const unsubscribeUserFromSubject = (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to remove this user?');

        if (isConfirmed) {
            deleteRequest(`${baseUrl}/subjects/unsubscribe/${subject._id}/${userId}`).then(() => {
                const updatedUserList = subject.studentList.filter(user => user._id !== userId);
                subject.studentList = updatedUserList;
                sessionStorage.setItem("Subject", JSON.stringify(subject));
                window.location.reload(true);
            });
        }
    }

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
                    <div className="d-flex justify-content-center">
                        <h3 className="text-center">{subject.name + " " + subject.year}</h3> &nbsp;
                        <button className="btn card show-users-button" onClick={() => { setShowModal(true) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                            </svg>
                        </button>
                    </div>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Subscribed users</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body custom-list overflow-auto" style={{ maxHeight: "30vw" }}>
                                        {
                                            subject?.studentList.length > 0 ? subject?.studentList.map((player) => (
                                                <div className="card-header border mt-2 row" key={player._id}>
                                                    <div className="col-md-10 text-start">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16" style={{ position: "relative", bottom: "2px", right: "2px" }}>
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                        </svg>
                                                        <span className="text-start">{player.name + " " + player.email.split("@")[0]}</span>

                                                    </div>
                                                    <div className="col-md-2 text-end">
                                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => unsubscribeUserFromSubject(player._id)} width="16" height="16" fill="currentColor" className="bi bi-trash deleteQuestionButton" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )) :
                                                <div>
                                                    <p className="text-center"><b>No one subscribed yet.</b></p>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
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