import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card, notification, Row, Col } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const { Option } = Select;

const colors = [
  { name: 'Red', value: 'Red' },
  { name: 'Blue', value: 'Blue' },
  { name: 'Green', value: 'Green' },
];

const EpicComponent = () => {
  const { id } = useParams(); // Get epic ID from URL if present
  const [form] = Form.useForm();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationApi, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const isEditMode = !!id;

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/owners');
        setOwners(response.data);
      } catch (error) {
        console.error('Error fetching owners:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch owners. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchEpic = async () => {
      try {
        const response = await axios.get(`http://localhost:5002/api/epics/${id}`);
        form.setFieldsValue(response.data); // Pre-fill form with existing epic data
      } catch (error) {
        console.error('Error fetching epic:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch epic details. Please try again later.',
        });
      }
    };

    fetchOwners();

    if (isEditMode) {
      fetchEpic();
    } else {
      setLoading(false);
    }
  }, [id, form, isEditMode]);

  const onFinish = async (values) => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5002/api/epics/${id}`, values);
        notificationApi.success({
          message: 'Epic Updated',
          description: 'Epic has been updated successfully!',
        });

        setTimeout(() => {
          navigate('/tree');
        }, 1500); // Delay to allow the notification to be seen
      } else {
        const response = await axios.post('http://localhost:5002/api/epics', values);
        notificationApi.success({
          message: 'Epic Saved',
          description: 'Epic has been saved successfully!',
        });
        form.resetFields(); // Reset form fields after successful submission
        navigate(`/story/${response.data._id}`, {
          state: {
            epicId: response.data._id,
          },
        });
      }
    } catch (error) {
      console.error('There was an error saving the epic!', error);
      notificationApi.error({
        message: 'Error',
        description: 'There was an error saving the epic.',
      });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {contextHolder} {/* Make sure this is included */}
      <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>
        {isEditMode ? 'Edit Epic' : 'Create Epic'}
      </h2>
      <Card
        hoverable
        style={{ transition: 'transform 0.1s ease-in-out', border: '1px solid #ddd' }}
      >
        <div style={{ padding: '20px' }}>
          <Form
            form={form}
            layout="vertical"
            name="epicForm"
            onFinish={onFinish}
          >
            <Form.Item
              label="Epic Name"
              name="epicName"
              rules={[{ required: true, message: 'Please input the epic name!' }]}
            >
              <Input placeholder="Enter Epic Name" />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please input the description!' }]}
            >
              <Input.TextArea rows={4} placeholder="Enter Description" style={{ resize: 'none' }} />
            </Form.Item>

            <Form.Item
              label="Owner"
              name="owner"
              rules={[{ required: true, message: 'Please select an owner!' }]}
            >
              <Select
                placeholder="Select Owner"
                loading={loading}
                disabled={loading}
              >
                <Option value="" disabled>
                  Select Owner
                </Option>
                {owners.map((owner) => (
                  <Option key={owner._id} value={owner._id}>
                    {owner.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Color"
              name="color"
              rules={[{ required: true, message: 'Please select a color!' }]}
            >
              <Select placeholder="Select a color">
                {colors.map((color) => (
                  <Option key={color.value} value={color.value}>
                    {color.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Row gutter={16}>
                <Col span={24}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ backgroundColor: '#1890ff', borderColor: '#1890ff', width: '100%' }}
                  >
                    {isEditMode ? 'Update Epic' : 'Submit'}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default EpicComponent;
