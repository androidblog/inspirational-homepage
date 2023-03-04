import './Tasks.css';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { query, collection, where, DocumentData } from 'firebase/firestore';
import { auth, db } from '../../app/firebase';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import TaskComponent from './Task';
import { selectTasksState, initializeTasksFromLocalStorage, Task, setTaskForEditFromFirestore, setTaskIDForEditFromFirestore, setTaskForEdit } from '../../features/tasks/tasksSlice';

const TASKS_COLLECTION = "tasks";
const FONT_ICON_SIZE = '2x';

export default function TaskList() {
  const dispatch = useAppDispatch();
  const { tasksList } = useAppSelector(selectTasksState);
  const [user, userLoading] = useAuthState(auth);

  const tasksQuery = query(collection(db, TASKS_COLLECTION), where("uid", "==", user?.uid || '-'));
  const [tasksData, loading, error] = useCollectionData(tasksQuery);
  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      dispatch(initializeTasksFromLocalStorage());
    }
    dispatch(setTaskForEdit(''));
  }, [user, userLoading, dispatch]);

  const { idTaskToLoadFromFireStore } = useAppSelector(selectTasksState);
  useEffect(() => {
    if (!idTaskToLoadFromFireStore) return;
    if (!tasksData) return;

    const taskFromFirestore = tasksData.find(el => el.id === idTaskToLoadFromFireStore);
    if (taskFromFirestore)
      dispatch(setTaskForEditFromFirestore({ ...taskFromFirestore } as Task));
    dispatch(setTaskIDForEditFromFirestore(''));
  }, [idTaskToLoadFromFireStore, tasksData, dispatch])


  const createTaskList = (taskList: Task[] | DocumentData[]) => {
    return (
      <ul>
        {taskList?.map((task) => (
          <TaskComponent
            key={task.id}
            id={task.id}
            text={task.text}
            done={task.done}
            bgColor={task.bgColor}
          />
        ))}
      </ul>
    );
  };

  const displayTasks = () => {
    if (!user && !userLoading) {
      return createTaskList(tasksList);
    }
    return (
      <>
        {loading ? (
          <p>
            <FontAwesomeIcon className='spinner' size={FONT_ICON_SIZE} icon={['fas', 'circle-notch']} />
          </p>
        ) : error ? (
          <p>Error loading</p>
        ) : tasksData ? (
          createTaskList(tasksData)
        ) : (
          <p>No tasks</p>
        )}
      </>
    );
  };

  return <div className='task-list'>{displayTasks()}</div>;
}
