import React from 'react';
import { useParams } from 'react-router-dom';

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
    <div className="CategoryList">
      {boardForm.categories.map((id, i) => {
        return (
          <CategoryView key={id} categoryid={id} index={i} />
        );
      })}
      <CategoryNew />
    </div>
  );
}

export default CategoryList;
