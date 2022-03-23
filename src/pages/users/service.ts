import request, { extend } from 'umi-request';
import { message } from 'antd'
import { FormValues } from './data';

const errorHandler = function (error: any) {
    if (error.response) {
        // 请求已发送但服务端返回状态码非 2xx 的响应
        if (error.response.status > 400) {
            message.error(error.data.message ? error.data.message : error.data)
        }
    } else {
        // 请求初始化时出错或者没有响应返回的异常
        message.error('服务器打盹了～')
    }
    throw error;
}

const extendRequest = extend({ errorHandler });

export const getRemoteList = async({page,per_page}:{page:number,per_page:number}) => {
    console.log('getRemote service')
    return extendRequest(`/api/users?page=${page}&per_page=${per_page}`,{
        method: 'get',
    })
        .then(function (response) {
            console.log('get success...')
            return response
        })
        .catch(function (error) {
            return false
        });
}

export const editRecord = async ({ id, values }: { id: number, values: FormValues }) => {
    return extendRequest(`/api/users/${id}`, {
        method: 'put',
        data: values
    })
        .then(function (response) {
            return true
        })
        .catch(function (error) {
            return false
        });
}

export const deleteUser = async ({ id }: { id: number }) => {
    return extendRequest(`/api/users/${id}`, {
        method: 'delete',
    })
        .then(function (response) {
            return true
        })
        .catch(function (error) {
            return false
        });
}

export const addUser = async ({ values }: { values: FormValues }) => {
    return extendRequest('/api/users', {
        method: 'post',
        data: values
    })
        .then(function (response) {
            return true
        })
        .catch(function (error) {
            return false
        });
}