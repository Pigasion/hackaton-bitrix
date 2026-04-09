// src/features/Chat/components/ForwardMessageModal.tsx
import { Modal, Form, Select, Input, Space } from 'antd';
import { CalculatorOutlined, CarOutlined, ToolOutlined, TeamOutlined } from '@ant-design/icons';
import { AppButton } from '@/components/UI';
import { useChatStore } from '@/store/useChatStore';
import { useInternalChatStore } from '@/store/useInternalChatStore';

const { TextArea } = Input;

const departments = [
  { value: 'economist', label: 'Экономисты', icon: <CalculatorOutlined /> },
  { value: 'logistics', label: 'Логистика', icon: <CarOutlined /> },
  { value: 'production', label: 'Производство', icon: <ToolOutlined /> },
  { value: 'all', label: 'Общий чат', icon: <TeamOutlined /> },
];

export const ForwardMessageModal: React.FC = () => {
  const [form] = Form.useForm();
  const { isForwardModalOpen, closeForwardModal, selectedMessageId, sourceChatId, messages } = useChatStore();
  const { addMessage: addInternalMessage } = useInternalChatStore();

  const handleSubmit = async (values: any) => {
    if (!selectedMessageId || !sourceChatId) {
      console.error('No message selected');
      return;
    }

    try {
      // Получаем оригинальное сообщение из store
      const sourceMessages = messages[sourceChatId] || [];
      const originalMessage = sourceMessages.find(m => m.id === selectedMessageId);

      if (!originalMessage) {
        console.error('Original message not found');
        return;
      }

      // Создаём сообщение для технического чата
      const internalMessage = {
        id: `internal_${Date.now()}`,
        department: values.department as string,
        author: 'Менеджер',
        authorAvatar: 'М',
        text: values.comment
          ? `${values.comment}\n\n---\nПереслано от клиента:\n${originalMessage.text || ''}`
          : `---\nПереслано от клиента:\n${originalMessage.text || ''}`,
        timestamp: new Date().toISOString(),
        isForwarded: true,
        forwardedFrom: {
          clientId: sourceChatId,
          clientName: 'Клиент',
          originalMessageId: selectedMessageId,
        },
      };

      // Добавляем в технический чат
      addInternalMessage(values.department, internalMessage);

      // Закрываем модалку
      closeForwardModal();
      form.resetFields();

    } catch (error) {
      console.error('Failed to forward message:', error);
    }
  };

  return (
    <Modal
      title="↪ Переслать сообщение"
      open={isForwardModalOpen}
      onCancel={closeForwardModal}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Куда переслать"
          name="department"
          rules={[{ required: true, message: 'Выберите отдел' }]}
        >
          <Select
            placeholder="Выберите отдел"
            size="large"
            options={departments.map((dept) => ({
              value: dept.value,
              label: (
                <Space>
                  {dept.icon}
                  {dept.label}
                </Space>
              ),
            }))}
          />
        </Form.Item>

        <Form.Item label="Комментарий (необязательно)" name="comment">
          <TextArea
            rows={3}
            placeholder="Добавьте комментарий для коллег..."
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <AppButton type="default" onClick={closeForwardModal}>
              Отмена
            </AppButton>
            <AppButton type="primary" htmlType="submit">
              Переслать
            </AppButton>
          </Space>
        </Form.Item>
      </Form>

      <div style={{ marginTop: '16px', padding: '12px', background: '#f0f8ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>
          ℹ️ Сообщение будет отправлено в выбранный технический чат с пометкой о пересылке
        </div>
      </div>
    </Modal>
  );
};