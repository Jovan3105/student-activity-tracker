import moment from "moment"
import { useCallback, useEffect, useState } from "react";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../utils/services";
import { json, useNavigate } from "react-router-dom";
import { useSocket } from "../Context/SocketContext";

const IndividualQuiz = ({ quiz }) => {

    //const creatorName = getRequest(`${baseUrl}/users/find/${quiz?.creatorId}`);
    const navigate = useNavigate();
    const { initializeSocket } = useSocket();
    const cutText = (text) => {
        let shortText = text.substring(0, 20);

        if (text.length > 20) {
            shortText = shortText + "...";
        }
        return shortText;
    };

    const modifyQuiz = (e) => {
        navigate(`/quizes/${quiz._id}`);
    }

    const deleteQuiz = async (id) => {
        console.log(id);

        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        if (isConfirmed) {
            const response = await deleteRequest(`${baseUrl}/quizes/${id}`);
            window.location.reload(true);
        }

    }

    const startGame = useCallback(async () => {
        const game = await postRequest(`${baseUrl}/games/`, JSON.stringify(
            {
                quizId: quiz._id,
                isActive: true,
                pin: Math.floor(Math.random() * 9000) + 1000,
            }
        ));

        if (game.error) {
            return console.log(game.error);
        }

        const scoreboard = await postRequest(`${baseUrl}/scoreboards/`, JSON.stringify(
            {
                gameId: game._id,
                playerGameplays: []
            }
        ))

        if (scoreboard.error) {
            return console.log(scoreboard.error);
        }

        const socket = initializeSocket()
        socket.emit("setupGame", game, scoreboard);

        navigate(`/games/host/${game._id}`);

    }, [initializeSocket, navigate, quiz._id]);


    const showAllGames = (id) => {
        sessionStorage.setItem("Quiz", JSON.stringify(quiz));
        navigate(`/${id}/all-games`);
    }

    //console.log(quiz?.creatorId);
    //console.log(creatorName);
    return (
        <div className="container">
            <div className="card m-3">
                <div className="row">
                    <div className="col-md-4" style={{ backgroundImage: "url(" + quiz?.backgroundImage + ")", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
                        {/* <img src={quiz?.backgroundImage} className="img-fluid" alt="Responsive Image" /> */}
                    </div>

                    <div className="col-md-6">
                        <h2 className="mb-3">{quiz?.name}</h2>
                        <p>
                            {cutText(quiz?.description)}
                        </p>
                        <p>
                            <i>Created at: {moment(quiz.createdAt).calendar()}</i>
                        </p>
                        <p>
                            <i>By: {quiz?.creatorName}</i>
                        </p>
                    </div>

                    <div className="col-md-2 d-flex align-items-center ">
                        <div className="mt-2 mb-2">
                            <button type="button" className="btn btn-primary mb-2 w-100" onClick={startGame}>Start</button>
                            <br />
                            <button type="button" className="btn btn-secondary mb-2 w-100" onClick={modifyQuiz}>Modify</button>
                            <br />
                            <button type="button" className="btn btn-danger mb-2 w-100" onClick={() => deleteQuiz(quiz._id)}>Delete</button>
                            <br />
                            <button type="button" className="btn btn-info w-100" onClick={() => showAllGames(quiz._id)}>All games</button>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default IndividualQuiz;