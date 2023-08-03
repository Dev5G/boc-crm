import Modal from '@/components/ui/modal/modal';
import dynamic from 'next/dynamic';
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context';
const ComposerMessage = dynamic(
  () => import('@/components/message/compose-message')
);

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'COMPOSE_MESSAGE':
      return <ComposerMessage />;
    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
