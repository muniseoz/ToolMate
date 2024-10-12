import logo from './logo.svg';
import './App.css';

import Course from './components/Course'
import Ranking from './components/ranking'

function App() {
  return (
    <div className="App">
      <Course name="CS3345" desc="Data Stuctures and Algorithms"/>
      <Ranking/>
    </div>
  );
}

export default App;
