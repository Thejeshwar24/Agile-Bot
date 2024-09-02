import { useState, useEffect } from 'react';
import axios from 'axios';
import { Collapse, Spin, } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';


const UserAssignmentsPage = () => {
  const [userName, setUserName] = useState('');
  const [assignedUser, setAssignedUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const storiesResponse = await axios.get('http://localhost:5002/api/stories');
        const tasksResponse = await axios.get('http://localhost:5002/api/tasks');
        setStories(storiesResponse.data);
        setTasks(tasksResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error fetching data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCheckAssignments = async () => {
    if (!userName.trim()) {
      setMessage('Please enter a valid name.');
      return;
    }

    try {
      setLoading(true);
      const usersResponse = await axios.get('http://localhost:5002/api/users');
      const matchedUser = usersResponse.data.find(user => user.name.toLowerCase() === userName.toLowerCase());

      if (matchedUser) {
        setAssignedUser(matchedUser);

        const userStories = stories.filter(story => story.assignedUser === matchedUser.name);
        const userTasks = tasks.filter(task => task.assignedUser === matchedUser.name);

        if (userStories.length > 0 || userTasks.length > 0) {
          setMessage('');
        } else {
          setMessage('No stories or tasks assigned to you.');
        }
      } else {
        setAssignedUser(null);
        setMessage('No user found with this name.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Error fetching data. Please try again.');
      setLoading(false);
    }
  };

  const storyItems = stories
    .filter(story => story.assignedUser === assignedUser?.name)
    .map(story => ({
      key: story._id,
      label: story.storyName,
      children: (
        <div>
          <p>{story.description}</p>
          <h4 className="font-bold text-lg mt-4">Tasks:</h4>
          {tasks.filter(task => task.storyId === story._id).length === 0 ? (
            <p>No tasks assigned to this story.</p>
          ) : (
            tasks
              .filter(task => task.storyId === story._id)
              .map((task, index) => (
                <div key={task._id} className="bg-green-50 p-3 rounded mb-2">
                  <h4 className="font-semibold">Task {index + 1}: {task.taskName}</h4>
                  <p>{task.description}</p>
                </div>
              ))
          )}
        </div>
      ),
    }));

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Check Assignments</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
          Enter Name
        </label>
        <input
          type="text"
          id="userName"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          onClick={handleCheckAssignments}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Assignments'}
        </button>
      </div>

      {loading ? (
        <Spin tip="Loading assignments...">
          <div style={{ minHeight: '200px' }}>
            {/* Empty div to provide some height for the spinner */}
          </div>
        </Spin>
      ) : (
        <>
          {message && (
            <div className="bg-yellow-500 text-white p-3 rounded mb-4 shadow-lg">
              {message}
            </div>
          )}

          {assignedUser && (
            <div className="bg-white shadow-md rounded p-6">
              <h2 className="text-2xl font-bold mb-4">Assignments for {assignedUser.name}</h2>
              <Collapse
                accordion
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                bordered={false}
                items={storyItems}
              />
              {stories.filter(story => story.assignedUser === assignedUser.name).length === 0 && (
                <p>No stories assigned.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserAssignmentsPage;
