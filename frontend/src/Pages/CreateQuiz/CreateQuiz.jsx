import { useParams } from "react-router-dom";

const CreateQuiz = () => {
    const { id } = useParams()
    return (
        <>Create Quiz: {id}</>
    );
}

export default CreateQuiz;