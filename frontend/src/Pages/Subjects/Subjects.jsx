import moment from "moment";
import { useState } from "react";
import { baseUrl, postRequest } from "../../utils/services";
const Subjects = () => {
    const [subjectData, setSubjectData] = useState({
        name: "",
        year: "",
        semester: "",
        backgroundImage: ""
    })

    const changeSubjectProperties = (e) => {
        setSubjectData({ ...subjectData, [e.target.name]: e.target.value });
        console.log(subjectData);
    }

    const handleSubmit = (e) => {
        //e.preventDefault();
        console.log("Submit");
        const response = postRequest(`${baseUrl}/subjects`, JSON.stringify(
            {
                name: subjectData.name,
                year: subjectData.year,
                semester: subjectData.semester,
                backgroundImage: subjectData.backgroundImage
            }
        ))
    }

    console.log(subjectData);
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
            {/* <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-body custom-list overflow-auto" style={{ maxHeight: "60vw" }}>
                            {
                                subjects.map((subject) => (
                                    <div className="container">
                                        <div className="card m-3">
                                            <div className="row">
                                                <div className="col-md-4" style={{ backgroundImage: "url(" + subject?.backgroundImage + ")", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}>
                                                </div>

                                                <div className="col-md-6">
                                                    <h2 className="mb-3">{subject?.name}</h2>
                                                    <p>
                                                        <i>Created at: {moment(subject.createdAt).calendar()}</i>
                                                    </p>
                                                </div>

                                                <div className="col-md-2 d-flex align-items-center ">
                                                    <div className="mt-2 mb-2">
                                                        <button type="button" className="btn btn-primary mb-2 w-100" onClick={() => { console.log("View subject") }}>View</button>
                                                        <button type="button" className="btn btn-danger w-100" onClick={() => { console.log("Delete subject") }}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div> */}
            <br></br>
        </div>
    );
}

export default Subjects;