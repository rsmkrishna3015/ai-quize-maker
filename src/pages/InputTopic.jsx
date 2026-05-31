import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { setTopic, fetchQuestions } from '../slices/QuizzeSlice'

export default function InputTopic() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const[inputValue, setInputValue] = useState('')

    const handleSubmit = () => {
        dispatch(setTopic(inputValue))
        dispatch(fetchQuestions(inputValue))
        navigate('/quizze')
    }

    const isTopicEntered = inputValue.length > 3 && inputValue.trim() !== ''

    return (
        <>
            <div className="p-[10rem] h-screen w-screen flex flex-col items-center ">
                <input 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter quiz topic"
                    className="mb-5 p-7 h-[3rem] w-[20rem] border border-blue-500 rounded-2xl hover:ring-4"
                />
                <button onClick={handleSubmit}
                 className=" active:scale-90 bg-blue-500 disabled:bg-gray-200 disabled:ring-1 disabled:ring-gray-700 disabled:rounded-none px-6 py-2 border border-blue-500 h-[2.5rem] w-fit flex items-center justify-center rounded-xl"
                disabled={!isTopicEntered}>Start Quiz</button>
            </div>
        </>
    )
}