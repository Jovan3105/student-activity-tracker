import { Button, Modal } from "react-bootstrap";
import "./style.css";
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../../utils/services";
import { useParams } from "react-router-dom";
import moment from "moment";
const AllGames = () => {
    const { quizId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [games, setGames] = useState([]);
    const quiz = JSON.parse(sessionStorage.getItem("Quiz"));
    const [modalGameResult, setModalGameResult] = useState(null);

    useEffect(() => {
        const response = getRequest(`${baseUrl}/games/${quizId}/games`).then((value) => {
            //console.log(value);
            setGames(value);
        })
    }, []);

    const showGame = (id) => {
        setShowModal(true);
        const response = getRequest(`${baseUrl}/games/${id}`).then((value) => {
            //console.log(value.results);
            setModalGameResult(value.results);
        })
    }

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-md-10 mb-2">
                    <h3 className="text-center">{quiz.name}</h3>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-10 mb-3">
                    <div className="card">
                        <div className="card-body custom-list overflow-auto" style={{ maxHeight: "60vw" }}>
                            <div className="row g-2">
                                {
                                    games.length != 0 ?
                                        games.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) }).map((game, index) => (
                                            <div className="col-12 col-lg-3 col-xxl-2 px-3 py-3" key={game._id} onClick={() => showGame(game._id)}>
                                                <div className="card mx-auto element-game">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <h5 className="mb-3 text-center">
                                                                Game {games.length - index}
                                                            </h5>
                                                        </div>
                                                        <div className="row">
                                                            <small>
                                                                <i>Created at: {moment(game.createdAt).calendar()}</i>
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : <div>
                                            <p className="text-center"><b>No games yet.</b></p>
                                        </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Results</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="card">
                            <div className="card-body">
                                <div className="card-body custom-list overflow-auto" style={{ maxHeight: "30vw" }}>
                                    {
                                        modalGameResult?.length > 0 ? modalGameResult.sort(function (a, b) { return b.score - a.score }).map((player) => (
                                            <div className="card-header border mt-2 row" key={player._id}>
                                                <div className="col-md-6 text-start">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16" style={{ position: "relative", bottom: "2px", right: "2px" }}>
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                    </svg>
                                                    <span className="text-start">{player.name}</span>
                                                </div>
                                                <div className="col-md-6 text-end">
                                                    <span><b>{player.score}</b></span>
                                                </div>
                                            </div>
                                        )) :
                                            <div>
                                                <p className="text-center"><b>No results.</b></p>
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
        </>
    );
}

export default AllGames;