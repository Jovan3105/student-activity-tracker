import "./style.css";

const SubscribeSubject = () => {
    return (
        <div className="h-100 align-items-center justify-content-center">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <input type="text" className="form-control " placeholder="Press Enter to search." />
                </div>
            </div>
            <br></br>
            <div className="row gy-4 justify-content-center">
                <div className="col-md-12 col-lg-5 col-xxl-5">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">Available subjects</h4>
                        </div>
                        <div className="card-body custom-list overflow-auto">
                            <div className="row justify-content-center mt-2">
                                <div className="card">
                                    <div className="d-flex justify-content-between p-2">
                                        <h5>Placeholder subject 1 2024/2025</h5>
                                        <button className="btn btn-primary flex-end">Subscribe</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-5 col-xxl-5">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">My subjects</h4>
                        </div>
                        <div className="card-body custom-list overflow-auto">
                            <div className="row justify-content-center mt-2">
                                <div className="card">
                                    <div className="d-flex justify-content-between p-2">
                                        <h5>Placeholder subject 1 2024/2025</h5>
                                        <button className="btn btn-danger flex-end">Unsubscribe</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center mt-2">
                                <div className="card">
                                    <div className="d-flex justify-content-between p-2">
                                        <h5>Placeholder subject 2 2024/2025</h5>
                                        <button className="btn btn-danger flex-end">Unsubscribe</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscribeSubject;