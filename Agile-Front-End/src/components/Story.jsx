import { useState, useEffect, useMemo } from 'react';
import { Card, Form, Input, Select, Button, Steps, List, Typography, notification } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const { Step } = Steps;
const { Option } = Select;
const { Text } = Typography;

const StoryComponent = () => {
  const { epicId, id } = useParams(); // Get Epic ID from URL and Story ID if in edit mode
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState([]); // State to store created stories
  const [isEditMode] = useState(!!id); // Determine if we're in edit mode
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userGroupsResponse = await axios.get('http://localhost:5002/api/userGroups');
        const usersResponse = await axios.get('http://localhost:5002/api/users');
        setUserGroups(userGroupsResponse.data);
        setAssignedUsers(usersResponse.data);

        if (isEditMode) {
          const storyResponse = await axios.get(`http://localhost:5002/api/stories/${id}`);
          const storyData = storyResponse.data;

          // Ensure epicId is a string ID
          storyData.epicId = storyData.epicId._id || storyData.epicId;
          formik.setValues(storyData); // Pre-fill form with existing story data
        }
      } catch (error) {
        console.error('Failed to load data');
        notification.error({
          message: 'Error',
          description: 'Failed to load data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const validationSchema = Yup.object({
    storyName: Yup.string().required('Story Name is required'),
    description: Yup.string().required('Description is required'),
    epicId: Yup.string().required('Epic ID is required'),
    userGroup: Yup.string().required('User Group is required'),
    assignedUser: Yup.string().required('Assigned User is required'),
    priority: Yup.string().required('Priority is required'),
    duration: Yup.number()
      .min(1, 'Duration must be at least 1 day')
      .max(25, 'Duration cannot exceed 25 days')
      .required('Duration is required'),
    estimationPoints: Yup.number().required('Estimation Points are required'),
    startDate: Yup.date()
      .min(today, 'Start Date cannot be in the past')
      .required('Start Date is required'),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), 'End Date must be at least one day after Start Date')
      .test('endDateAfterStartDate', 'End Date cannot be the same as Start Date', function (value) {
        const { startDate } = this.parent;
        return value > startDate;
      })
      .required('End Date is required'),
  });

  const formik = useFormik({
    initialValues: {
      storyName: '',
      description: '',
      epicId: epicId || location.state?.epicId || '',
      userGroup: '',
      assignedUser: '',
      priority: '',
      duration: '',
      estimationPoints: '',
      startDate: '',
      endDate: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isEditMode) {
          await axios.put(`http://localhost:5002/api/stories/${id}`, values);
          notification.success({
            message: 'Story Updated',
            description: 'Your story has been updated successfully.',
            placement: 'topRight',
          });
        } else {
          const response = await axios.post('http://localhost:5002/api/stories', values);
          setStories([...stories, response.data]); // Add the new story to the list
          notification.success({
            message: 'Story Created',
            description: 'Your story has been created successfully.',
            placement: 'topRight',
          });

          // Reset form fields to allow the user to create another story
          resetForm({ values: { ...formik.initialValues, epicId: epicId || location.state?.epicId || '' } });
          setCurrentStep(0); // Reset to the first step (Basic Info)
        }
      } catch (error) {
        console.error('There was an error saving the story!');
        notification.error({
          message: 'Error',
          description: 'There was an error saving the story. Please try again.',
          placement: 'topRight',
        });
      }
    },
  });

  const next = async () => {
    const errors = await formik.validateForm();
    if (
      (currentStep === 0 && (errors.storyName || errors.epicId || errors.description)) ||
      (currentStep === 1 && (errors.userGroup || errors.assignedUser || errors.priority)) ||
      (currentStep === 2 && (errors.startDate || errors.endDate || errors.duration || errors.estimationPoints))
    ) {
      notification.warning({
        message: 'Warning',
        description: 'Please fill all required fields in the current step.',
        placement: 'topRight',
      });
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = useMemo(() => [
    {
      title: 'Basic Info',
      content: (
        <>
          <Form.Item label="Story Name" required className="mt-12">
            <Input
              placeholder="Enter Story Name"
              {...formik.getFieldProps('storyName')}
            />
            {formik.touched.storyName && formik.errors.storyName && (
              <div className="text-red-500 text-xs">{formik.errors.storyName}</div>
            )}
          </Form.Item>
          <Form.Item label="Epic ID" required>
            <Input
              placeholder="Epic ID"
              {...formik.getFieldProps('epicId')}
              disabled
            />
          </Form.Item>
          <Form.Item label="Description" required>
            <Input.TextArea
              placeholder="Enter Description"
              {...formik.getFieldProps('description')}
            />
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-xs">{formik.errors.description}</div>
            )}
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Details',
      content: (
        <>
          <Form.Item label="User Group" required className="mt-12">
            <Select
              placeholder="Select User Group"
              value={formik.values.userGroup || undefined}
              onChange={(value) => formik.setFieldValue('userGroup', value)}
              loading={loading}
            >
              {userGroups.length === 0 ? (
                <Option value="" disabled>
                  No User Groups Available
                </Option>
              ) : (
                userGroups.map((group) => (
                  <Option key={group._id} value={group.name}>
                    {group.name}
                  </Option>
                ))
              )}
            </Select>
            {formik.touched.userGroup && formik.errors.userGroup && (
              <div className="text-red-500 text-xs">{formik.errors.userGroup}</div>
            )}
          </Form.Item>

          <Form.Item label="Assigned User" required>
            <Select
              placeholder="Select Assigned User"
              value={formik.values.assignedUser || undefined}
              onChange={(value) => formik.setFieldValue('assignedUser', value)}
              loading={loading}
            >
              {assignedUsers.length === 0 ? (
                <Option value="" disabled>
                  No Users Available
                </Option>
              ) : (
                assignedUsers.map((user) => (
                  <Option key={user._id} value={user.name}>
                    {user.name}
                  </Option>
                ))
              )}
            </Select>
            {formik.touched.assignedUser && formik.errors.assignedUser && (
              <div className="text-red-500 text-xs">{formik.errors.assignedUser}</div>
            )}
          </Form.Item>

          <Form.Item label="Priority" required>
            <Select
              placeholder="Select Priority"
              value={formik.values.priority || undefined}
              onChange={(value) => formik.setFieldValue('priority', value)}
            >
              <Option value="" disabled>
                Select Priority
              </Option>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
            {formik.touched.priority && formik.errors.priority && (
              <div className="text-red-500 text-xs">{formik.errors.priority}</div>
            )}
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Dates & Estimates',
      content: (
        <>
          <Form.Item label="Duration" required className="mt-12">
            <Input
              type="number"
              placeholder="Enter Duration"
              min="0"
              {...formik.getFieldProps('duration')}
            />
            {formik.touched.duration && formik.errors.duration && (
              <div className="text-red-500 text-xs">{formik.errors.duration}</div>
            )}
          </Form.Item>
          <Form.Item label="Estimation Points" required>
            <Input
              type="number"
              placeholder="Enter Estimation Points"
              min="0"
              {...formik.getFieldProps('estimationPoints')}
            />
            {formik.touched.estimationPoints && formik.errors.estimationPoints && (
              <div className="text-red-500 text-xs">{formik.errors.estimationPoints}</div>
            )}
          </Form.Item>
          <Form.Item label="Start Date" required>
            <Input
              type="date"
              placeholder="Enter Start Date"
              {...formik.getFieldProps('startDate')}
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-500 text-xs">{formik.errors.startDate}</div>
            )}
          </Form.Item>
          <Form.Item label="End Date" required>
            <Input
              type="date"
              placeholder="Enter End Date"
              {...formik.getFieldProps('endDate')}
            />
            {formik.touched.endDate && formik.errors.endDate && (
              <div className="text-red-500 text-xs">{formik.errors.endDate}</div>
            )}
          </Form.Item>
        </>
      ),
    },
  ], [formik, userGroups, assignedUsers, loading]);

  return (
    <Card hoverable style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {isEditMode ? 'Edit Story' : 'Create Story'}
      </h2>
      <Steps current={currentStep}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        {steps[currentStep].content}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {currentStep > 0 && (
            <Button type="default" onClick={prev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" htmlType="submit" disabled={loading || !formik.isValid}>
              {isEditMode ? 'Update Story' : 'Submit'}
            </Button>
          )}
        </div>
      </Form>

      {/* Display created stories */}
      {!isEditMode && stories.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 className="text-xl font-bold mb-4">Created Stories:</h3>
          <List
            itemLayout="horizontal"
            dataSource={stories}
            renderItem={story => (
              <List.Item
                actions={[
                  <Button
                    key="tasks"
                    type="link"
                    onClick={() => navigate(`/task/${story._id}`, {
                      state: { storyId: story._id },
                    })}
                  >
                    Go to Tasks
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{story.storyName}</Text>}
                  description={story.description}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default StoryComponent;
