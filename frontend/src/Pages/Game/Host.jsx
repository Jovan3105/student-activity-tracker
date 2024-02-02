import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl, getRequest } from "../../utils/services";
import { useSocket } from "../../Context/SocketContext";
import * as XLSX from 'xlsx';

const Host = () => {
    const { id } = useParams();
    const [gameData, setGameData] = useState(null);
    const [players, setPlayers] = useState([]);
    const { initializeSocket } = useSocket();
    const [socket, setSocket] = useState(null);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [isTimerScreen, setIsTimerScreen] = useState(false);
    const [isQuestionScreen, setIsQuestionScreen] = useState(false);
    const [timer, setTimer] = useState(5);
    const [currentQuestionId, setCurrentQuestionId] = useState(0);
    const [quizData, setQuizData] = useState(null);
    const [isScoreboardScreen, setIsScoreboardScreen] = useState(false);
    const [playerGameplays, setPlayerGameplays] = useState([]);
    const excelData = [];

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
        const fetchData = async () => {
            try {
                const response = await getRequest(`${baseUrl}/games/${id}`);
                if (response.error) {
                    console.error(response.error);
                } else {
                    setGameData(response);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (gameData) {
            const response = getRequest(`${baseUrl}/quizes/${gameData.quizId}`).then((value) => {
                console.log(value)
                setQuizData(value);
            });

            if (response.error) {
                return console.log(response.error);
            }
        }
    }, [gameData]);

    useEffect(() => {
        const socket = initializeSocket();
        setSocket(socket);
        socket.on("addedPlayer", (player) => {
            setPlayers([...players, player])
        });
        console.log(players);
    }, [players, socket])

    useEffect(() => {
        for (let i = 0; i < players.length; i++) {
            for (let j = 0; j < playerGameplays.length; j++) {
                if (players[i]._id === playerGameplays[j].playerId) {
                    excelData.push({ name: players[i].name, score: playerGameplays[j].score });
                }
            }
        }
        console.log("exceldata", excelData)
    }, [playerGameplays])

    const startGame = () => {
        socket.emit("startGame");
        socket.emit("questionCountdown", () => {
            startHostCountdown(5, currentQuestionId);
        });
        setIsGameStarted((prev) => !prev);
        setIsTimerScreen(true);
    }

    const startCountdown = (seconds, onTick, onComplete, isPreview) => {
        setIsTimerScreen(isPreview); // set timer screen state based on the parameter
        setIsQuestionScreen(!isPreview); // set question screen state based on the parameter

        let interval = setInterval(() => {
            onTick(seconds--);

            if (seconds === -1) {
                clearInterval(interval);
                onComplete();
            }

        }, 1000);
    };

    const startHostCountdown = (seconds, index) => {
        startCountdown(seconds,
            (time) => setTimer(time),
            () => {
                if (index === quizData.questionList.length) {
                    const response = getRequest(`${baseUrl}/playerGameplays/${gameData._id}/players`).then((value) => {
                        //console.log(value)
                        setPlayerGameplays(value);
                    });
                    setIsQuestionScreen(false);
                    setIsTimerScreen(false)
                    //console.log("isQuestionScreen", isQuestionScreen)
                    setIsScoreboardScreen(true);
                    socket.emit("gameOver");
                    return;
                }
                else {
                    setIsQuestionScreen(true);
                }
                showQuestion(index);
                setIsTimerScreen(false);
                //setIsQuestionScreen(true);

            },
            true  // set isPreview to true for timer countdown
        );
    };

    const startQuestionCountdown = (seconds, index) => {
        startCountdown(seconds,
            (time) => setTimer(time),
            () => {
                socket.emit("questionCountdown", () => {
                    startHostCountdown(5, index);
                })
            },
            false  // set isPreview to false for question countdown
        );
    };

    const showQuestion = (index) => {
        setQuestionData(quizData.questionList[index]);
        setCurrentQuestionId((prev) => prev + 1);

        let time = quizData.questionList[index].answerTime;

        setTimer(time);
        socket.emit("questionCountdownForPlayer", time, {
            answerList: quizData.questionList[index].answerList,
            questionIndex: quizData.questionList[index].questionIndex
        });
        startQuestionCountdown(time, index + 1);

    };

    const downloadExcel = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    };

    return (
        <div className="row justify-content-center">
            {!isGameStarted &&
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">Lobby</h4><br></br>
                        </div>
                        <div className="card-body">
                            <h5 className="text-center">Pin: {gameData?.pin}</h5>
                            <div className="card-body custom-list overflow-auto" style={{ maxHeight: "30vw" }}>
                                {
                                    players.length > 0 ? players.map((player) => (
                                        <div className="card-header border mt-2" key={player._id}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16" style={{ position: "relative", bottom: "2px", right: "2px" }}>
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                            </svg>
                                            <span>{player.name}</span>
                                        </div>
                                    )) :
                                        <div className="card-header border mt-2">
                                            <h4 className="text-center">Empty lobby</h4>
                                        </div>
                                }

                            </div>
                            <div className="row mx-auto w-75">
                                <button className="btn btn-primary btn-block mt-2" onClick={startGame} >Start Game</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {isTimerScreen &&
                <div className="col-md-5" style={{ paddingTop: "15%" }}>
                    <h1 className="text-center">{timer}</h1>
                </div>
            }
            {isQuestionScreen &&
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="text-center mx-auto w-75 form-control">{questionData.question}</div>
                            </div>
                            <div className="row p-3">
                                <div className="card">
                                    <div className="card-body">
                                        {questionData?.backgroundImage ?
                                            <>
                                                <h4 className="mx-auto text-center card" style={{ width: "10%" }}>{timer}</h4>
                                                <div className="mx-auto mt-3 rounded" style={{ backgroundImage: "url(" + questionData?.backgroundImage + ")", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", height: "200px" }}></div>
                                                <br></br>
                                            </>
                                            : <h2 className="mx-auto text-center card" style={{ width: "10%" }}>{timer}</h2>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="d-flex flex-row pb-3 pt-3">
                                    <input type="text" className="form-control w-50 border border-danger" placeholder="Answer 1" name="a" readOnly value={questionData.answerList[0].body}>
                                    </input>&nbsp;
                                    <input type="text" className="form-control w-50 border-primary" placeholder="Answer 2" name="b" readOnly value={questionData.answerList[1].body}>
                                    </input>
                                </div>
                                {questionData.questionType === 1 &&
                                    <div className="d-flex flex-row">
                                        <input type="text" className="form-control w-50 border-success" placeholder="Answer 3" name="c" readOnly value={questionData.answerList[2].body}>
                                        </input>&nbsp;
                                        <input type="text" className="form-control w-50 border-warning" placeholder="Answer 4" name="d" readOnly value={questionData.answerList[3].body}>
                                        </input>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            {isScoreboardScreen &&
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header d-flex justify-content-center">
                            <h4 className="text-center">Scoreboard</h4>
                            &nbsp;
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16" onClick={() => downloadExcel(excelData)} style={{ position: "relative", top: "9px" }}>
                                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                            </svg>
                        </div>
                        <div className="card-body">
                            <div className="card-body custom-list overflow-auto" style={{ maxHeight: "30vw" }}>
                                {
                                    playerGameplays.length > 0 && playerGameplays.sort(function (a, b) { return b.score - a.score }).map((player) => (
                                        <div className="card-header border mt-2 row" key={player.playerId}>
                                            {
                                                players.filter(p => p._id === player.playerId).map(p => (
                                                    <div className="col-md-6 text-start" key={p._id}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16" style={{ position: "relative", bottom: "2px", right: "2px" }}>
                                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                        </svg>
                                                        <span className="text-start ">{p.name}</span>
                                                    </div>
                                                ))
                                            }
                                            <div className="col-md-6 text-end">
                                                <span><b>{player.score}</b></span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    );
}

export default Host;