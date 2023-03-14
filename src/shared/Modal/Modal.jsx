import React, { useRef } from 'react'
import './Modal.scss'

const Modal = ({ id, label, children, ...rest } ) =>{
    const closeModal = useRef(null)
  return (
    <div id={id} className="modal fade " role="dialog" aria-hidden="true" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-white">
                <div className="modal-header">
                    <h5 className="modal-title">{label}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeModal}></button>
                </div>
                <div className="modal-body " {...rest}>
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal