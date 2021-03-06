import { delay } from '@/utils/utils';
import _ from 'lodash';
import * as courseService from '@/services/course';
import * as cloudServices from '@/services/cloud';
import HISTORY from '@/assets/fakers/history';
import { message } from 'antd';

const initialState = {
    info: null,
    history: {
        list: null,
        hasMore: true
    },
    goals: {
        whatLearns: null,
        requirements: null,
        targetStudents: null
    },
    syllabus: null,
    landing: null,
    price: null,
    messages: null,
};

export default {
    namespace: 'course',
    state: initialState,
    effects: {
        *fetchInfo({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchInfo, courseId);
            if (response) {
                const courseInfo = response.data;
                yield put({
                    type: 'saveInfo',
                    payload: courseInfo
                });
            }
        },
        *fetchHistory({ payload: courseId }, { call, put }) {
            yield delay(1500);
            yield put({
                type: 'saveHistory',
                payload: {
                    data: HISTORY,
                    hasMore: true
                }
            });
        },
        *moreHistory({ payload: courseId }, { call, put, select }) {
            yield delay(5000);
            yield put({
                type: 'pushHistory',
                payload: {
                    data: HISTORY,
                    hasMore: false
                }
            });
        },
        *seenHistory({ payload: historyId }, { call, put, select }) {
            //const { info: { noOfUnseen } } = yield select(state => state.course);
            yield put({
                type: 'seenHistoryItem',
                payload: historyId
            });
            yield put({
                type: 'decreNoOfUnseen'
            });
            yield delay(1200);
            //call api with historyId
        },
        *allSeenHistory({ payload: courseId }, { call, put }) {
            yield delay(1200);
            //if ok --> put, else do nothing,
            //if ok -> get noOfUnseen
            yield put({
                type: 'allSeenHistoryItems',
                payload: {
                    noOfUnseen: 0
                }
            });
        },
        *fetchGoals({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchGoals, courseId);
            if (response) {
                const goals = response.data;
                yield put({
                    type: 'saveGoals',
                    payload: goals
                });
            }
        },
        *changeWhatLearns({ payload }, { call, put }) {
            const {
                courseId,
                change
            } = payload;
            const response = yield call(courseService.updateWhatLearns, courseId, change);
            if (response) {
                const {
                    data: {
                        progress,
                        data: updatedData
                    }
                } = response;
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'goals',
                        status: progress === 100
                    }
                });
                yield put({
                    type: 'updateGoals',
                    payload: {
                        type: 'whatLearns',
                        data: updatedData
                    }
                });
            }
        },
        *changeRequirements({ payload }, { call, put }) {
            const {
                courseId,
                change
            } = payload;
            const response = yield call(courseService.updateRequirements, courseId, change);
            if (response) {
                const {
                    data: {
                        progress,
                        data: updatedData
                    }
                } = response;
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'goals',
                        status: progress === 100
                    }
                });
                yield put({
                    type: 'updateGoals',
                    payload: {
                        type: 'requirements',
                        data: updatedData
                    }
                });
            }
        },
        *changeTargetStudents({ payload }, { call, put }) {
            const {
                courseId,
                change
            } = payload;
            const response = yield call(courseService.updateTargetStudents, courseId, change);
            if (response) {
                const {
                    data: {
                        progress,
                        data: updatedData
                    }
                } = response;
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'goals',
                        status: progress === 100
                    }
                });
                yield put({
                    type: 'updateGoals',
                    payload: {
                        type: 'targetStudents',
                        data: updatedData
                    }
                });
            }
        },
        *fetchSyllabus({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchSyllabus, courseId);
            if (response) {
                const syllabus = response.data;
                yield put({
                    type: 'saveSyllabus',
                    payload: syllabus
                });
            }
        },
        *addChapter({ payload }, { call, put }) {
            const { courseId, title, description, callback } = payload;
            const response = yield call(courseService.addChapter, courseId, title, description);
            if (response) {
                const {
                    progress,
                    data: newChapter
                } = response.data;
                yield put({
                    type: 'pushChapter',
                    payload: newChapter
                });
                yield put({
                    type: 'pushChapterInCourseInfo',
                    payload: _.pick(newChapter, ['_id', 'lectures', 'title'])
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'syllabus',
                        status: progress === 100
                    }
                });
                if (callback) callback();
            }
        },
        *updateChapter({ payload }, { call, put }) {
            const { courseId, chapterId, title, description, callback } = payload;
            const response = yield call(courseService.updateChapter, courseId, chapterId, title, description);
            if (response) {
                const newChapter = response.data;
                yield put({
                    type: 'changeChapter',
                    payload: newChapter
                });
                yield put({
                    type: 'changeChapterInCourseInfo',
                    payload: {
                        _id: chapterId,
                        title
                    }
                });
                if (callback) callback();
            }
        },
        *deleteChapter({ payload }, { call, put }) {
            const { courseId, chapterId } = payload;
            const response = yield call(courseService.deleteChapter, courseId, chapterId);
            if (response) {
                const progress = response.data && response.data.progress;
                yield put({
                    type: 'removeChapter',
                    payload: chapterId
                });
                yield put({
                    type: 'removeChapterInCourseInfo',
                    payload: chapterId
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'syllabus',
                        status: progress === 100
                    }
                });
            }
        },
        *addLecture({ payload }, { call, put }) {
            const {
                courseId,
                chapterId,
                title,
                type,
                callback
            } = payload;
            const response = yield call(courseService.addLecture, courseId, chapterId, type, title);
            if (response) {
                const {
                    progress,
                    data: newLecture
                } = response.data;
                yield put({
                    type: 'pushLecture',
                    payload: {
                        chapterId,
                        lecture: newLecture
                    }
                });
                yield put({
                    type: 'pushLectureInCourseInfo',
                    payload: {
                        chapterId,
                        lecture: _.pick(newLecture, ['_id', 'type', 'title'])
                    }
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'syllabus',
                        status: progress === 100
                    }
                });
                if (callback) callback();
            }
        },
        *updateLecture({ payload }, { call, put }) {
            const {
                courseId,
                chapterId,
                lectureId,
                title,
                type,
                callback
            } = payload;
            const response = yield call(courseService.updateLecture, courseId, chapterId, lectureId, type, title);
            if (response) {
                const lecture = response.data;
                yield put({
                    type: 'changeLecture',
                    payload: {
                        chapterId,
                        lecture
                    }
                });
                yield put({
                    type: 'changeLectureInCourseInfo',
                    payload: {
                        chapterId,
                        lecture: _.pick(lecture, ['_id', 'title', 'type'])
                    }
                });
                if (callback) callback();
            }
        },
        *deleteLecture({ payload }, { call, put }) {
            const { courseId, chapterId, lectureId } = payload;
            const response = yield call(courseService.deleteLecture, courseId, chapterId, lectureId);
            if (response) {
                const progress = response.data & response.data.progress;
                yield put({
                    type: 'removeLecture',
                    payload: {
                        chapterId,
                        lectureId
                    }
                });
                yield put({
                    type: 'removeLectureInCourseInfo',
                    payload: {
                        chapterId,
                        lectureId
                    }
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'syllabus',
                        status: progress === 100
                    }
                });
            }
        },
        *fetchLanding({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchLanding, courseId);
            if (response) {
                yield put({
                    type: 'saveLanding',
                    payload: response.data
                });
            }
        },
        *changeBasicInfo({ payload }, { call, put }) {
            const {
                courseId,
                ...params
            } = payload;
            const response = yield call(courseService.updateBasicInfo, courseId, params);
            if (response) {
                const {
                    progress,
                    data: updatedData
                } = response.data;
                yield put({
                    type: 'pushLanding',
                    payload: updatedData
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'landing',
                        status: progress === 100
                    }
                });
            }
        },
        *changeAvatar({ payload }, { call, put }) {
            const { courseId, formData, callback } = payload;
            let response;
            response = yield call(cloudServices.uploadCourseAvatar, courseId, formData);
            if (response) {
                const avatarUrl = response.data.url;
                response = yield call(courseService.updateAvatar, courseId, avatarUrl);
                if (response) {
                    const {
                        progress,
                        data
                    } = response.data;
                    yield put({
                        type: 'pushLanding',
                        payload: data
                    });
                    yield put({
                        type: 'saveCompleteStatus',
                        payload: {
                            type: 'landing',
                            status: progress === 100
                        }
                    });
                    if (callback) callback();
                }
            }
        },
        *fetchPrice({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchPrice, courseId);
            if (response) {
                yield put({
                    type: 'savePrice',
                    payload: response.data
                });
            }
        },
        *changePrice({ payload }, { call, put }) {
            const { courseId, value } = payload;
            const response = yield call(courseService.updatePrice, courseId, value);
            if (response) {
                const {
                    progress,
                    data: price
                } = response.data;
                yield put({
                    type: 'savePrice',
                    payload: price
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'price',
                        status: progress === 100
                    }
                });
            }
        },
        *fetchMessages({ payload: courseId }, { call, put }) {
            const response = yield call(courseService.fetchMessages, courseId);
            if (response) {
                yield put({
                    type: 'saveMessages',
                    payload: response.data
                })
            }
        },
        *changeMessages({ payload }, { call, put }) {
            const {
                courseId,
                welcome,
                congratulation
            } = payload;
            const response = yield call(courseService.updateMessages, courseId, welcome, congratulation);
            if (response) {
                const {
                    progress,
                    data: updatedData
                } = response.data;
                yield put({
                    type: 'saveMessages',
                    payload: updatedData
                });
                yield put({
                    type: 'saveCompleteStatus',
                    payload: {
                        type: 'messages',
                        status: progress === 100
                    }
                });
            }
        },
        *validate({ payload }, { call, put }) {
            const {
                courseId,
                onOk,
                onInvalidCourse,
                onInvalidStudent
            } = payload;
            const response = yield call(courseService.validate, courseId);
            if (response) {
                const validStatus = response.data;
                if (validStatus === 0) onOk();
                else if (validStatus === 1) onInvalidCourse();
                else onInvalidStudent();
            }
        }
    },
    reducers: {
        saveInfo(state, { payload }) {
            return {
                ...state,
                info: { ...payload }
            }
        },
        savePrivacy(state, { payload: value }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    privacy: value
                }
            };
        },
        saveCompleteStatus(state, { payload }) {
            const { type, status } = payload;
            return {
                ...state,
                info: {
                    ...state.info,
                    completeStatus: {
                        ...state.info.completeStatus,
                        [type]: status
                    }
                }
            };
        },
        pushChapterInCourseInfo(state, { payload: chapter }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [
                        ...state.info.syllabus,
                        chapter
                    ]
                }
            };
        },
        changeChapterInCourseInfo(state, { payload }) {
            const { _id: chapterId } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index] = {
                ...syllabusData[index],
                ...payload
            };
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                }
            };
        },
        removeChapterInCourseInfo(state, { payload: chapterId }) {
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: _.filter(state.info.syllabus, chapter => chapter._id !== chapterId)
                }
            };
        },
        pushLectureInCourseInfo(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures.push(lecture);
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                }
            };
        },
        changeLectureInCourseInfo(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            const lectureIndex = _.findIndex(syllabusData[index].lectures, ['_id', lecture._id]);
            syllabusData[index].lectures[lectureIndex] = {
                ...syllabusData[index].lectures[lectureIndex],
                ...lecture
            };
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                }
            };
        },
        removeLectureInCourseInfo(state, { payload }) {
            const { chapterId, lectureId } = payload;
            const syllabusData = _.cloneDeep(state.info.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures = _.filter(syllabusData[index].lectures, lecture => lecture._id !== lectureId);
            return {
                ...state,
                info: {
                    ...state.info,
                    syllabus: [...syllabusData]
                }
            };
        },
        resetInfo(state) {
            return {
                ...state,
                info: null
            }
        },
        saveHistory(state, { payload }) { 
            const { data, hasMore } = payload;
            return {
                ...state,
                history: {
                    list: data,
                    hasMore
                }
            };
        },
        pushHistory(state, { payload }) {
            const { data, hasMore } = payload;
            return {
                ...state,
                history: {
                    list: [...state.history.list, ...data],
                    hasMore
                }
            };
        },
        seenHistoryItem(state, { payload: historyId }) {
            const historyData = [...state.history.list];
            const index = _.findIndex(historyData, ['_id', historyId]);
            if (index > -1) historyData[index].seen = true;
            return {
                ...state,
                history: {
                    ...state.history,
                    list: [...historyData]
                }
            };
        },
        allSeenHistoryItems(state, { payload }) {
            const { noOfUnseen } = payload;
            return {
                ...state,
                info: {
                    ...state.info,
                    noOfUnseen
                },
                history: {
                    ...state.history,
                    list: _.map(state.history.list, history => ({
                        ...history,
                        seen: true
                    }))
                }
            }
        },
        decreNoOfUnseen(state) {
            return {
                ...state,
                info: {
                    ...state.info,
                    noOfUnseen: state.info.noOfUnseen - 1
                }
            };
        },
        resetHistory(state) {
            return {
                ...state,
                history: {
                    list: null,
                    hasMore: true
                }
            };
        },
        saveGoals(state, { payload }) {
            return {
                ...state,
                goals: { ...payload }
            };
        },
        updateGoals(state, { payload }) {
            const { type, data } = payload;
            return {
                ...state,
                goals: {
                    ...state.goals,
                    [type]: [...data]
                }
            };
        },
        resetGoals(state) {
            return {
                ...state,
                goals: {
                    whatLearns: null,
                    requirements: null,
                    targetStudents: null
                }
            };
        },
        saveSyllabus(state, { payload }) {
            return {
                ...state,
                syllabus: [...payload]
            };
        },
        resetSyllabus(state) {
            return {
                ...state,
                syllabus: null
            }
        },
        pushChapter(state, { payload: chapter }) {
            return {
                ...state,
                syllabus: [
                    ...state.syllabus,
                    chapter
                ]
            };
        },
        changeChapter(state, { payload }) {
            const { _id: chapterId } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index] = {
                ...syllabusData[index],
                ...payload
            };
            return {
                ...state,
                syllabus: [...syllabusData]
            };
        },
        removeChapter(state, { payload: chapterId }) {
            return {
                ...state,
                syllabus: _.filter(state.syllabus, chapter => chapter._id !== chapterId)
            };
        },
        pushLecture(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures.push(lecture);
            return {
                ...state,
                syllabus: [...syllabusData]
            };
        },
        changeLecture(state, { payload }) {
            const { chapterId, lecture } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            const lectureIndex = _.findIndex(syllabusData[index].lectures, ['_id', lecture._id]);
            syllabusData[index].lectures[lectureIndex] = {
                ...syllabusData[index].lectures[lectureIndex],
                ...lecture
            };
            return {
                ...state,
                syllabus: [...syllabusData]
            };
        },
        removeLecture(state, { payload }) {
            const { chapterId, lectureId } = payload;
            const syllabusData = _.cloneDeep(state.syllabus);
            const index = _.findIndex(syllabusData, ['_id', chapterId]);
            syllabusData[index].lectures = _.filter(syllabusData[index].lectures, lecture => lecture._id !== lectureId);
            return {
                ...state,
                syllabus: [...syllabusData]
            };
        },
        saveLanding(state, { payload }) {
            return {
                ...state,
                landing: { ...payload }
            };
        },
        pushLanding(state, { payload }) {
            return {
                ...state,
                landing: {
                    ...state.landing,
                    ...payload
                }
            };
        },
        resetLanding(state) {
            return {
                ...state,
                landing: null
            };
        },
        savePrice(state, { payload }) {
            return {
                ...state,
                price: payload
            };
        },
        resetPrice(state) {
            return {
                ...state,
                price: null
            };
        },
        saveMessages(state, { payload }) {
            return {
                ...state,
                messages: payload
            };
        },
        resetMessages(state) {
            return {
                ...state,
                messages: null
            };
        },
    }
};