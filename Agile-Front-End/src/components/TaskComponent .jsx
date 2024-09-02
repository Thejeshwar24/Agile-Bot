import { useState, useEffect, useMemo } from 'react';
import { Card, Form, Input, Select, Button, Steps, List, Typography, notification } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const { Step } = Steps;
const { Option } = Select;
const { Text } = Typography;

const TaskComponent = () => {
  const { storyId, id: taskId } = useParams(); // Get Story ID from URL and Task ID if in edit mode
  const location = useLocation(); // Access location for additional state
  const [currentStep, setCurrentStep] = useState(0);
  const [userGroups, setUserGroups] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [tasks, setTasks] = useState([]); // State to store created tasks
  const [loading, setLoading] = useState(true);
  const [isEditMode] = useState(!!taskId); // Determine if we're in edit mode
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
          const taskResponse = await axios.get(`http://localhost:5002/api/tasks/${taskId}`);
          const taskData = taskResponse.data;
  
          // Check if storyId is an object, then extract the string ID
          if (taskData.storyId && typeof taskData.storyId === 'object') {
            taskData.storyId = taskData.storyId._id || ''; // Get the string ID from the story object
          }
  
          formik.setValues(taskData); // Pre-fill form with existing task data
        }
      } catch (error) {
        console.error('Failed to load data', error);
        notification.error({
          message: 'Error',
          description: 'Failed to load data. Please try again later.',
          placement: 'topRight',
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [taskId, isEditMode]);

  const validationSchema = Yup.object({
    taskName: Yup.string().required('Task Name is required'),
    description: Yup.string().required('Description is required'),
    storyId: Yup.string().required('Story ID is required'),
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
      taskName: '',
      description: '',
      storyId: storyId || location.state?.storyId?._id || '',
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
          await axios.put(`http://localhost:5002/api/tasks/${taskId}`, values);
          notification.success({
            message: 'Task Updated',
            description: 'Your task has been updated successfully.',
            placement: 'topRight',
          });
          navigate('/tree'); // Navigate back to tree view after updating
        } else {
          const response = await axios.post('http://localhost:5002/api/tasks', values);
          setTasks([...tasks, response.data]); // Add the new task to the list
          notification.success({
            message: 'Task Created',
            description: 'Your task has been created successfully.',
            placement: 'topRight',
          });
          resetForm({ values: { ...formik.initialValues, storyId: storyId || location.state?.storyId?._id || '' } }); // Reset form fields and keep storyId pre-filled
          setCurrentStep(0); // Reset to the first step
        }
      } catch (error) {
        console.error('There was an error saving the task!');
        notification.error({
          message: 'Error',
          description: 'There was an error saving the task. Please try again.',
          placement: 'topRight',
        });
      }
    },
  });

  const next = async () => {
    const errors = await formik.validateForm();
    if (
      (currentStep === 0 && (errors.taskName || errors.storyId || errors.description)) ||
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
          <Form.Item label="Task Name" required className="mt-12">
            <Input
              placeholder="Enter Task Name"
              {...formik.getFieldProps('taskName')}
            />
            {formik.touched.taskName && formik.errors.taskName && (
              <div className="text-red-500 text-xs">{formik.errors.taskName}</div>
            )}
          </Form.Item>
          <Form.Item label="Story ID" required>
            <Input
              placeholder="Story ID"
              {...formik.getFieldProps('storyId')}
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
        {isEditMode ? 'Edit Task' : 'Create Task'}
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
              {isEditMode ? 'Update Task' : 'Submit Task'}
            </Button>
          )}
        </div>
      </Form>

      {/* Display created tasks */}
      {!isEditMode && tasks.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 className="text-xl font-bold mb-4">Created Tasks:</h3>
          <List
            itemLayout="horizontal"
            dataSource={tasks}
            renderItem={task => (
              <List.Item
                actions={[
                  <Button
                    key="viewTree"
                    type="link"
                    onClick={() => navigate('/tree')}
                  >
                    View Tree
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={<Text strong>{task.taskName}</Text>}
                  description={task.description}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default TaskComponent;
