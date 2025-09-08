import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTasks, deleteTask, updateTask } from '../features/tasksSlice';
import TaskLine, { Task } from '../components/TaskLine';
import TopBar from '../components/TopBar';
import TaskEdit from '../components/TaskEdit';
import styled from 'styled-components';

const Table = styled.table`
  width: 90%;
  border-collapse: collapse;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 10px;
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  background: #f6f8fa;
  border-bottom: 2px solid #eee;
  text-align: left;
  position: relative;
  transition: background 0.2s;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: #90ee90;
  }
  .arrows {
    margin-left: 4px;
    color: #228B22;
    font-weight: bold;
  }
  .arrow-hidden {
    display: none;
  }
  &:hover .arrow-hidden {
    display: inline;
    color: #888;
    font-weight: normal;
  }
`;

const sortFields = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
  { key: 'assignee', label: 'Assignee' },
];

const TasksPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [prevTask, setPrevTask] = useState<Task | null>(null);
  const [addingTask, setAddingTask] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<Task | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  // Add Task logic
  const handleAddTaskClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/todo/last', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Last todo response:', res.data);
      let maxId = 0;
      if (res.data && res.data.data && typeof res.data.data.maxID === 'number') {
        maxId = res.data.data.maxID;
      } else {
        toast.error('Unexpected response for last todo ID');
      }
      setNewTask({
        id: maxId + 1,
        title: '',
        description: '',
        dueDate: '',
        status: 'open',
        assignee: ''
      });
      setAddingTask(true);
    } catch (err) {
      toast.error('Failed to get last task ID');
    }
  };

  const handleNewTaskSave = (task: Task) => {
    dispatch(updateTask(task)); // You may want to use a createTask action instead
    setAddingTask(false);
    setNewTask(null);
    toast.success('New task added');
  };

  const handleNewTaskClose = () => {
    setAddingTask(false);
    setNewTask(null);
  };
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setPrevTask(task);
    router.push(`/tasks/${task.id}`);
  };

  const handleEditClose = () => {
    setSelectedTask(null);
    setPrevTask(null);
  };

  const handleEditSave = (task: Task) => {
    dispatch(updateTask(task));
    setSelectedTask(null);
    let changes: string[] = [];
    if (prevTask) {
      if (prevTask.title !== task.title) changes.push(`Title updated to "${task.title}"`);
      if (prevTask.description !== task.description) changes.push(`Description updated to "${task.description}"`);
      if (prevTask.dueDate !== task.dueDate) changes.push(`Due Date updated to "${task.dueDate}"`);
      if (prevTask.status !== task.status) changes.push(`Status updated to "${task.status}"`);
      if (prevTask.assignee !== task.assignee) changes.push(`Assignee updated to "${task.assignee}"`);
    }
    toast.success(
      <div>
        TASK UPDATED<br />
        <strong>{task.title}</strong>
        {changes.length > 0 && (
          <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
            {changes.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        )}
      </div>
    );
    setPrevTask(null);
  };

  // Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
    const aVal = a[sortBy as keyof Task];
    const bVal = b[sortBy as keyof Task];
    if (aVal === bVal) return 0;
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (field: string) => {
    let newDir: 'asc' | 'desc' = 'asc';
    if (sortBy === field) {
      newDir = sortDir === 'asc' ? 'desc' : 'asc';
    }
    setSortBy(field);
    setSortDir(newDir);
    const fieldLabel = sortFields.find(f => f.key === field)?.label || field;
    toast.info(`SORTED BY ${fieldLabel} ${newDir.toUpperCase()}`);
  };

  return (
    <>
      <TopBar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2rem 0 0 0', padding: '0 2rem' }}>
        <h2 style={{ margin: 0 }}>Tasks</h2>
        <button
          style={{
            background: '#43ea43',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            padding: '0.5rem 1.2rem',
            cursor: 'pointer',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          onClick={handleAddTaskClick}
        >
          <span style={{ fontSize: '1.3rem' }}>+</span> Add Task
        </button>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <Table>
        <thead>
          <tr>
            {sortFields.map((f, colIdx) => (
              <Th
                key={f.key}
                onClick={() => handleSort(f.key)}
                onMouseEnter={() => setHoveredCol(colIdx)}
                onMouseLeave={() => setHoveredCol(null)}
                style={hoveredCol === colIdx ? { background: '#90ee90' } : {}}
              >
                {f.label}
                <span className="arrows">
                  {sortBy === f.key && sortDir === 'asc' && <span>▲</span>}
                  {sortBy === f.key && sortDir === 'desc' && <span>▼</span>}
                  <span className="arrow-hidden">{sortDir === 'asc' ? '▼' : '▲'}</span>
                </span>
              </Th>
            ))}
            <Th>Delete</Th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8} style={{ textAlign: 'center' }}>Loading...</td></tr>
          ) : (
            sortedTasks.map((task: Task, rowIdx) => (
              <tr
                key={task.id}
                style={{ cursor: 'pointer', background: hoveredRow === rowIdx ? '#90ee90' : undefined }}
                onClick={() => handleTaskClick(task)}
                onMouseEnter={() => setHoveredRow(rowIdx)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {sortFields.map((f, colIdx) => (
                  <td
                    key={f.key}
                  >
                    {/* Task ID cell: show + icon on row hover */}
                    {f.key === 'id' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {task[f.key as keyof Task]}
                        {hoveredRow === rowIdx && (
                          <span
                            style={{ color: '#43ea43', fontSize: '1.3rem', cursor: 'pointer', marginLeft: 4 }}
                            title="Add task after"
                            onClick={async e => {
                              e.stopPropagation();
                              await handleAddTaskClick();
                            }}
                          >+
                          </span>
                        )}
                      </span>
                    ) : (
                      task[f.key as keyof Task]
                    )}
                  </td>
                ))}
                <td>
                  <span
                    style={{ cursor: 'pointer', color: '#d32f2f', fontSize: '1.2rem' }}
                    title="Delete"
                    onClick={e => { e.stopPropagation(); handleDelete(task.id); }}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {selectedTask && (
        <TaskEdit 
          task={selectedTask} 
          onClose={handleEditClose} 
          onSave={handleEditSave}
          onDelete={handleDelete}
          assigneeOptions={Array.from(new Set(tasks.map(t => t.assignee)).values()).filter(Boolean)}
        />
      )}
      {addingTask && newTask && (
        <TaskEdit
          task={newTask}
          onClose={handleNewTaskClose}
          onSave={handleNewTaskSave}
          assigneeOptions={Array.from(new Set(tasks.map(t => t.assignee)).values()).filter(Boolean)}
        />
      )}
    </>
  );
};


export default TasksPage;
