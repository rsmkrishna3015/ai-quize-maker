import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="w-[20rem] py-4 bg-gradient-to-b from-slate-900 to-slate-100 shadow-lg flex flex-col">
      <nav className="flex-1 px-4">
        <Link
          to="/quizze"
          className="flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors duration-200 hover:ring-red-500 hover:ring-1"
        >
          <span className="font-medium">Quizze</span>
        </Link>
      </nav>

    </div>
  )
}

export default Sidebar
