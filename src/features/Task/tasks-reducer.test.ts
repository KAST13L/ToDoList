import {fetchTasksWorkerSaga, setTasksAC} from "./tasks-reducer";
import {call, put} from "redux-saga/effects";
import {GetTasksResponse, TaskStatuses, todolistsAPI} from "@app/api/todolists-api";
import {setAppStatusAC} from "@app/app/app-reducer";

let response: GetTasksResponse
beforeEach(() => {
    response = {
        error: null,
        totalCount: 3,
        items: [
            {
                status: TaskStatuses.Completed,
                title: '',
                id: '',
                addedDate: '3',
                description: '',
                deadline: '',
                order: 3,
                priority: 3,
                startDate: '',
                todoListId: "todolistId"
            },
        ]
    }
})

test('correct using fetchTasksWorkerSaga', () => {
    const todolistId = 'todolistId';
    const generator = fetchTasksWorkerSaga({type: '', todolistId: todolistId});

    expect(generator.next().value).toEqual(put(setAppStatusAC('loading')))

    expect(generator.next().value).toEqual(call(todolistsAPI.getTasks, todolistId))

    expect(generator.next(response).value).toEqual(put(setTasksAC(response.items, todolistId)))

    expect(generator.next().value).toEqual(put(setAppStatusAC('succeeded')))

    const gen = generator.next()
    expect(gen.value).toBeUndefined()
    expect(gen.done).toBeTruthy()
})

