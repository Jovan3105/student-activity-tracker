import { useNavigate, useParams } from "react-router-dom";
import { baseUrl, getRequest, patchRequest } from "../../utils/services";
import { useEffect, useRef, useState } from "react";
import "./style.css";

const CreateQuiz = () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const { id } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState({
        name: "",
        creatorName: `${user?.name}`,
        backgroundImage: "",
        description: "",
        pointsPerQuestion: 1,
        numberOfQuestions: 0,
        questionList: [],
    })
    const scroll = useRef();
    const inputRef = useRef(null);

    const [isQuestionTrueFalse, setIsQuestionTrueFalse] = useState(false);
    const [answerCount, setAnswerCount] = useState(0);
    const [questionData, setQuestionData] = useState({
        questionIndex: 1,
        question: "",
        questionType: 1,
        answerTime: 5,
        backgroundImage: "",
        answerList: [
            { name: "a", body: "", isCorrect: false },
            { name: "b", body: "", isCorrect: false },
            { name: "c", body: "", isCorrect: false },
            { name: "d", body: "", isCorrect: false },
        ]
    })

    useEffect(() => {
        const response = getRequest(`${baseUrl}/quizes/${id}`).then((value) => {
            //console.log(value)
            setQuizData(value);
        });

        if (response.error) {
            return console.log(response.error);
        }

        //console.log(response)
    }, [])

    const submitQuiz = (e) => {
        const response = patchRequest(`${baseUrl}/quizes/${id}`, quizData);
        navigate("/quizes");
    }

    const discardQuiz = (e) => {
        navigate("/quizes");
    }

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const changeQuizProperties = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value })
        //console.log(quizData)
    }
    const changeQuestionProperties = (e) => {
        setQuestionData({ ...questionData, [e.target.name]: parseInt(e.target.value) })
        setQuestionData((prev) => ({
            ...prev, questionIndex: quizData.questionList.length + 1
        }))
        //console.log(questionData)
    }
    const changeQuestionStrings = (e) => {
        setQuestionData({ ...questionData, [e.target.name]: e.target.value })
        setQuestionData((prev) => ({
            ...prev, questionIndex: quizData.questionList.length + 1
        }))
        //console.log(questionData)
    }

    const cutText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "...";
        }
        return shortText;
    };

    const changeQuestionType = () => {

        setIsQuestionTrueFalse((prev) => !prev);

        if (!isQuestionTrueFalse) {
            // removes last two unnecessary elements if it is True/False type
            questionData.answerList.splice(2, 2);
        }
        else {
            questionData.answerList.push({ name: "c", body: "", isCorrect: false });
            questionData.answerList.push({ name: "d", body: "", isCorrect: false });
        }

        questionData.answerList[0].body = "True";
        questionData.answerList[1].body = "False";
        questionData.answerList.forEach((answer) => (answer.isCorrect = false));
        // after changing question type we also need to reset the value back to 0
        setAnswerCount(0);
    }

    const changeQuestionAnswer = (name, body, index) => {
        setQuestionData((prev) => {
            const updatedAnswerList = [
                ...prev.answerList.slice(0, index),
                { name, body, isCorrect: prev.answerList[index].isCorrect },
                ...prev.answerList.slice(index + 1),
            ];

            return { ...prev, answerList: updatedAnswerList };
        });
    };

    const setIsCorrectAnswer = (index) => {
        setQuestionData((prev) => {
            const updatedAnswerList = prev.answerList.map((answer, i) => {
                if (i === index) {
                    return {
                        name: answer.name,
                        body: answer.body,
                        isCorrect: !answer.isCorrect,
                    };
                }
                return answer;
            });

            return {
                ...prev,
                answerList: updatedAnswerList,
            };
        });

        setAnswerCount((prev) => {
            return questionData.answerList[index].isCorrect ? prev - 1 : prev + 1;
        });
    };

    const addQuestion = () => {

        setQuizData((prev) => ({
            ...prev,
            questionList: [...prev.questionList, questionData],
        }));

        setQuestionData({
            questionIndex: quizData.questionList.length + 1,
            question: "",
            questionType: 1,
            answerTime: 5,
            backgroundImage: "",
            answerList: [
                { name: "a", body: "", isCorrect: false },
                { name: "b", body: "", isCorrect: false },
                { name: "c", body: "", isCorrect: false },
                { name: "d", body: "", isCorrect: false },
            ]
        });

        setAnswerCount(0);
        inputRef.current.value = "";
    };

    const removeQuestion = (index) => {

        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        if (isConfirmed) {
            setQuizData((prev) => ({
                ...prev,
                questionList: [
                    ...prev.questionList.slice(0, index - 1),
                    ...prev.questionList.slice(index, prev.questionList.length),
                ],
            }));

            quizData.questionList.forEach((question) => {
                if (question.questionIndex > index) {
                    question.questionIndex -= 1;
                }
            });

            setQuestionData({
                questionIndex: 1,
                question: "",
                questionType: 1,
                answerTime: 5,
                backgroundImage: "",
                answerList: [
                    { name: "a", body: "", isCorrect: false },
                    { name: "b", body: "", isCorrect: false },
                    { name: "c", body: "", isCorrect: false },
                    { name: "d", body: "", isCorrect: false },
                ]
            });
        }

    }

    //console.log(quizData);
    //console.log(user);
    console.log(questionData)
    console.log(quizData.questionList.length)
    return (
        <div className="row justify-content-center">
            <div className="col-md-3 mb-3">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">{cutText(quizData?.name)}</h4>
                    </div>
                    <div className="card-body custom-list overflow-auto" style={{ maxHeight: "35vw" }}>
                        {
                            quizData.questionList.length > 0 && quizData.questionList.map((question) => (
                                <div className="card-header border mt-2" key={question.questionIndex} ref={scroll}>
                                    <div className="row">
                                        <div className="col-md-10">
                                            <span>{question.question}</span>
                                        </div>
                                        <div className="col-md-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => removeQuestion(question.questionIndex)} width="16" height="16" fill="currentColor" className="bi bi-trash deleteQuestionButton" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="row mx-auto w-75">
                            <button className={(questionData?.question === "" || answerCount == 0) ? "btn btn-primary btn-block mt-2 disabled" : "btn btn-primary btn-block mt-2"} onClick={addQuestion}>Add question</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">Create new question</h4>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <input ref={inputRef} className="text-center mx-auto w-75 form-control" type="text" name="question" placeholder="Enter your question" onChange={(e) => changeQuestionStrings(e)}></input>
                        </div>
                        <div className="row p-3">
                            <div className="card">
                                <h4 className="text-center">Import image</h4>
                                <div className="card-body">
                                    {(questionData?.backgroundImage.includes(".jpg")) &&
                                        <>
                                            <div className="mx-auto" style={{ backgroundImage: "url(" + questionData?.backgroundImage + ")", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", height: "200px" }}></div>
                                            <br></br>
                                        </>
                                    }
                                    <input type="text" className="form-control" placeholder="Enter question image URL (only JPG format)" name="backgroundImage" onInput={(e) => changeQuestionStrings(e)} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="d-flex flex-row pb-3 pt-3">
                                <input type="text" className="form-control w-50" placeholder="Answer 1" name="a" value={questionData.answerList[0].body}
                                    onChange={(e) => { isQuestionTrueFalse ? changeQuestionAnswer(e.target.name, "True", 0) : changeQuestionAnswer(e.target.name, e.target.value, 0) }}
                                    onClick={() => { (questionData.answerList[0].isCorrect || answerCount < 1) && setIsCorrectAnswer(0) }}
                                    style={questionData.answerList[0].isCorrect ? { border: "3px solid green" } : { border: "" }}>
                                </input>&nbsp;
                                <input type="text" className="form-control w-50" placeholder="Answer 1" name="b" value={questionData.answerList[1].body}
                                    onChange={(e) => { isQuestionTrueFalse ? changeQuestionAnswer(e.target.name, "False", 1) : changeQuestionAnswer(e.target.name, e.target.value, 1) }}
                                    onClick={() => { (questionData.answerList[1].isCorrect || answerCount < 1) && setIsCorrectAnswer(1) }}
                                    style={questionData.answerList[1].isCorrect ? { border: "3px solid green" } : { border: "" }}>
                                </input>
                            </div>
                            {!isQuestionTrueFalse && <div className="d-flex flex-row">
                                <input type="text" className="form-control w-50" placeholder="Answer 1" name="c" value={questionData.answerList[2].body}
                                    onChange={(e) => changeQuestionAnswer(e.target.name, e.target.value, 2)}
                                    onClick={() => { (questionData.answerList[2].isCorrect || answerCount < 1) && setIsCorrectAnswer(2) }}
                                    style={questionData.answerList[2].isCorrect ? { border: "3px solid green" } : { border: "" }}>
                                </input>&nbsp;
                                <input type="text" className="form-control w-50" placeholder="Answer 1" name="d" value={questionData.answerList[3].body}
                                    onChange={(e) => changeQuestionAnswer(e.target.name, e.target.value, 3)}
                                    onClick={() => { (questionData.answerList[3].isCorrect || answerCount < 1) && setIsCorrectAnswer(3) }}
                                    style={questionData.answerList[3].isCorrect ? { border: "3px solid green" } : { border: "" }}>
                                </input>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <div className="card">
                    <div className="card-header d-flex justify-content-center">
                        <h4 className="text-center">Properties</h4>
                        &nbsp;
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16" onClick={() => { window.alert("Test") }} style={{ position: "relative", top: "10px" }}>
                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                        </svg>
                    </div>
                    <div className="card-body">
                        <h6><u>For current question</u></h6>
                        <span>Question type</span>&nbsp;
                        <select className="form-select" name="questionType" onChange={(e) => { changeQuestionProperties(e); changeQuestionType() }}>
                            <option defaultValue disabled>
                                Select question type
                            </option>
                            <option value={1}>
                                Quiz
                            </option>
                            <option value={0}>
                                True/False
                            </option>
                        </select>
                        <span>Answer time</span>&nbsp;
                        <select className="form-select" name="answerTime" onChange={changeQuestionProperties}>
                            <option defaultValue disabled>
                                Set time limit
                            </option>
                            <option value={5}>
                                5sec
                            </option>
                            <option value={10}>
                                10sec
                            </option>
                            <option value={20}>
                                20sec
                            </option>
                            <option value={30}>
                                30sec
                            </option>
                            <option value={60}>
                                1min
                            </option>
                            <option value={90}>
                                1,5min
                            </option>
                        </select>
                        <hr></hr>
                        <h6><u>For whole quiz</u></h6>
                        <span>Title</span>
                        <input type="text" className="form-control" placeholder="Enter title" name="name" value={quizData?.name} onChange={changeQuizProperties} />
                        <span>Description</span>
                        <input type="text" className="form-control" placeholder="Enter description" name="description" value={quizData?.description} onChange={changeQuizProperties} />
                        <span>Image url</span>
                        <input type="text" className="form-control" placeholder="Enter background image URL" name="backgroundImage" value={quizData?.backgroundImage} onInput={changeQuizProperties} />
                        {/* Image url is the current solution for uploading images */}
                        <div className="row mx-auto w-75">
                            <button className="btn btn-primary btn-block mt-2" onClick={submitQuiz}>Save & Exit</button>
                            <button className="btn btn-danger btn-block mt-2" onClick={discardQuiz}>Discard</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateQuiz;