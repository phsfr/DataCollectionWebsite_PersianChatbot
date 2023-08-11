import React, { useEffect, useRef, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Modal } from 'semantic-ui-react'
const ErrorFallBackPage = (props) => {
  const history = useHistory()
  const onOk = () => {
    history.push('/')
    window.location.reload()
  }

  return (
    <Modal onClose={onOk} open={true}>
      <Modal.Header>
        <p className="modal-text">خطای اتّصال</p>
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p className="modal-text">در اتّصال شما با سرور خطایی رخ داد.</p>
          <p className="modal-text">
            از اتصال خود به اینترنت مطمئن شوید و پوزش ما را پذیرا باشید
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="برو به صفحه اصلی"
          labelPosition="right"
          icon="checkmark"
          color="blue"
          className="modal-button"
          onClick={onOk}
          primary
        />
      </Modal.Actions>
    </Modal>
  )
}
export default ErrorFallBackPage
