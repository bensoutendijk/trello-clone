import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Droppable, Draggable } from 'react-beautiful-dnd';

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
  const params: { boardid: string } = useParams();

  const [state, setState] = useState<CategoryViewState>({});
  const categories = useSelector((state: RootState) => state.categories);
  const category = categories.byId[categoryid];
  const categoryForm = categories.form[categoryid];

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
    <Draggable draggableId={categoryid} index={index}>
      {(provided) => (
        <div className="CategoryView" {...provided.draggableProps} ref={provided.innerRef}>
          <Card
            bg="light"
            className="CategoryView-card"
          >
            <div className="CategoryHeader"  {...provided.dragHandleProps}>
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
              <Droppable droppableId={categoryid} type="card">
                {(provided) => (
                  <div className="CardList" {...provided.droppableProps} ref={provided.innerRef}>
                    {categoryForm?.cards.map((id, index) => <CardView key={id} cardid={id} index={index} />)}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <CardNew categoryid={categoryid} />
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
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