import { IconButton, Modal, ModalContent, ModalHeader, Text } from '@chakra-ui/react';
import { useClasses } from 'hooks';
import { styles } from './Dialog.styles';

export const Dialog = ({ title, children, onClose, ...props }: any) => {
  const { dialogContainer, dialogTitle, paperStyles, closeButton } =
    useClasses(styles);
  const handleClose = () => {
    onClose && onClose({}, 'escapeKeyDown');
  };
  return (
    <Modal
      className={dialogContainer}
      PaperProps={{
        className: paperStyles,
      }}
      onClose={onClose}
      {...props}
    >
      <ModalContent>
        <div>
          <ModalHeader className={dialogTitle}>
            <Text variant="h4">{title}</Text>
            {onClose ? (
              <div>
                <IconButton
                  className={closeButton}
                  aria-label="close"
                  onClick={handleClose}
                >
                  &times;
                </IconButton>
              </div>
            ) : null}
          </ModalHeader>

          {children}
        </div>
      </ModalContent>
    </Modal>
  );
};
