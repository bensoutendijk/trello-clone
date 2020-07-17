import React, { useRef, useState } from 'react';
import clsx from 'clsx';
// import update from 'immutability-helper';
import { useDrag, useDrop, DropTargetMonitor, XYCoord } from 'react-dnd';

import Card from 'react-bootstrap/Card';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

import CardView from '../Cards/CardView';
import CardNew from '../Cards/CardNew';
import { updateBoard, updateBoardForm } from '../../store/boards/actions';
import { deleteCategory } from '../../store/categories/actions';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const CategoryView: React.FC<CategoryViewProps> = function({ categoryid, index }) {
  const [state, setState] = useState<CategoryViewState>({});
  const boards = useSelector((state: RootState) => state.boards);
  const categories = useSelector((state: RootState) => state.categories);
  const cards = useSelector((state: RootState) => state.cards);
  const category = categories.byId[categoryid];
  const categoryCards = cards.allIds.filter((id) => cards.byId[id]?.categoryid === category?._id);

  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  // Event Handlers
  const handleToggleDropdown = function() {
    setState({
      ...state,
      dropdown: !state.dropdown,
    });
  };

  const handleDeleteCategory = function() {
    if (!category) {
      return;
    }

    setState({
      ...state,
      dropdown: false,
    });

    dispatch(deleteCategory(category._id));
  };

  // Dragging Logic

  const [, drop] = useDrop({
    accept: 'List',
    drop: (item: DragItem) => {
      if (typeof category === 'undefined') {
        return;
      }

      const boardForm = boards.form[category.boardid];

      if (typeof boardForm === 'undefined') {
        return;
      }

      dispatch(updateBoard(boardForm));
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const to = item.index;
      const from = index;

      // Don't replace items with themselves
      if (to === from) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleX =
      (hoverBoundingRect.left - hoverBoundingRect.right) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.right;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (to < from && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging upwards
      if (to > from && hoverClientX > hoverMiddleX) {
        return;
      }

      // Update board form
      if (typeof category === 'undefined') {
        return;
      }

      const boardForm = boards.form[category.boardid];

      if (typeof boardForm === 'undefined') {
        return;
      }


      // Use Immutability Helper
      // update(boardForm.categories, {
      //   $splice: [
      //     [from, 1],
      //     [to, 0, item.id],
      //   ],
      // });

      const categoryIds = boardForm.categories
        .reduce<string[]>(
        (prev, current, idx, self) => {
          if (from === to) {
            prev.push(current);
          }
          if (idx === from) {
            return prev;
          }
          if (from < to) {
            prev.push(current);
          }
          if (idx === to) {
            prev.push(self[from]);
          }
          if (from > to) {
            prev.push(current);
          }
          return prev;
        }, []);

      dispatch(updateBoardForm({
        ...boardForm,
        categories: categoryIds,
      }));

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = from;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'List', index },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div className="CategoryView" ref={ref}>
      <Card
        bg="light"
        className="CategoryView-card"
      >
        <div className="CategoryHeader">
          <span className="CategoryTitle">
            {category?.title}
          </span>
          <div className="dropdown">
            <button id={`delete-category-${category?._id}`} className="btn" onClick={handleToggleDropdown}>
              <i className="far fa-ellipsis-h"></i>
            </button>
            <div className={clsx('dropdown-menu', { show: state.dropdown })}>
              <button className="dropdown-item" onClick={handleDeleteCategory}>Delete</button>
            </div>
          </div>
        </div>
        <Card.Body>
          <div className="CardList">
            {categoryCards.map((id) => <CardView key={id} cardid={id} />)}
          </div>
          <CardNew categoryid={categoryid} />
        </Card.Body>
      </Card>

    </div>
  );
};

export default CategoryView;

export interface CategoryViewProps {
  categoryid: string;
  index: number;
}

export interface CategoryViewState {
  dropdown?: boolean;
}