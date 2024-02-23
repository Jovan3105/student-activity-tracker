import { Button, Modal } from "react-bootstrap";
import "./style.css";
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../../utils/services";
import { useParams } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const AllGames = () => {
    const { quizId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [games, setGames] = useState([]);
    const quiz = JSON.parse(sessionStorage.getItem("Quiz"));
    const [modalGameResult, setModalGameResult] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {
        const response = getRequest(`${baseUrl}/games/${quizId}/games`).then((value) => {
            //console.log(value);
            setGames(value);
            setFilteredData(value);
        })
    }, []);

    const showGame = (id) => {
        setShowModal(true);
        const response = getRequest(`${baseUrl}/games/${id}`).then((value) => {
            //console.log(value.results);
            setModalGameResult(value.results);
        })
    }
    const handleSearch = (dataRange) => {
        if (!dataRange[0] && !dataRange[1]) {
            setFilteredData(games);
        }
        
        if (dataRange[0] && dataRange[1]) {
            const filtered = games.filter(item => {
                const itemDate = new Date(item.createdAt).getTime();
                return itemDate >= dataRange[0].getTime() && itemDate <= dataRange[1].getTime();
            });
            setFilteredData(filtered);
        }

        setDateRange(dataRange);
    };

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-5 col-xxl-5 mb-3">
                    <h3 className="text-center">{quiz.name}</h3>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-5 col-xxl-5 text-center" >
                    <DatePicker
                        showIcon
                        placeholderText="Click to select"
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            handleSearch(update);
                        }}
                        isClearable={true}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48" style={{ top: "3px" }}>
                                <mask id="ipSApplication0">
                                    <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                                        <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                                        <path fill="#fff" d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"></path>
                                    </g>
                                </mask>
                                <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSApplication0)"></path>
                            </svg>
                        }
                    />
                </div>
            </div>
            <br />
            <div className="row justify-content-center">
                <div className="col-md-10 mb-3">
                    <div className="card">
                        <div className="card-body custom-list overflow-auto" style={{ maxHeight: "60vw" }}>
                            <div className="row g-2">
                                {
                                    games.length != 0 ?
                                        filteredData.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) }).map((game, index) => (
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