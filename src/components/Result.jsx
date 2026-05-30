/* eslint-disable */
import { useSelector } from 'react-redux'

export default function Result() {

    const { questions, selectedAnswers } = useSelector(state => state.quizze)

    // Calculate correct answers count
    const correctCount = questions.reduce((count, q, index) => {
        return parseInt(q['Answer']) === parseInt(selectedAnswers[index]) ? count + 1 : count
    }, 0)

    // Get correct answer text for each question
    const getCorrectAnswer = (question, answerIndex) => {
        return question['Options'][parseInt(answerIndex) - 1] || 'N/A'
    }

    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header with Score Card */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">Quiz Results</h1>

                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-lg font-semibold opacity-90">Your Score</p>
                                <p className="text-5xl font-bold mt-2">{correctCount} / {questions.length}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-6xl font-bold">{percentage}%</p>
                                <p className="text-lg font-semibold opacity-90 mt-2">
                                    {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good!' : 'Keep Learning'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Question</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Your Answer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Correct Answer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Explanation</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                questions.map((q, index) => {
                                    const isCorrect = parseInt(q['Answer']) === parseInt(selectedAnswers[index])
                                    const userAnswerText = selectedAnswers[index] ? q['Options'][parseInt(selectedAnswers[index]) - 1] : 'Not answered'
                                    const correctAnswerText = getCorrectAnswer(q, q['Answer'])

                                    return (
                                        <tr
                                            key={index}
                                            className={`border-b border-gray-200 transition-colors ${
                                                isCorrect ? 'bg-green-50 hover:bg-green-100' : 'bg-red-50 hover:bg-red-100'
                                            }`}
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                                {q['Question']}
                                            </td>
                                            <td className={`px-6 py-4 text-sm ${
                                                isCorrect ? 'text-green-700 font-semibold' : 'text-red-700'
                                            }`}>
                                                {userAnswerText}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-green-700">
                                                {correctAnswerText}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 italic">
                                                {q['Explanation']}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                                    isCorrect
                                                        ? 'bg-green-200 text-green-800'
                                                        : 'bg-red-200 text-red-800'
                                                }`}>
                                                    {isCorrect ? '✓ Correct' : '✗ Wrong'}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}