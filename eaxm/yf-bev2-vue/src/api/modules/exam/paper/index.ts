import request from '@/config/axios'

export const createApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/paper/create',
        data
    })
}

// 查找答题卡信�?export const quCardApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/qu/list-card',
        data
    })
}

// 查找详情用于答题
export const quDetailApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/qu/detail-for-answer',
        data
    })
}

// 交卷操作
export const handApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/paper/hand',
        data
    })
}

// 答题操作
export const fillAnswerApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/qu/fill-answer',
        data
    })
}

// 考试校验
export const preCheckApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/paper/pre-check',
        data
    })
}
// 考试详情
export const paperDetailApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/paper/detail',
        data
    })
}

// 考试实时状�?export const realTimeStateApi = (data: any) => {
    return request.post({
        url: '/api/exam/paper/paper/real-time-state',
        data
    })
}
