import React from 'react';
import { useParams } from 'react-router-dom';
import { Droppable } from 'react-beautiful-dnd';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import CategoryView from './CategoryView';
import CategoryNew from './CategoryNew';

function CategoryList() {
  const params: { boardid: string } = useParams();
  const boardForm = useSelector((state: RootState) => state.boards.form[params.boardid]);

  if (typeof boardForm === 'undefined') {
    return null;
  }

  return (
    <Droppable droppableId={params.boardid} direction="horizontal" type="category">
      {(provided) => (
        <div className="CategoryList" {...provided.droppableProps} ref={provided.innerRef}>
          {boardForm.categories.map((id, index) => {
            return (
              <CategoryView key={id} categoryid={id} index={index} />
            );
          })}
          {provided.placeholder}
          <CategoryNew />
        </div>
      )}
    </Droppable>
  );
}

export default CategoryList;
