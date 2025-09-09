import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Task } from './TaskLine';

const Popup = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  z-index: 2000;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
`;

const EditContainer = styled.div`
  background: #fff;
  border-radius: 0;
  padding: 2rem;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  max-width: 100vw;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  @media (min-width: 900px) {
    position: fixed;
    top: 70px;
    right: 0;
    width: 50vw;
    height: 100vh;
    box-shadow: -2px 0 16px rgba(0,0,0,0.08);
    border-radius: 0;
    min-width: 300px;
    max-width: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  form {
    width: 90%;
    margin: 0 auto;
  }
  form > div > input,
  form > div > select {
    width: 100%;
    font-size: 1rem;
    box-sizing: border-box;
    max-width: 100%;
  }
`;

interface TaskEditProps {
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (id: number) => void;
  assigneeOptions?: string[];
}

const TaskEdit: React.FC<TaskEditProps> = ({ task, onClose, onSave, onDelete, assigneeOptions = [] }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<Task | null>(task);
  const [prevForm, setPrevForm] = useState<Task | null>(task);

  React.useEffect(() => {
    setForm(task);
    setPrevForm(task);
  }, [task]);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      // Compare previous and new values
      let changes: string[] = [];
      if (prevForm) {
        if (prevForm.title !== form.title) changes.push(`Title: "${prevForm.title}" → "${form.title}"`);
        if (prevForm.description !== form.description) changes.push(`Description: "${prevForm.description}" → "${form.description}"`);
        if (prevForm.dueDate !== form.dueDate) changes.push(`Due Date: "${prevForm.dueDate}" → "${form.dueDate}"`);
        if (prevForm.status !== form.status) changes.push(`Status: "${prevForm.status}" → "${form.status}"`);
        if (prevForm.assignee !== form.assignee) changes.push(`Assignee: "${prevForm.assignee}" → "${form.assignee}"`);
      }
      toast.success(
        <div>
          <strong>Task Saved</strong><br />
          <span>{form.title}</span>
          {changes.length > 0 && (
            <ul style={{ margin: '0.5rem 0 0 0', padding: 0, listStyle: 'none' }}>
              {changes.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          )}
        </div>
      );
      setPrevForm(form);
      onSave(form);
    }
  };

  return (
    <Popup>
      <EditContainer>
        <button 
          type="button" 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: '#fff',
            border: '2px solid #d32f2f',
            color: '#d32f2f',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            cursor: 'pointer',
            zIndex: 100,
            padding: 0,
          }}
          aria-label="Close Edit"
        >
          <span style={{lineHeight: 1, fontWeight: 400}}>&#10006;</span>
        </button>
  <h3 style={{ marginLeft: '2.5rem' }}>
    {form.title === '' && form.description === '' ? 'ADD NEW TASK' : `Edit Task ${form.id}`}
  </h3>
        {showConfirm ? (
          <div style={{ marginBottom: '1rem' }}>
            <strong>ARE YOU SURE YOU WANT TO REMOVE the task "{form.title}"?</strong>
            <div style={{ marginTop: '1rem' }}>
              <button type="button" style={{ background: '#d32f2f', color: '#fff', marginRight: '1rem' }} onClick={() => { onDelete && form.id && onDelete(form.id); onClose(); }}>Delete</button>
              <button type="button" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        ) : null}
        <form onSubmit={handleSubmit} style={{ display: showConfirm ? 'none' : 'block' }}>
          <div>
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder={form.title === '' ? 'Type task name' : undefined}
            />
          </div>
          <div>
            <label>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder={form.description === '' ? 'Type description' : undefined}
            />
          </div>
          <div>
            <label>Due Date</label>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              required
              placeholder={form.dueDate === '' ? 'Select due date' : undefined}
            />
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange} required>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label>Assignee</label>
            <input
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              required
              placeholder={form.assignee === '' ? 'Type assignee name' : undefined}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {assigneeOptions.map(name => (
                <span
                  key={name}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: name === form.assignee ? '#43ea43' : '#f6f8fa',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: name === form.assignee ? '2px solid #0070f3' : '1px solid #ccc',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => setForm({ ...form, assignee: name })}
                  // No hover effect, only selection highlight
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>Cancel</button>
          <button type="button" style={{ marginLeft: '1rem', background: '#d32f2f', color: '#fff' }} onClick={() => setShowConfirm(true)}>Delete</button>
        </form>
      </EditContainer>
    </Popup>
  );
};

export default TaskEdit;
