import { Subscription, Reducer, Effect } from 'umi';
import { getRemoteList, editRecord, deleteUser, addUser } from './service'
import { message } from 'antd'
import { SingleUserType } from './data';

export interface UserState {
    data: SingleUserType[],
    meta: {
        total: number,
        per_page: number,
        page: number
    }
}

interface UserModalType {
    namespace: 'users',
    state: UserState ,
    reducers: {
        getList: Reducer<UserState>
    },
    effects: {
        getRemote: Effect
        deleteUser: Effect
    },
    subscriptions: {
        setUp: Subscription
    }
}

const UserModals: UserModalType = {
    namespace: 'users',
    state: {
        data: [],
        meta: {
            total:  0,
            per_page: 5 ,
            page: 1
        }
    },
    reducers: {
        getList(state, { payload }) { 
            console.log('reducer here')
            return payload
        }
    },
    effects: {
        *getRemote({payload:{page,per_page}}, { put, call }) {
            const data = yield call(getRemoteList,{page,per_page})
            if (data) {
                console.log('getRomete')
                yield put({
                    type: 'getList',
                    payload: data
                })
                console.log('getRomete success')
            }
        },
        // *edit({ payload: { id, values } }, { put, call,select }) {
        //     const data = yield call(editRecord, { id, values })
        //     if (data) {
        //         message.success('edit successs')
        //         const {page,per_page} = yield select((state: any)=>{return state.users.meta})
                
        //         yield put({
        //             type: 'getRemote',
        //             payload:{
        //                 page: page,
        //                 per_page: per_page
        //             }
        //         })
        //     } else {
        //         message.error('edit fail')
        //     }

        // },
        // *add({ payload: { values } }, { put, call,select }) {
        //     const data = yield call(addUser, { values })
        //     if (data) {
        //         message.success('add successs')
        //         const {page,per_page} = yield select((state:any)=>{return state.users.meta})
        //         yield put({
        //             type: 'getRemote',
        //             payload:{
        //                 page: page,
        //                 per_page: per_page
        //             }
        //         })
        //     } else {
        //         message.error('add fail')
        //     }

        // },
        *deleteUser({ payload: { id } }, { put, call,select }) {
            const data = yield call(deleteUser, { id })
            if (data) {
                message.success('del successs')
                const {page,per_page} = yield select((state:any)=>{return state.users.meta})
                
                yield put({
                    type: 'getRemote',
                    payload:{
                        page: page,
                        per_page: per_page
                    }
                })
            } else {
                message.error('del fail')
            }
        }
    },
    subscriptions: {
        setUp({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/users'){
                    console.log('subscript here')
                    dispatch({
                        type: 'getRemote',
                        payload:{
                            page: 1,
                            per_page:5
                        }
                    })
                }

            })

        }
    }
}

export default UserModals