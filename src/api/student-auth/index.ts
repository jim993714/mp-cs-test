import { useRequest } from '@zsdx/mp-utils';

import type {
    AddressItem,
    Campus,
    ChangeConsumerVerifyReq,
    College,
    Feedback,
    School,
    StudentInfo,
    SubmitConsumerVerifyReq,
    Treatment,
    UpdateStudentCampus
} from './type';

const request = useRequest();

/**
 * 获取学校搜索建议
 */
export function getSchoolSuggest(params: { keyword: string }) {
    return request.post<School[]>('/student-school-shop/studentLocalInfo/getSchoolSuggest', params);
}

/**
 * 获取学校的学院列表
 * @param params
 * @returns
 */
export function getSchoolCollegeList(params: { schoolId: number; keyword: string }) {
    return request.post<College[]>(
        '/student-school-shop/studentLocalInfo/getSchoolCollegeList',
        params
    );
}

export function getClooegeClassList(params: { collegeNo: string }) {
    return request.post('/student-school-shop/studentLocalInfo/getCollegeClassList', params);
}

/**
 * 获取校区列表
 * @param params
 * @returns
 */
export function getSchoolCampusList(params: { schoolId: number }) {
    return request.post<Campus[]>(
        '/student-school-shop/studentLocalInfo/getSchoolCampusList',
        params
    );
}

/**
 * 提交消费者认证
 * @param params
 * @returns
 */
export function submitConsumerVerify(params: SubmitConsumerVerifyReq) {
    return request.post('/student-school-shop/studentCertification/submitConsumerVerify', params);
}

/**
 * 变更消费者认证
 * @param params
 * @returns
 */
export function changeConsumerVerify(params: ChangeConsumerVerifyReq) {
    return request.post('/student-school-shop/studentCertification/changeConsumerVerify', params);
}

/**
 * 获取学生认证信息
 * @param params
 * @returns
 */
export function getStudentVerify() {
    return request.post<StudentInfo>('/student-school-shop/studentCertification/getStudentVerify');
}

/**
 * 学生认证权益列表
 * @param params
 * @returns
 */
export function getStudentVerifyTreatmentList() {
    return request.post<Treatment[]>(
        '/student-school-shop/studentCertification/getStudentVerifyTreatmentList'
    );
}

/**
 * 补充校区信息,信息完善
 * @param params
 * @returns
 */
export function submitStudentCampus(params: object) {
    return request.post('/student-school-shop/studentCertification/submitStudentCampus', params);
}

/**
 * 获取省份城市学校级联数据
 * @returns
 */
export function getProvinceCityAreaTree() {
    return request.post<AddressItem[]>(
        '/student-school-shop/studentLocalInfo/getProvinceCityAreaTree'
    );
}

/**
 * 完善学生信息
 * @param params
 * @returns
 */
export function updateStudentCampus(params: UpdateStudentCampus) {
    return request.post('/student-school-shop/studentLocalInfo/submitStudentCampus', params);
}

/**
 * 修改校内员工学生信息
 * @param params
 * @returns
 */
export function changeStudentVerify(params: ChangeConsumerVerifyReq) {
    return request.post('/student-school-shop/studentCertification/changeStudentVerify', params);
}

/**
 * 投诉反馈
 * @param params
 * @returns
 */
export function feedback(params: Feedback) {
    return request.post('/student-school-shop/studentCertification/complain', params);
}
