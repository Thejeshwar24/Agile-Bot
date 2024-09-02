import { useState, useEffect } from 'react';
import { Table, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const StoryTableComponent = () => {
  const { epicId } = useParams();
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch stories for the current epic
    axios.get(`http://localhost:5002/api/epics/${epicId}/stories`)
      .then(response => setStories(response.data))
      .catch(error => {
        console.error('Error fetching stories:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to load stories.',
        });
      });
  }, [epicId]);

  const columns = [
    {
      title: 'Story ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Story Name',
      dataIndex: 'storyName',
      key: 'storyName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => navigate(`/story/edit/${record._id}`)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="default"
            onClick={() => navigate(`/task/${record._id}`, {
              state: {
                userGroup: record.userGroup,
                priority: record.priority,
              },
            })}
          >
            Go to Task
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2 className="text-2xl font-bold mb-6">Stories</h2>
      <Table
        columns={columns}
        dataSource={stories}
        rowKey="_id"
        bordered
      />
    </div>
  );
};

export default StoryTableComponent;
