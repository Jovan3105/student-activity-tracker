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

    useEffect(() => {
        const response = getRequest(`${baseUrl}/games/${quizId}/games`).then((value) => {
            //console.log(value);
            setGames(value);
        })
    }, []);

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
                                            <div className="col-12 col-lg-3 col-xxl-2 px-3 py-3" key={game._id} onClick={() => setShowModal(true)}>
                                                <div className="card mx-auto element-game">
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <h5 className="mb-3">
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
                        <Modal.Title>Modal Title</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Modal content goes here */}
                        <p>This is the modal content.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        {/* Button to close the modal */}
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