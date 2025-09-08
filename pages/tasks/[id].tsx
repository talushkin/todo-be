import TopBar from '../../components/TopBar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchTasks } from '../../features/tasksSlice';
import styled from 'styled-components';
import TaskLine, { Task } from '../../components/TaskLine';
import TaskEdit from '../../components/TaskEdit';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem auto;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
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

const TaskEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [sortBy, setSortBy] = React.useState<string>('id');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

  React.useEffect(() => {
    if (!tasks.length) dispatch(fetchTasks());
  }, [dispatch, tasks.length]);

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
  };

  const task = tasks.find(t => t.id === Number(id));
  if (!task) return <div style={{textAlign:'center',marginTop:'2rem'}}>Task not found</div>;

  return (
    <>
  <TopBar />
  <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Tasks</h2>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <Table>
        <thead>
          <tr>
            {sortFields.map(f => (
              <Th
                key={f.key}
                onClick={() => handleSort(f.key)}
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
            sortedTasks.map((task: Task) => (
              <TaskLine key={task.id} task={task} onDelete={() => {}} />
            ))
          )}
        </tbody>
      </Table>
      <TaskEdit 
        task={task} 
        onClose={() => router.push('/tasks')} 
        onSave={() => router.push('/tasks')} 
        assigneeOptions={Array.from(new Set(tasks.map(t => t.assignee)).values()).filter(Boolean)}
      />
    </>
  );
};

export default TaskEditPage;
