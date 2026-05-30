/* eslint-disable */
import { selectedAnswer } from '../slices/QuizzeSlice'
import { useDispatch, useSelector } from 'react-redux'

export default function Question({ question }) {
  const dispatch = useDispatch()
  const { questionIndex, selectedAnswers } = useSelector(state => state.quizze)
  const choseAnswer = useSelector(state => state.quizze.selectedAnswers[questionIndex]);

  function sample(e){
    const answerValue = parseInt(e.target.value)
    console.log(answerValue)
    console.log(selectedAnswers)
    dispatch(selectedAnswer({currQstIndex: questionIndex, answerIndex: answerValue}))
  }

  return (
    <div className="p-6 mt-8">
      <span className="text-cyan-500 font-semibold text-2xl">{question.Question}</span>
      {question.Options.map((option, index) => (
        <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
          <input
            type="radio"
            id={`option-${index+1}`}
            name={`question-${question.id}`}
            value={index+1}
            checked={choseAnswer === index+1}
            className="w-4 h-4 cursor-pointer"
            onChange={(e) => sample(e)}
          />
          <label htmlFor={`option-${index+1}`} className="flex-1 cursor-pointer text-gray-800">
            {option}
          </label>
        </div>
      ))}
    </div>
  )
}