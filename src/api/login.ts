import request from '@/lib/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口
 * @method login 用户登录
 */
export function useLoginApi() {
	return {
		login: (data: object) => {
			return request({
				url: '/user/login',
				method: 'post',
				data,
			});
		},
	};
}
