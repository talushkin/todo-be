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
  const [page, setPage] = useState<number>(1);
  const PAGE_SIZE = 10;

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

  // Assignee filter state
  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee))).filter(Boolean);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(uniqueAssignees);
  useEffect(() => {
    setSelectedAssignees(uniqueAssignees);
  }, [tasks.length]);
  // Sorting logic
  const sortedTasks = [...tasks].sort((a, b) => {
    const aVal = a[sortBy as keyof Task];
    const bVal = b[sortBy as keyof Task];
    if (aVal === bVal) return 0;
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });
  // Filter by selected assignees
  const filteredTasks = selectedAssignees.length === 0 ? [] : sortedTasks.filter(t => selectedAssignees.includes(t.assignee));
  // Paginated tasks
  const paginatedTasks = filteredTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const handleSort = (field: string) => {
    let newDir: 'asc' | 'desc' = 'asc';
    if (sortBy === field) {
      newDir = sortDir === 'asc' ? 'desc' : 'asc';
    }
    setSortBy(field);
    setSortDir(newDir);
    setPage(1); // Reset to first page on sort
    const fieldLabel = sortFields.find(f => f.key === field)?.label || field;
    toast.info(`SORTED BY ${fieldLabel} ${newDir.toUpperCase()}`);
  };
  useEffect(() => {
    // Redirect to login if no token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You must log in to see tasks!');
        router.replace('/login');
      }
    }
  }, []);

  // Responsive style state for main container
  const [responsiveStyle, setResponsiveStyle] = React.useState({
    padding: '2rem 2rem',
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 900;
      setResponsiveStyle(isMobile
        ? { padding: '1rem 0.5rem' }
        : { padding: '2rem 2rem' }
      );
    }
  }, []);

  return (
  <>
    <TopBar />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '2rem 0 0 0', ...responsiveStyle }}>
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
    {/* Assignee filter controls */}
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '1rem 0 1.5rem 0', justifyContent: 'center' }}>
      {uniqueAssignees.map(name => (
        <button
          key={name}
          type="button"
          style={{
            padding: '0.4rem 0.8rem',
            background: selectedAssignees.includes(name) ? '#43ea43' : '#f6f8fa',
            borderRadius: '6px',
            cursor: 'pointer',
            border: selectedAssignees.includes(name) ? '2px solid #0070f3' : '1px solid #ccc',
            fontWeight: selectedAssignees.includes(name) ? 600 : 400,
            color: selectedAssignees.includes(name) ? '#222' : '#888',
            transition: 'background 0.2s',
          }}
          onClick={() => {
            if (selectedAssignees.includes(name)) {
              setSelectedAssignees(selectedAssignees.filter(n => n !== name));
            } else {
              setSelectedAssignees([...selectedAssignees, name]);
            }
            setPage(1);
          }}
        >{name}</button>
      ))}
      <button
        type="button"
        style={{
          padding: '0.4rem 0.8rem',
          background: selectedAssignees.length === uniqueAssignees.length ? '#43ea43' : '#f6f8fa',
          borderRadius: '6px',
          cursor: 'pointer',
          border: selectedAssignees.length === uniqueAssignees.length ? '2px solid #0070f3' : '1px solid #ccc',
          fontWeight: selectedAssignees.length === uniqueAssignees.length ? 600 : 400,
          color: selectedAssignees.length === uniqueAssignees.length ? '#222' : '#888',
          transition: 'background 0.2s',
        }}
        onClick={() => { setSelectedAssignees(uniqueAssignees); setPage(1); }}
      >All</button>
    </div>
    <Table>
          <thead>
            <tr>
              {sortFields.map((f, colIdx) => (
                <Th
                  key={f.key}
                  onClick={() => handleSort(f.key)}
                  onMouseEnter={() => setHoveredCol(colIdx)}
                  onMouseLeave={() => setHoveredCol(null)}
                  style={{
                    background:
                      sortBy === f.key
                        ? '#add8e6' // lightblue for selected sort column
                        : hoveredCol === colIdx
                        ? '#90ee90'
                        : undefined,
                  }}
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
              paginatedTasks.map((task: Task, rowIdx) => (
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
        {/* Pagination controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1.5rem 0' }}>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              marginRight: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              border: '1px solid #ccc',
              background: page === 1 ? '#eee' : '#fff',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              color: '#222', // black text
            }}
            onMouseEnter={e => { if (page !== 1) e.currentTarget.style.background = '#90ee90'; }}
            onMouseLeave={e => { if (page !== 1) e.currentTarget.style.background = '#fff'; }}
          >Prev</button>
          <span style={{ fontWeight: 500 }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={{
              marginLeft: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: 6,
              border: '1px solid #ccc',
              background: page === totalPages ? '#eee' : '#fff',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, color 0.2s',
              color: '#222', // black text
            }}
            onMouseEnter={e => { if (page !== totalPages) e.currentTarget.style.background = '#90ee90'; }}
            onMouseLeave={e => { if (page !== totalPages) e.currentTarget.style.background = '#fff'; }}
          >Next</button>
        </div>
        {selectedTask && (
          <>
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(30,30,30,0.7)', // dark grey transparent
              zIndex: 1500,
              pointerEvents: 'none',
              // Ensure overlay covers all screen sizes
              minWidth: '100vw',
              minHeight: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
            }} />
            <TaskEdit 
              task={selectedTask} 
              onClose={handleEditClose} 
              onSave={handleEditSave}
              onDelete={handleDelete}
              assigneeOptions={Array.from(new Set(tasks.map(t => t.assignee)).values()).filter(Boolean)}
            />
          </>
        )}
        {addingTask && newTask && (
          <>
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(30,30,30,0.7)', // dark grey transparent
              zIndex: 1500,
              pointerEvents: 'none',
              minWidth: '100vw',
              minHeight: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
            }} />
            <TaskEdit
              task={newTask}
              onClose={handleNewTaskClose}
              onSave={handleNewTaskSave}
              assigneeOptions={Array.from(new Set(tasks.map(t => t.assignee)).values()).filter(Boolean)}
            />
          </>
        )}
      </>
  );
};


export default TasksPage;
