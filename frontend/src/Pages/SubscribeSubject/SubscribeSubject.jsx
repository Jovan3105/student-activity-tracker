import { useEffect, useState } from "react";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../../utils/services";
import "./style.css";

const SubscribeSubject = () => {
    const user = JSON.parse(localStorage.getItem("User"));
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [subscribedSubjects, setSubscribedSubjects] = useState([]);
    
    const [searchTermAvailable, setSearchTermAvailable] = useState('');
    const [filteredDataAvailable, setFilteredDataAvailable] = useState([]);
    const [searchTermSubscribed, setSearchTermSubscribed] = useState('');
    const [filteredDataSubscribed, setFilteredDataSubscribed] = useState([]);

    useEffect(() => {
        const response = getRequest(`${baseUrl}/subjects/available/${user._id}`).then((value) => {
            //console.log(value);
            setAvailableSubjects(value);
            setFilteredDataAvailable(value);
        });
        if (response.error) {
            return console.log(response.error);
        }
    }, []);

    useEffect(() => {
        const response = getRequest(`${baseUrl}/subjects/subscribed/${user._id}`).then((value) => {
            //console.log(value);
            setSubscribedSubjects(value);
            setFilteredDataSubscribed(value);
        });
        if (response.error) {
            return console.log(response.error);
        }
    }, []);

    const cutText = (text) => {
        let shortText = text.substring(0, 15);

        if (text.length > 15) {
            shortText = shortText + "...";
        }
        return shortText;
    };

    const subscribeSubject = (id) => {
        const response = postRequest(`${baseUrl}/subjects/subscribe/${id}/${user._id}`).then(() => {
            window.location.reload(true);
        });
        if (response.error) {
            return console.log(response.error);
        }
    }

    const unsubscribeSubject = (id) => {
        const response = deleteRequest(`${baseUrl}/subjects/unsubscribe/${id}/${user._id}`).then(() => {
            window.location.reload(true);
        });
        if (response.error) {
            return console.log(response.error);
        }
    }

    const handleSearchAvailable = (e) => {
        const term = e.target.value;
        setSearchTermAvailable(term);

        // Filter the data based on the search term
        if (e.key === ' ' || e.key === 'Enter') {
            const filtered = availableSubjects.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(term.toLowerCase())
                )
            );
            setFilteredDataAvailable(filtered);
        }

    };

    const handleSearchSubscribed = (e) => {
        const term = e.target.value;
        setSearchTermSubscribed(term);

        // Filter the data based on the search term
        if (e.key === ' ' || e.key === 'Enter') {
            const filtered = subscribedSubjects.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(term.toLowerCase())
                )
            );
            setFilteredDataSubscribed(filtered);
        }

    };




    return (
        <div className="h-100 align-items-center justify-content-center">
            <div className="row justify-content-center">
                <div className="col-md-12 col-lg-5 col-xxl-5">
                    <input type="text" className="form-control " placeholder="Press Enter to search." onChange={handleSearchAvailable} onKeyUp={handleSearchAvailable} value={searchTermAvailable} />
                </div>
                <div className="col-md-12 col-lg-5 col-xxl-5">
                    <input type="text" className="form-control " placeholder="Press Enter to search." onChange={handleSearchSubscribed} onKeyUp={handleSearchSubscribed} value={searchTermSubscribed} />
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
                            {
                                availableSubjects.length != 0 ?
                                    filteredDataAvailable.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) }).map((subject) => (
                                        <div className="row justify-content-center mt-2" key={subject._id}>
                                            <div className="card">
                                                <div className="d-flex justify-content-between p-2">
                                                    <h5>{cutText(subject.name)} - {subject.year}</h5>
                                                    <button className="btn btn-primary flex-end" onClick={() => subscribeSubject(subject._id)}>Subscribe</button>
                                                </div>
                                            </div>
                                        </div>
                                    )) :
                                    <div>
                                        <p className="text-center"><b>No available subjects yet.</b></p>
                                    </div>
                            }

                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-5 col-xxl-5">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">My subjects</h4>
                        </div>
                        <div className="card-body custom-list overflow-auto">
                            {
                                subscribedSubjects.length != 0 ?
                                    filteredDataSubscribed.sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt) }).map((subject) => (
                                        <div className="row justify-content-center mt-2" key={subject._id}>
                                            <div className="card">
                                                <div className="d-flex justify-content-between p-2">
                                                    <h5>{cutText(subject.name)} - {subject.year}</h5>
                                                    <button className="btn btn-danger flex-end" onClick={() => unsubscribeSubject(subject._id)}>Unsubscribe</button>
                                                </div>
                                            </div>
                                        </div>
                                    )) :
                                    <div>
                                        <p className="text-center"><b>Not subscribed yet.</b></p>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubscribeSubject;