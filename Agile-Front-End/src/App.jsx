// import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import EpicComponent from './components/Epics';
import StoryComponent from './components/Story';
import TaskComponent from './components/TaskComponent ';
import UserAssignmentsPage from './components/UserAssignmentsPage';
import TreeViewComponent from './components/TreeViewComponent';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <Navigation/>

        <div className="p-4">
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/epic" element={<EpicComponent />} />
            <Route path="/epic/edit/:id" element={<EpicComponent />} />
            <Route path="/story/:epicId" element={<StoryComponent />} />
            <Route path="/add-story" element={<StoryComponent />} />
            <Route path="/story/edit/:id" element={<StoryComponent />} />
            <Route path="/task/:storyId" element={<TaskComponent />} />
            <Route path="/task/edit/:id" element={<TaskComponent />} />
            <Route path="/assignments" element={<UserAssignmentsPage />} />
            <Route path="/tree" element={<TreeViewComponent />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
