import { useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext";
import { baseUrl, getRequest, patchRequest } from "../../utils/services";
import { useNavigate, useParams } from "react-router-dom";

const Player = () => {
    const { initializeSocket } = useSocket();
    //const [socket, setSocket] = useState(null);
    const [isTimerScreen, setIsTimerScreen] = useState(false);
    const [isQuestionScreen, setIsQuestionScreen] = useState(false);
    const [isQuestionAnswered, setIsQuestionAnswered] = useState(false)
    const [timer, setTimer] = useState(5);
    const [questionData, setQuestionData] = useState(null);
    const [timeToAnswer, setTimeToAnswer] = useState(0);
    const [playerGameplayData, setPlayerGameplayData] = useState(null);
    const { id } = useParams();
    const user = JSON.parse(localStorage.getItem("User"));
    const [newPlayerGameplay, setNewPlayerGameplay] = useState(null);
    const [isAnswerResultScreen, setIsAnswerResultScreen] = useState(false);
    const socket = initializeSocket();
    let newGame = false;
    const [isGameOver, setIsGameOver] = useState(false);
    const navigate = useNavigate();


    const [answer, setAnswer] = useState({
        questionIndex: 0,
        answer: null,
        time: 0,
    })

    useEffect(() => {
        // const socket = initializeSocket();
        // setSocket(socket);
        const function1 = () => {
            // console.log("questionCountdownFromHost", socket)
            if (!newGame) {
                setIsAnswerResultScreen(false);
                setIsTimerScreen(true);
                newGame = true;
            }
            else {
                setAnswer((prev) => ({
                    ...prev,
                    answer: null
                }));
                setIsAnswerResultScreen(true);
                setIsTimerScreen(false);
            }
            startHostCountdown(5);
        }
        socket.on("questionCountdownFromHost", function1);


        const function2 = (time, question) => {
            setQuestionData(question);
            startQuestionCountdown(time);
            setAnswer((prev) => ({
                ...prev,
                questionIndex: question.questionIndex,
                answer: null,
                time: 0
            }))
        }
        socket.on("questionCountdownForPlayerFromHost", function2);


        const function3 = () => {
            setIsQuestionScreen(false);
            setIsGameOver(true);

            setInterval(() => {
                window.location.reload(true);
            }, 2000);

        }
        socket.on("gameOverFromHost", function3);

        return () => {
            socket.off("questionCountdownFromHost", function1);
            socket.off("questionCountdownForPlayerFromHost", function2);
            socket.off("gameOverFromHost", function3);
        };
    }, []);

    useEffect(() => {
        if (answer?.answer) {
            setIsQuestionScreen(false);
            setIsQuestionAnswered(true);
            sendAnswer();
        }
        else {
            setIsQuestionAnswered(false);
        }
    }, [answer, socket, answer?.answer]);

    useEffect(() => {
        //console.log("id", id);
        const response = getRequest(`${baseUrl}/playerGameplays/${id}/${user._id}`).then((value) => {
            //console.log("playerGameplay", value)
            setPlayerGameplayData(value);
        });

        if (response.error) {
            return console.log(response.error);
        }

    }, [id, user._id]);


    const startCountdown = (seconds, onTick, onComplete) => {
        let interval = setInterval(() => {
            onTick(seconds--);

            if (seconds === -1) {
                clearInterval(interval);
                onComplete();
            }

        }, 1000);
    };

    const startHostCountdown = (seconds) => {
        startCountdown(seconds,
            (time) => setTimer(time),
            () => {
                setIsTimerScreen(false);
                setIsAnswerResultScreen(false);
                setIsQuestionScreen(true);
                if (answer.answer == null) {
                    setNewPlayerGameplay(null);
                }
            }
        );
    };

    const startQuestionCountdown = (seconds) => {
        let answerSeconds = 0;

        startCountdown(seconds,
            (time) => {
                setTimer(time);
                setTimeToAnswer(answerSeconds++);
            },
            () => {
                setIsQuestionScreen(false);
                setIsQuestionAnswered(false);
            }
        );
    };
    const selectAnswer = (clickedAnswer) => {
        setAnswer((prev) => ({
            ...prev,
            answer: clickedAnswer, // Set the answers array to contain only the selected answer
            time: timeToAnswer,
        }));
    };

    const sendAnswer = async () => {

        const updatedGameplay = await patchRequest(`${baseUrl}/playerGameplays/${playerGameplayData._id}/answers`, {
            questionIndex: answer.questionIndex,
            answer: answer.answer,
            time: answer.time
        })
        //console.log(updatedGameplay.questionList[updatedGameplay.questionList.length - 1]);
        setNewPlayerGameplay(updatedGameplay.questionList[updatedGameplay.questionList.length - 1]);

    }

    //console.log(answer)
    return (
        <div className="row justify-content-center" style={{ paddingTop: "15%" }}>
            {isTimerScreen &&
                <div className="col-md-5">
                    <h1 className="text-center">{timer}</h1>
                </div>
            }
            {isQuestionScreen &&
                <div className="col-md-5">
                    <div className="card">
                        <div className="row">
                            <h4 className="mx-auto text-center card mt-3" style={{ width: "10%" }}>{timer}</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="d-flex flex-row pb-3 pt-3">
                                    <button type="text" className="form-control w-50 border border-danger" onClick={() => selectAnswer(questionData?.answerList[0])}>{questionData?.answerList[0].name.toUpperCase()}</button>&nbsp;
                                    <button type="text" className="form-control w-50 border-primary" onClick={() => selectAnswer(questionData?.answerList[1])}>{questionData?.answerList[1].name.toUpperCase()}</button>
                                </div>
                                {questionData?.answerList.length > 2 &&
                                    <div className="d-flex flex-row">
                                        <button type="text" className="form-control w-50 border-success" onClick={() => selectAnswer(questionData?.answerList[2])}>{questionData?.answerList[2].name.toUpperCase()}</button>&nbsp;
                                        <button type="text" className="form-control w-50 border-warning" onClick={() => selectAnswer(questionData?.answerList[3])}>{questionData?.answerList[3].name.toUpperCase()}</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            {isQuestionAnswered && (
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="mx-auto text-center card mt-3">Waiting for the timer finish...</h4>
                        </div>
                    </div>
                </div>
            )}
            {isAnswerResultScreen && (
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header" style={{ backgroundColor: (!newPlayerGameplay || newPlayerGameplay.points === 0) ? "#FF6868" : "#DCFFB7" }}>
                            <h4 className="text-center">Result:</h4><br></br>
                        </div>
                        <div className="card-body">
                            <h3 className="mx-auto text-center">
                                {(!newPlayerGameplay || newPlayerGameplay.points === 0) ?
                                    <span style={{ color: "#FF6868" }}>Wrong</span> :
                                    <span style={{ color: "#DCFFB7" }}>Correct</span>}
                            </h3>

                            {
                                (!newPlayerGameplay || newPlayerGameplay.points === 0) ?
                                    "" :
                                    <div>
                                        <hr></hr>
                                        <h3 className="text-center"> You earned a point!</h3>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            )}
            {isGameOver && (
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="mx-auto text-center card mt-3">Thank you for playing.</h4>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Player;