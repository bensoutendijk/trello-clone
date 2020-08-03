import React, { useState } from 'react';
import clsx from 'clsx';
import { Droppable } from 'react-beautiful-dnd';

import Card from 'react-bootstrap/Card';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

import CardView from '../Cards/CardView';
import CardNew from '../Cards/CardNew';
import { deleteCategory } from '../../store/categories/actions';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const CategoryView: React.FC<CategoryViewProps> = function({ categoryid, index }) {
  const [state, setState] = useState<CategoryViewState>({});
  const categories = useSelector((state: RootState) => state.categories);
  const cards = useSelector((state: RootState) => state.cards);
  const category = categories.byId[categoryid];
  const categoryCards = cards.allIds.filter((id) => cards.byId[id]?.categoryid === category?._id);

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

  return (
    <div className="CategoryView">
      <Card
        bg="light"
        className="CategoryView-card"
      >
        <div className="CategoryHeader">
          <span className="CategoryTitle">
            {category?.title}
          </span>
          <div className="dropdown">
            <button id={`delete-category-${categoryid}`} className="btn" onClick={handleToggleDropdown}>
              <i className="far fa-ellipsis-h"></i>
            </button>
            <div className={clsx('dropdown-menu', { show: state.dropdown })}>
              <button className="dropdown-item" onClick={handleDeleteCategory}>Delete</button>
            </div>
          </div>
        </div>
        <Card.Body>
          <Droppable droppableId={categoryid}>
            {(provided) => (
              <div className="CardList" {...provided.droppableProps} ref={provided.innerRef}>
                {categoryCards.map((id, index) => <CardView key={id} cardid={id} index={index} />)}
              </div>
            )}
          </Droppable>
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