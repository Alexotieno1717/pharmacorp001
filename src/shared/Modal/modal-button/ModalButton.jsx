import React from 'react';

const ModalButton = ({ target, label, onclick } ) =>{
  return (
    <button className='btn btn-info text-white mb-0 me-0 modal__button  mb-3 mb-md-0' type="button" data-bs-toggle="modal" data-bs-target={`#${target}`} onClick={onclick}>{label}</button>
    )
}

export default ModalButton