import { useState, useEffect } from 'react';
import { Collapse, Card, Typography, Space, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileTextOutlined, FolderOutlined, FolderOpenOutlined, EditOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const TreeViewComponent = () => {
  const [data, setData] = useState({ epics: [], stories: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for handling errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const epicsResponse = await axios.get('http://localhost:5002/api/epics');
        const storiesResponse = await axios.get('http://localhost:5002/api/stories');
        const tasksResponse = await axios.get('http://localhost:5002/api/tasks');
        setData({
          epics: epicsResponse.data,
          stories: storiesResponse.data,
          tasks: tasksResponse.data,
        });
      } catch (err) {
        setError('Error fetching data. Please try again later.');
        notification.error({
          message: 'Data Fetch Error',
          description: 'Failed to fetch data. Please refresh the page or try again later.',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render tasks
  const renderTasks = (storyId) => {
    const tasks = data.tasks.filter((task) => task.storyId === storyId);
    if (tasks.length === 0) {
      return <Text>No tasks available for this story.</Text>;
    }

    return tasks.map((task) => (
      <div key={task._id} style={{ marginLeft: 24 }}>
        <Card
          title={<span><FileTextOutlined /> {task.taskName || "Unnamed Task"}</span>}
          bordered={true}
          style={{ marginBottom: 10, background: '#e6fffb', borderColor: '#87e8de' }}
          hoverable
          extra={
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/task/edit/${task._id}`)}
            >
              Edit
            </Button>
          }
        >
          <Text>{task.description || "No description available."}</Text>
          <div style={{ marginTop: 10 }}>
            <Text type="secondary">Assigned User: {task.assignedUser || "Not assigned"}</Text>
          </div>
        </Card>
      </div>
    ));
  };

  // Render stories
  const renderStories = (epicId) => {
    const stories = data.stories.filter((story) => story.epicId === epicId);
    if (stories.length === 0) {
      return <Text>No stories available for this epic.</Text>;
    }
    return stories.map((story) => ({
      key: story._id,
      label: (
        <span><FolderOutlined /> {story.storyName || "Unnamed Story"}</span>
      ),
      children: (
        <>
          <Text>{story.description || "No description available."}</Text>
          <div style={{ marginTop: 10, marginBottom:10 }}>
            <Text type="secondary">User Group: {story.userGroup || "Not assigned"}</Text>
          </div>
          {renderTasks(story._id)}
        </>
      ),
      extra: (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/story/edit/${story._id}`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/task/${story._id}`, { state: { storyId: story._id } })}
          >
            Add Task
          </Button>
        </Space>
      ),
      style: {background: '#d2f6ff'}
    }));
  };

  // Render epics with error icon if stories or tasks are missing
  const renderEpics = () => {
    if (data.epics.length === 0) {
      return <Text>No epics available.</Text>;
    }

    return data.epics.map((epic) => {
      const epicStories = data.stories.filter((story) => story.epicId === epic._id);
      const hasMissingStoriesOrTasks = epicStories.some(
        (story) => data.tasks.filter((task) => task.storyId === story._id).length === 0
      ) || epicStories.length === 0;

      return {
        key: epic._id,
        label: (
          <span>
            <FolderOpenOutlined /> {epic.epicName || "Unnamed Epic"}
            {hasMissingStoriesOrTasks && (
              <ExclamationCircleOutlined
                style={{ color: 'red', marginLeft: 8 }}
                title={epicStories.length === 0 ? 'No stories in this epic' : 'Some stories have no tasks'}
              />
            )}
          </span>
        ),
        children: <Collapse accordion items={renderStories(epic._id)} />,
        extra: (
          <Space>
            <Button
              style={{color:'black'}}
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/epic/edit/${epic._id}`)}
            >
              Edit
            </Button>
            <Button
              style={{color:'black'}}
              type="link"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/add-story`, { state: { epicId: epic._id } })}
            >
              Add Story
            </Button>
          </Space>
        ),
        style: { marginBottom: 24, background: '#8de8ff' }
      };
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Agile Management</h2>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Collapse accordion items={renderEpics()} />
      </Space>
    </div>
  );
};

export default TreeViewComponent;
