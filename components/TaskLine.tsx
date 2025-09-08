import React from 'react';
import styled from 'styled-components';

const Row = styled.tr`
  background: #fff;
  &:nth-child(even) {
    background: #f6f8fa;
  }
  &:hover {
    background: #90ee90 !important;
  }
`;

const Cell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #eee;
  text-align: left;
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  color: #d32f2f;
  font-size: 1.2rem;
  &:hover {
    color: #b71c1c;
  }
`;

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignee: string;
}

interface TaskLineProps {
  task: Task;
  onDelete: (id: number) => void;
  onClick?: () => void;
}

const TaskLine: React.FC<TaskLineProps> = ({ task, onDelete, onClick }) => (
  <Row onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <Cell>{task.id}</Cell>
    <Cell>{task.title}</Cell>
    <Cell>{task.description}</Cell>
    <Cell>{task.dueDate}</Cell>
    <Cell>{task.status}</Cell>
    <Cell>{task.assignee}</Cell>
    <Cell>
      <DeleteIcon title="Delete" onClick={e => { e.stopPropagation(); onDelete(task.id); }}>
        🗑️
      </DeleteIcon>
    </Cell>
  </Row>
);

export default TaskLine;
