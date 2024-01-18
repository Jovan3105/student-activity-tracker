import { useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext";

const Player = () => {
    const { initializeSocket } = useSocket();
    const [socket, setSocket] = useState(null);
    const [isTimerScreen, setIsTimerScreen] = useState(false);
    const [isQuestionScreen, setIsQuestionScreen] = useState(false);
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        const socket = initializeSocket();
        setSocket(socket);
        socket.on("questionCountdownFromHost");
        beforeQuestionCountdown(5);
    }, [socket]);

    const beforeQuestionCountdown = (time) => {
        setIsTimerScreen(true);
        let interval = setInterval(() => {
            setTimer(time--);
            if (time === 0) {
                clearInterval(interval);
                setIsQuestionScreen(true);
                setIsTimerScreen(false);
            }
            //console.log(time);
        }, 1000);
    }

    return (
        <div className="row justify-content-center">
            {isTimerScreen &&
                <div className="col-md-5" style={{ paddingTop: "15%" }}>
                    <h1 className="text-center">{timer}</h1>
                </div>
            }
            {isQuestionScreen &&
                <div className="col-md-5">
                    <div className="card">
                        <h1 className="text-center">Only answers</h1>
                    </div>
                </div>
            }
        </div>
    );
}

export default Player;