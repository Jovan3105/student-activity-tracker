import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl, getRequest } from "../../utils/services";

const Host = () => {
    const { id } = useParams();
    const [gameData, setGameData] = useState(null);

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

    console.log(gameData);
    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">Lobby</h4><br></br>
                    </div>
                    <div className="card-body">
                        <h5 className="text-center">Pin: {gameData?.pin}</h5>
                        <div className="card-body custom-list overflow-auto" style={{ maxHeight: "30vw" }}>
                            <div className="card-header border mt-2">
                                <span>User</span>
                            </div>
                        </div>
                        <div className="row mx-auto w-75">
                            <button className="btn btn-primary btn-block mt-2" >Start Game</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Host;