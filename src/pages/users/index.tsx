import { connect, Dispatch, Loading, UserState } from 'umi';
import { Table, Tag, Space, Modal, Popconfirm, Button, Pagination, message, DatePicker } from 'antd';
import ProTable, { ProColumns, TableDropdown } from '@ant-design/pro-table';

import { useState, FC } from 'react';
import UserModal from './components/UserModal';
import { FormValues, SingleUserType } from './data';
import { editRecord, addUser,deleteUser } from './service';

import React, { useEffect, useRef } from 'react'

interface UserListProps {
  users: UserState,
  dispatch: Dispatch,
  userListLoading: boolean
}

const UserListPage: FC<UserListProps> = ({ users, dispatch, userListLoading }) => {

  const [modalVisible, setModalVisible] = useState(false)
  const [record, setRecord] = useState(undefined)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const columns: ProColumns<SingleUserType>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      valueType: 'text',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      valueType: 'text',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Create time',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (text, record: SingleUserType) => [

        <a onClick={
          () => {
            editHandler(record)
          }
        }>Edit </a>,
        <Popconfirm
          title="Are you sure to delete this task?"
          onConfirm={confirm}
          okText="Yes"
          cancelText="No"
        >
          <a onClick={
            () => {
              deleteHandler(record)
            }
          }
          >Delete</a>
        </Popconfirm>
      ],
    },
  ];

  const deleteHandler = (record: SingleUserType) => {
    setRecord(record)
  }
  const editHandler = (record: SingleUserType) => {
    setModalVisible(true)
    setRecord(record)
  }
  const closeHandler = () => {
    setModalVisible(false)
    setRecord(undefined)
  }
  const onFinish = async (values: FormValues) => {
    setConfirmLoading(true)
    let id = 0
    if (record) {
      id = record.id
    }
    let userFC
    if (id) {
      userFC = editRecord
    } else {
      userFC = addUser
    }
    const result = await userFC({ id, values })
    if (result) {
      setModalVisible(false)
      message.success(`${id === 0 ? 'index add' : ' index edit'} success ${values.name}`)
      reloadHandler()
      setConfirmLoading(false)
    } else {
      message.error(`${id === 0 ? 'add' : 'edit'} fail`)
      setConfirmLoading(false)
    }
  }


  const confirm = async () => {
    const id = record.id
    await deleteUser({id})
    reloadHandler()
    // dispatch({
    //   type: 'users/deleteUser',
    //   payload: { id }
    // })
  }
  const addUserView = () => {
    setModalVisible(true)
  }

  const paginationHandler = (page: number, pageSize: number) => {
    console.log(pageSize, page)
    dispatch({
      type: 'users/getRemote',
      payload: {
        page,
        per_page: pageSize
      }
    })
  }
  const pageSizeHandler = (current: number, size: number) => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: current,
        per_page: size
      }
    })
  }

  const reloadHandler = () => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page
      }
    })
  }

  return (
    <div className='list-table '>
      <ProTable
        rowKey='id'
        headerTitle={'userlist'}
        columns={columns}
        dataSource={users.data}
        search={false}
        pagination={false}
        loading={userListLoading}
        options={{
          fullScreen: false,
          reload: () => {
            console.log('reload')
            reloadHandler();
          },
          setting: false,
          density: false
        }}
        toolBarRender={() => [
          <Button type='primary' onClick={addUserView}>Add</Button>,
          <Button onClick={reloadHandler}>Reload</Button>
        ]}
      />
      <Pagination
        className='list-page'
        total={users.meta.total}
        current={users.meta.page}
        pageSize={users.meta.per_page}
        showSizeChanger
        showQuickJumper
        showTotal={total => `Total ${total} items`}
        onChange={paginationHandler}
        onShowSizeChange={pageSizeHandler}
      />
      <UserModal
        visible={modalVisible}
        closeHandler={closeHandler}
        record={record}
        confirmLoading={confirmLoading}
        onFinish={onFinish}
      ></UserModal>
    </div>
  );
};

const mapStateToProps = ({
  users,
  loading }: {
    users: UserState
    loading: Loading
  }) => {
  return {
    users,
    userListLoading: loading.models.users
  }
}

export default connect(mapStateToProps)(UserListPage)
