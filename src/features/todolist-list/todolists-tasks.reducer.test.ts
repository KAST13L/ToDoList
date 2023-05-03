import {tasksReducer, TasksStateType} from "@app/features/todolist-list/tasks/tasks.reducer";
import {
	TodolistDomainType,
	todolistsReducer,
	todolistsThunks
} from "@app/features/todolist-list/todolists/todolists.reducer";
import {useActions} from "@app/common/hooks/useActions";
import {TodolistType} from "@app/features/todolist-list/todolists/todolists.api";

const {addTodolist} = useActions(todolistsThunks)

test('ids should be equals', () => {
	const startTasksState: TasksStateType = {};
	const startTodolistsState: TodolistDomainType[] = [];

	let todolist: TodolistType = {
		title: 'new todolists',
		id: 'any id',
		addedDate: '',
		order: 0
	}

	const action = addTodolist.fulfilled({todolist: todolist}, 'requestId', todolist.title);

	const endTasksState = tasksReducer(startTasksState, action)
	const endTodolistsState = todolistsReducer(startTodolistsState, action)

	const keys = Object.keys(endTasksState);
	const idFromTasks = keys[0];
	const idFromTodolists = endTodolistsState[0].id;

	expect(idFromTasks).toBe(action.payload.todolist.id);
	expect(idFromTodolists).toBe(action.payload.todolist.id);
});
