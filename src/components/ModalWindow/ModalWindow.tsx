import LocationSelect from '../LocationSelection/LocationSelect'
import './ModalWindow.css'
import { selectShowModal, selectModalContent, closeModalWindow } from '../../features/modalWindow/modalWindow';
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import LoginForm from '../Authentication/LoginForm';

export default function ModalWindow() {
  const dispatch = useAppDispatch();
  const showModal: boolean = useAppSelector(selectShowModal);
  const modalWindowContent = useAppSelector(selectModalContent);

  const renderModalContent = () => {
    switch (modalWindowContent) {
      case 'LoginForm':
        return <LoginForm />;
      case 'locationSelect':
        return <LocationSelect />;
      default:
        return <></>
    }
  }

  return (
    <>{showModal &&
      <div className='modal'>
        <div className='overlay' onClick={() => dispatch(closeModalWindow())}></div>
        <div className='modal-container'>
          <span className="close" onClick={() => dispatch(closeModalWindow())}>&times;</span>
          {renderModalContent()}
        </div>
      </div>}
    </>
  )
}
