import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchQuestions, nextQuestion, submitQuiz, reset } from '../slices/QuizzeSlice'
import { useDispatch, useSelector } from 'react-redux'
import Question from '../components/Question'
import Result from '../components/Result'

export default function Quizze () {

    const dispatch = useDispatch()
    const location = useLocation()
    const { questions, loading, questionIndex, completed, isQuestionAnswered } = useSelector(state => state.quizze)

    const buttonLabel =  loading === false &&  questionIndex < questions.length -1 ? 'Next' : 'submit'

    useEffect(() => {
        dispatch(reset())
        dispatch(fetchQuestions())
    }, [location.pathname, dispatch])

    return (
        <>
            <div className='flex flex-col w-full overflow-y-auto'>
                <div className='w-full h-[6rem] font-extrabold text-center mt-6 text-5xl'> Quizze </div>
                {
                    loading === true && <div className='w-full h-14 font-extrabold mt-6 text-5xl'>LOADING...</div>
                }
                {
                loading === false && completed === false && questions.length > 0
                && (
                        <>
                            <div className='flex flex-col '>
                                <span className="ml-auto mr-20 w-fit p-1 font-bold border border-cyan-700">
                                    Question {questionIndex + 1} of {questions.length}
                                </span>
                                <Question question={questions[questionIndex]} />
                                <button 
                                onClick={() => buttonLabel === 'Next' ? 
                                        dispatch(nextQuestion(1)) : dispatch(submitQuiz())}
                                disabled={!isQuestionAnswered}
                                className=" self-end mr-20 w-fit px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {buttonLabel}
                                </button>
                            </div>
                        </>
                    )

                }
                {
                    loading === false && completed === true && <Result />
                }
            </div>
        </>
    )
}