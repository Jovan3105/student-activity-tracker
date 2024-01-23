import { useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext";

const Player = () => {
    const { initializeSocket } = useSocket();
    const [socket, setSocket] = useState(null);
    const [isTimerScreen, setIsTimerScreen] = useState(false);
    const [isQuestionScreen, setIsQuestionScreen] = useState(false);
    const [isQuestionAnswered, setIsQuestionAnswered] = useState(false)
    const [timer, setTimer] = useState(5);
    const [questionData, setQuestionData] = useState(null);
    const [timeToAnswer, setTimeToAnswer] = useState(0);


    const [answer, setAnswer] = useState({
        questionIndex: 0,
        answer: null,
        time: 0,
    })

    useEffect(() => {
        const socket = initializeSocket();
        setSocket(socket);
        socket.on("questionCountdownFromHost");
        countdown(5);
        socket.on("questionCountdownForPlayerFromHost", (time, question) => {
            setQuestionData(question);
            countdown(time, true);
            setAnswer((prev) => ({
                ...prev,
                questionIndex: question.questionIndex,
                answer: null,
                time: 0
            }))
        });
    }, [socket]);

    useEffect(() => {
        if (answer?.answer) {
            setIsQuestionScreen(false);
            setIsQuestionAnswered(true);
        }
        else {
            setIsQuestionAnswered(false);
        }
    }, [answer, socket, answer?.answer]);


    const countdown = (time, duringQuestion = false) => {
        setIsTimerScreen(true);
        let seconds = 0;
        let interval = setInterval(() => {
            setTimer(time--);
            if (!duringQuestion) {
                setTimeToAnswer(seconds++);
            }
            if (time === -1) {
                clearInterval(interval);
                if (!duringQuestion) {
                    setIsQuestionScreen(true);
                    setIsTimerScreen(false);
                }
            }
        }, 1000);
    }
    const selectAnswer = (clickedAnswer) => {
        setAnswer((prev) => ({
            ...prev,
            answer: clickedAnswer, // Set the answers array to contain only the selected answer
            time: timeToAnswer,
        }));
    };

    console.log(answer)
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
        </div>
    );
}

export default Player;