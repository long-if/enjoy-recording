import request from '@/lib/request';

export function useNoteApi()  {
    return {
        getNotes()  {
            return request({
                url: '/note/getNotes',
                method: 'get',
            });
        },
        getNoteByKey(params: object)  {
            return request({
                url: '/note/getNoteByKey',
                method: 'get',
                params,
            });
        },
        updateNotes(data: object)   {
            return request({
                url: '/note/updateNotes',
                method: 'post',
                data,
            });
        },
        updateNoteByKey(data: object)   {
            return request({
                url: '/note/updateNoteByKey',
                method: 'post',
                data,
            });
        }
    }
}