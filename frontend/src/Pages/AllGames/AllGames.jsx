import { Button, Modal } from "react-bootstrap";
import "./style.css";
import { useState } from "react";
const AllGames = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-body custom-list overflow-auto" style={{ maxHeight: "60vw" }}>
                            <div className="row g-2">
                                <div className="col-12 col-lg-3 col-xxl-2 px-3 py-3" onClick={() => setShowModal(true)}>
                                    <div className="card mx-auto element-game">
                                        <div className="card-body">
                                            <div className="row">
                                                <h5 className="mb-3">
                                                    Game 1
                                                </h5>
                                            </div>
                                            <div className="row">
                                                <small>
                                                    22.02.2024
                                                    {/* <i>Created at: {moment(game.createdAt).calendar()}</i> */}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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