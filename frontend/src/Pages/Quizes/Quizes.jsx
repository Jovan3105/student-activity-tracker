import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../../utils/services";
import IndividualQuiz from "../../Components/IndividualQuiz";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Dropdown, DropdownButton, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./style.css";
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

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
    const [showModalUsers, setShowModalUsers] = useState(false);
    const [showModalResults, setShowModalResults] = useState(false);
    const [bestGames, setBestGames] = useState([]);
    const gridRef = useRef();
    const [isResultsScreen, setIsResultsScreen] = useState(true);

    const uniqueColumns = Array.from(
        new Set(bestGames.flatMap((row) => Object.keys(row)))
    );

    // Generate column definitions dynamically
    const columnDefs = uniqueColumns.map((column) => ({
        headerName: column,
        field: column,
        filter: true
    }));


    const tooltipSettings = (
        <Tooltip id="tooltip">
            Settings
        </Tooltip>
    );

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

    const deleteSubject = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        if (isConfirmed) {
            deleteRequest(`${baseUrl}/subjects/${id}`);
            navigate("/");
        }
    }

    useEffect(() => {
        const getBestGames = async () => {
            if (quizes.length === 0) {
                return;
            }

            let quizIds = [];
            quizes.forEach((quiz) => {
                quizIds.push(quiz._id);
            })
            const response = await postRequest(`${baseUrl}/games/best-results-matrix`, JSON.stringify({ quizIds: quizIds }));

            let matrix = [];
            subject?.studentList.forEach((student) => {
                matrix.push({
                    name: student.name,
                    index: student.email.split("@")[0]
                });
                let sum = 0;
                response.forEach((quiz) => {
                    if (!quiz) {
                        return;
                    }
                    matrix[matrix.length - 1][quiz.quizName] = 0;
                    quiz.students.forEach((quizStudent) => {
                        if (student._id === quizStudent._id) {
                            matrix[matrix.length - 1][quiz.quizName] = quizStudent.score;
                            sum += quizStudent.score;
                        }
                    });
                });
                matrix[matrix.length - 1]["sum"] = sum;
            });

            setBestGames(matrix);
        };

        getBestGames();

    }, [quizes]);

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
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
                    <div className="d-flex justify-content-center">
                        <h3 className="text-center">{subject.name + " " + subject.year}</h3> &nbsp;
                        <OverlayTrigger placement="top" overlay={tooltipSettings}>
                            <DropdownButton
                                title=
                                {
                                    <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "relative", left: "3px", bottom: "2px" }} width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"></path>
                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"></path>
                                    </svg>
                                }
                                variant="card" drop="end" size="sm" style={{ top: "3px" }}>
                                <Dropdown.Item onClick={() => { setShowModalUsers(true) }}>Show subscribed students</Dropdown.Item>
                                <Dropdown.Item onClick={() => { setShowModalResults(true) }}>Show results for all quizes</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item style={{ color: "red" }} onClick={() => deleteSubject(subject._id)}>Delete</Dropdown.Item>
                            </DropdownButton>
                        </OverlayTrigger>
                    </div>
                    <Modal show={showModalUsers} onHide={() => setShowModalUsers(false)}>
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
                            <Button variant="secondary" onClick={() => setShowModalUsers(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showModalResults} onHide={() => setShowModalResults(false)} dialogClassName="results-modal">
                        <Modal.Header closeButton>
                            <Modal.Title>Results</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {
                                isResultsScreen ?
                                    <>
                                        <div className="container">
                                            <div className="row justify-content-between">
                                                <button className="btn btn-secondary mb-2 col-md-3" onClick={onBtnExport}>Download CSV export file</button>
                                                <button className="btn btn-primary mb-2 col-md-3" onClick={() => setIsResultsScreen((prev) => !prev)}>Compare to other years</button>
                                            </div>
                                        </div>

                                        <div
                                            className="ag-theme-quartz" // applying the grid theme
                                            style={{ height: 500 }} // the grid will fill the size of the parent container
                                        >
                                            <AgGridReact
                                                rowData={bestGames}
                                                columnDefs={columnDefs}
                                                ref={gridRef}
                                            />
                                        </div>
                                    </> :
                                    <>
                                        <div className="container">
                                            <div className="row justify-content-between">
                                                <button className="btn btn-primary mb-2 col-md-3" onClick={() => setIsResultsScreen((prev) => !prev)}>Back</button>
                                            </div>
                                        </div>

                                        <div>
                                            Barplot
                                        </div>
                                    </>
                            }

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModalResults(false)}>
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