import { useContext, useEffect, useState } from "react";
import { useSocket } from "../../Context/SocketContext";

const Join = () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const [pin, setPin] = useState(0);
    const { initializeSocket } = useSocket();
    const [socket, setSocket] = useState(null);

    const join = () => {
        const socket = initializeSocket();
        setSocket(socket);
        socket.emit("addPlayer", user, pin);
    }

    console.log(socket, typeof (pin));
    //console.log(pin);
    return (
        <div className="row justify-content-center">
            <div className="col-md-5">
                <div className="card">
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
                </div>
            </div>
        </div>
    );
}

export default Join;