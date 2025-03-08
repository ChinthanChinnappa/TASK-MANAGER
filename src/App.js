import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AssignerList from './components/assigners/AssignerList';
import TaskList from './components/tasks/TaskList';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assigners" element={<AssignerList />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/stats" element={<Statistics />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 