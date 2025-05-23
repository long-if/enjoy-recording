import request from '@/lib/request';

export function useRegisterApi() {
    return {
        register: (data: object) => {
            return request({
                url: '/user/register',
                method: 'post',
                data,
            });
        },
    };
}
