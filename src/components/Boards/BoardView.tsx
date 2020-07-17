import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateBoard, updateBoardForm, fetchBoard } from '../../store/boards/actions';

import CategoryList from '../Categories/CategoryList';

function BoardView() {
  const params: { boardid: string } = useParams();

  const [formOpen, setFormOpen] = useState(false);

  const boards = useSelector((state: RootState) => state.boards);
  const board = boards.byId[params.boardid];
  const cards = useSelector((state: RootState) => state.cards);


  const dispatch = useDispatch();

  useEffect(() => {
    const getBoard = function() {
      dispatch(fetchBoard(params.boardid));
    };

    getBoard();
  }, [dispatch, params.boardid]);

  const handleChange = function(event: React.ChangeEvent<HTMLInputElement>): void {
    if (typeof board === 'undefined') {
      return;
    }

    const boardForm = boards.form[board._id];
    if (typeof boardForm === 'undefined') {
      return;
    }

    dispatch(updateBoardForm({
      ...boardForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleBlur = function(event: React.FocusEvent<HTMLInputElement>) {
    submitForm();
  };

  const handleSubmit = function(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitForm();
  };

  const submitForm = function() {
    if (typeof board === 'undefined') {
      return;
    }

    const boardForm = boards.form[board._id];
    if (typeof boardForm === 'undefined') {
      return;
    }

    dispatch(updateBoard(boardForm));

    setFormOpen(false);
  };

  if (typeof board === 'undefined') {
    return null;
  }

  if (typeof boards.form[board._id] === 'undefined') {
    return null;
  }

  return (
    <div className="BoardView">
      <Navbar variant="dark">
        {formOpen ? (
          <Form onSubmit={handleSubmit} className="BoardView-titleForm">
            <Form.Control
              autoFocus
              name="title"
              size="lg"
              value={boards.form[board._id]!.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Form>
        ) : (
          <Button
            className="BoardView-titleForm"
            variant="outline-dark"
            size="lg"
            style={{ color: 'white', fontWeight: 700 }}
            onClick={() => setFormOpen(true)}
            children={boards.form[board._id]!.title}
          />
        )}
      </Navbar>
      <CategoryList />
    </div>
  );
}

export default BoardView;