import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl, getRequest } from "../../utils/services";
import { useSocket } from "../../Context/SocketContext";

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
        const socket = initializeSocket();
        setSocket(socket);
        socket.on("addedPlayer", (player) => {
            setPlayers([...players, player])
        });
        console.log(players);
    }, [players, socket])

    const startGame = () => {
        socket.emit("startGame");
        socket.emit("questionCountdown");
        beforeQuestionCountdown(5);
        setIsGameStarted((prev) => !prev);
        setIsTimerScreen(true);
    }

    const beforeQuestionCountdown = (time) => {
        setIsTimerScreen(true);
        let interval = setInterval(() => {
            setTimer(time--);
            if (time === 0) {
                clearInterval(interval);
                setIsQuestionScreen(true);
                setIsTimerScreen(false);
            }
            //console.log(time)
        }, 1000);
    }


    console.log(gameData);
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
                        <h1 className="text-center">Question with image and answers</h1>
                    </div>
                </div>
            }
        </div>
    );
}

export default Host;