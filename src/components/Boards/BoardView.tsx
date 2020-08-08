import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import update from 'immutability-helper';

import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateBoard, updateBoardForm, fetchBoard } from '../../store/boards/actions';

import CategoryList from '../Categories/CategoryList';
import { BoardForm } from '../../store/boards/types';

function BoardView() {
  const params: { boardid: string } = useParams();

  const [formOpen, setFormOpen] = useState(false);

  const boards = useSelector((state: RootState) => state.boards);
  const board = boards.byId[params.boardid];
  const boardForm = useSelector((state: RootState) => state.boards.form[params.boardid]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getBoard = function() {
      dispatch(fetchBoard(params.boardid));
    };

    getBoard();
  }, [dispatch, params.boardid]);


  const onDragEnd = (res: DropResult) => {
    if (!board || !res.destination) {
      return;
    }

    if (board.categories.indexOf(res.draggableId) === res.destination.index) {
      return; // Dragged to same spot
    }

    switch (res.type) {
      case 'category':
        const originIndex = board.categories.indexOf(res.draggableId);
        const destinationIndex = res.destination.index;

        console.log(board.categories);
        console.log(update(board.categories, {
          $splice: [
            [originIndex, 1],
            [destinationIndex, 0, res.draggableId],
          ],
        }));

        const boardForm: BoardForm = {
          _id: board._id,
          title: board.title,
          categories: update(board.categories, {
            $splice: [
              [originIndex, 1],
              [destinationIndex, 0, res.draggableId],
            ],
          }),
        };

        updateBoard(boardForm);
        break;
      case 'card':
        break;
      default:
        break;
    }
  };

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
    <DragDropContext onDragEnd={onDragEnd}>
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
    </DragDropContext>
  );
}

export default BoardView;