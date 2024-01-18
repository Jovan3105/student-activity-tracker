import { useContext, useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext";
import { Alert } from "react-bootstrap";
import { baseUrl, postRequest } from "../../utils/services";
import { useNavigate } from "react-router-dom";

const Join = () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const navigate = useNavigate();
    const [pin, setPin] = useState(0);
    const { initializeSocket } = useSocket();
    const [socket, setSocket] = useState(null);
    const [playerAdded, setPlayerAdded] = useState(false);
    const [errorExists, setErrorExists] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        socket?.on("redirectPlayers", async (gameId) => {
            const response = await postRequest(`${baseUrl}/playerGameplays/`, JSON.stringify(
                {
                    playerId: user._id,
                    gameId: gameId,
                    score: 0,
                    questionList: [],
                }
            ));

            navigate(`/games/player/${gameId}`);
        })
    }, [socket, user._id, navigate]);

    const join = () => {
        const socket = initializeSocket();
        setSocket(socket);
        socket.emit("addPlayer", user, pin, (error) => {
            if (error) {
                setErrorExists(true);
                setErrorMessage(error);
                setPlayerAdded(false);
            }
        });
        setPlayerAdded(true);
    }

    const closeAlert = () => {
        setErrorExists(false);
    };

    setTimeout(closeAlert, 3000);

    console.log(socket, typeof (pin));
    //console.log(pin);
    return (
        <div className="row justify-content-center" style={{ paddingTop: "15%" }}>
            <div className="col-md-5">
                <div className="card">
                    {!playerAdded ?
                        <div>
                            <div className="card-header">
                                <h4 className="text-center">Join by PIN</h4><br></br>
                            </div>
                            <div className="card-body">
                                <div className="card-body">
                                    <input type="number" className="form-control text-center" placeholder="Example: 1234" name="pin" value={pin} onChange={(e) => setPin(parseInt(e.target.value))} ></input>
                                </div>
                                <div className="row mx-auto w-75">
                                    <button className={pin.toString().length !== 4 ? "btn btn-primary btn-block mt-2 disabled" : "btn btn-primary btn-block mt-2 enabled"} onClick={join} >Join</button>
                                </div>
                            </div>
                        </div> : <div className="m-3">
                            <div className="row mx-auto card-header border mt-2">
                                <h4 className="text-center">Game successfully joined.</h4><br></br>
                            </div><div className="row mx-auto card-header border mt-2">
                                <h4 className="text-center">Waiting for the host to start the game.</h4><br></br>
                            </div>
                        </div>
                    }
                </div>
                {
                    errorExists && <Alert variant="danger" className="text-center mt-2">
                        <p>
                            {errorMessage}
                        </p>
                    </Alert>
                }
            </div>
        </div>
    );
}

export default Join;