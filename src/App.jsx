import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Quizze from './pages/Quizze'
import InputTopic from './pages/InputTopic'

function App() {
  
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to='home' />} />
          <Route path="home" element={<Home />} />
          <Route path="topicInput" element={<InputTopic />} />
          <Route path="quizze" element={<Quizze key="quizze" />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
