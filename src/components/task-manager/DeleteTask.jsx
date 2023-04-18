import axios from "axios";
import { Button, Modal, Spinner } from "react-bootstrap"
import { SuccessAlert, ValidationAlert } from "../../utils/alerts";

function DeleteTask(props) {

    const { task, show, handleClose, filterTask, loading, setLoading } = props;

    const handleDelete = () => {

        setLoading(true)
        // Axios delete task
        axios
            .post(`${process.env.REACT_APP_API_URL}/delete-activity?activity_id=${task.id}`)
            .then((res) => {
                if (res.data.status === false) {
                    ValidationAlert(res.data.status_message)
                    setLoading(false)
                } else {
                    setLoading(false)
                    SuccessAlert(res.data.status_message)
                    console.log(res.data)
                    filterTask(task)
                    handleClose()
                }
            }).catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Do you wish to delete activity {task.activity_name}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={loading === true}>{loading === true ? <Spinner color="#fff" /> : 'Close'}</Button>
                    <Button variant="primary" onClick={handleDelete} disabled={loading === true}>{loading === true ? <Spinner color={'#fff'} /> : 'Confirm'}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteTask