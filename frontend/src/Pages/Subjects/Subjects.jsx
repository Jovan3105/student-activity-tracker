import moment from "moment";
import { useEffect, useState } from "react";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../../utils/services";
import "./style.css";
import { json, useNavigate } from "react-router-dom";

const Subjects = () => {
    const [subjectData, setSubjectData] = useState({
        name: "",
        year: "",
        semester: "",
        backgroundImage: ""
    })
    const [subjects, setSubjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const navigate = useNavigate();

    const changeSubjectProperties = (e) => {
        setSubjectData({ ...subjectData, [e.target.name]: e.target.value });
        //console.log(subjectData);
    }

    const handleSubmit = (e) => {
        //e.preventDefault();
        //console.log("Submit");
        const response = postRequest(`${baseUrl}/subjects`, JSON.stringify(
            {
                name: subjectData.name,
                year: subjectData.year,
                semester: subjectData.semester,
                backgroundImage: subjectData.backgroundImage
            }
        ))
    }

    const deleteSubject = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        if (isConfirmed) {
            deleteRequest(`${baseUrl}/subjects/${id}`);
            window.location.reload(true);
        }
    }

    useEffect(() => {
        const response = getRequest(`${baseUrl}/subjects`).then((value) => {
            //console.log(value);
            setSubjects(value);
            setFilteredData(value);
        });

        if (response.error) {
            return console.log(response.error);
        }
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Filter the data based on the search term
        if (e.key === ' ' || e.key === 'Enter') {
            const filtered = subjects.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(term.toLowerCase())
                )
            );
            setFilteredData(filtered);
        }

    };

    const showSubject = (subject) => {
        sessionStorage.setItem("Subject", JSON.stringify(subject));
        navigate(`/${subject._id}/quizes`);
    }

    //console.log(subjectData);
    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="text-center">Create new subject</h4>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-5">
                                    <form onSubmit={(e) => handleSubmit(e)}>
                                        <div className="form-group">
                                            <label>Name:</label>
                                            <input type="text" className="form-control" placeholder="e.g. web programming 1" name="name" onChange={(e) => changeSubjectProperties(e)} />
                                        </div>
                                        <div className="form-group my-2">
                                            <label>Year:</label>
                                            <input type="text" className="form-control" pattern="^(19\d{2}|20\d{2})/(19\d{2}|20\d{2})$" placeholder="e.g. 2024/2025" name="year" onChange={(e) => changeSubjectProperties(e)} />
                                        </div>
                                        <div className="mb-2">
                                            <label>Semester:</label>
                                            <select className="form-select" defaultValue={'DEFAULT'} name="semester" onChange={(e) => changeSubjectProperties(e)}>
                                                <option value="DEFAULT" disabled>
                                                    Select semester
                                                </option>
                                                <option value="Winter">
                                                    Winter
                                                </option>
                                                <option value="Summer">
                                                    Summer
                                                </option>
                                            </select>
                                        </div>
                                        <button className={(subjectData?.name.length === 0 || subjectData?.year.length === 0 || subjectData?.semester.length === 0) ? "btn btn-primary btn-block my-1 w-100 disabled" : "btn btn-primary btn-block my-1 w-100 enabled"} type="submit">Submit</button>
                                    </form>

                                </div>
                                <div className="col-md-7">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4 className="text-center">Import image</h4>
                                        </div>
                                        <div className="card-body">
                                            {(subjectData?.backgroundImage.includes(".jpg")) ?
                                                <>
                                                    <div className="mx-auto" style={{ backgroundImage: "url(" + subjectData?.backgroundImage + ")", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", height: "100px" }}></div>
                                                    <br></br>
                                                </>
                                                :
                                                <div>
                                                    <p className="text-center"><b>No image yet</b></p>
                                                </div>
                                            }
                                            <input type="text" className="form-control text-center" placeholder="Enter subject image URL (only JPG format)" name="backgroundImage" onInput={(e) => changeSubjectProperties(e)} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <input type="text" className="form-control " placeholder="Press Enter to search." onChange={handleSearch} onKeyUp={handleSearch} value={searchTerm} />
                </div>
            </div>
            <br></br>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-body custom-list overflow-auto" style={{ maxHeight: "60vw" }}>
                            <div className="row g-2">
                                {
                                    subjects.length != 0 ?
                                        filteredData.map((subject) => (
                                            <div className="col-12 col-lg-4 col-xxl-3 px-3 py-3" key={subject._id} onClick={() => showSubject(subject)}>
                                                <div className="card mx-auto element">
                                                    <div className="image-container">
                                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => deleteSubject(subject._id)} width="16" height="16" fill="currentColor" className="bi bi-trash icon-delete" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                        </svg>
                                                        {
                                                            subject?.backgroundImage ?
                                                                <img src={subject?.backgroundImage} className="card-img-top img-fluid subject-image" alt="Responsive image" />
                                                                : <img src="./no-image-placeholder.jpg" className="card-img-top img-fluid subject-image" />
                                                        }
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <h5 className="mb-3">{subject?.name + " " + subject?.year}</h5>
                                                        </div>
                                                        <div className="row">
                                                            <small>
                                                                <i>Created at: {moment(subject.createdAt).calendar()}</i>
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        : <div>
                                            <p className="text-center"><b>No subjects yet.</b></p>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
        </div>
    );
}

export default Subjects;