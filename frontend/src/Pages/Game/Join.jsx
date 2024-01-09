import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Join = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, []);

    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card">
                    <div className="card-header">
                        <h4 className="text-center">Join by PIN</h4><br></br>
                    </div>
                    <div className="card-body">
                        <div className="card-body">
                            <input type="number" className="form-control text-center" placeholder="Example: 1234"></input>
                        </div>
                        <div className="row mx-auto w-75">
                            <button className="btn btn-primary btn-block mt-2" >Join</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Join;