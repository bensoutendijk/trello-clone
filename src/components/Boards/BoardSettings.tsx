import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { deleteBoard, updateBoard } from '../../store/boards/actions';

function BoardSettings() {
  const params: { boardid: string } = useParams();
  const boards = useSelector((state: RootState) => state.boards);
  const board = boards.byId[params.boardid];

  const dispatch = useDispatch();

  const handleDelete = function() {
    if (board) {
      dispatch(deleteBoard(board._id));
    }
  }

  const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {

  }

  const boardSettingsPages = [
    {
      title: "General",
      options: [
        {
          type: "text",
          section: "Board",
          label: "Board Name",
          onChange: handleChange,
        },
        {
          type: "button",
          section: "danger",
          danger: true,
          label: "Delete board",
          onClick: handleDelete,
        }
      ]
    }
  ]

  return (
    <div className="BoardSettings modal fade show" role="dialog" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Board Settings</h5>
            <Link to={`/boards/${params.boardid}`} className="close" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </Link>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <Link to={`/boards/${params.boardid}`} className="btn btn-secondary">Close</Link>
            <button className="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoardSettings;