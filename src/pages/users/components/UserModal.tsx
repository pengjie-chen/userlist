
import { Modal, Form, Input,message, DatePicker,Switch  } from "antd"
import moment from "moment";
import { format } from "prettier";
import { FC, useEffect } from "react";
import users from "..";
import { FormValues, SingleUserType } from "../data";

interface UserModalProps {
    visible: boolean
    record: SingleUserType | undefined
    closeHandler: () => void
    onFinish: (values: FormValues) => void
    confirmLoading: boolean
}

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
  };

const UserModal: FC<UserModalProps> = (props) => {


    const [form] = Form.useForm()
    const { visible, record, closeHandler, onFinish,confirmLoading } = props
    const onOk = () => {
        form.submit()
    }
    const onFinishFailed = (errorInfo: any) => {
        message.error(errorInfo.errorFields[0].errors[0])
    };

    useEffect(() => {
        if (record === undefined) {
            form.resetFields();
        } else {
            form.setFieldsValue({
                ...record,
                create_time: moment(record.create_time),
                status: (record.status===1? true:false)
                }
            );

        }
    }, [props.visible])

    return (
        <div>
            <Modal title={record?'edit ID:'+record.id :'add user'}
                visible={visible}
                onOk={onOk}
                onCancel={closeHandler}
                forceRender
                confirmLoading={confirmLoading}
            >
                <Form
                    name="basic"
                    {...layout}
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        status: true
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Create time"
                        name="create_time"
                    >
                        <DatePicker
                            showTime
                           
                        />
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        valuePropName='checked'
                    >
                        <Switch checked/>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}

export default UserModal