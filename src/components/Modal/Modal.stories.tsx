import React, { useRef, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Modal, Props } from './Modal';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Backdrop from '../Backdrop';

const meta: Meta = {
  title: 'Modal',
  component: Modal,
  argTypes: {
    id: { defaultValue: 'modal' },
    title: { defaultValue: 'Modal' },
  },
};

export default meta;

const Template: Story<Props> = (args) => {
  const modalButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const handleClose = (): void => {
    setOpen(false);
    modalButton.current?.focus();
  };
  args = {
    ...args,
    open: open,
    onClose: handleClose,
  };
  const handleClick: () => void = () => {
    setOpen(true);
  };
  return (
    <div>
      <Button
        data-testid="open-dialog"
        onClick={() => handleClick()}
        ref={modalButton}
        variant="outlined"
      >
        Open Modal
      </Button>
      <Modal {...args}>
        <div className="flex items-end justify-end p-4">
          <div className="w-80 h-40">
            {[...Array(3).keys()].map((el) => {
              const val = `Option ${el + 1}`;
              return (
                <Checkbox
                  id={val}
                  key={val}
                  label={val}
                  onChange={() => undefined}
                />
              );
            })}
          </div>
          <div className="flex gap-x-2">
            <Button
              data-testid="dialog-cancel"
              onClick={handleClose}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              data-testid="dialog-submit"
              onClick={() => undefined}
              variant="contained"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const Default = Template.bind({});

export const Transition = Template.bind({});

Transition.args = {
  transitionDuration: 500,
};

const LoadingSpinnerTemplate: Story = () => {
  const [open, setOpen] = useState(false);
  const handleClick: () => void = () => {
    setOpen(true);
    setTimeout((): void => {
      setOpen(false);
    }, 2500);
  };

  return (
    <div>
      <Button
        variant="outlined"
        data-testid="launch-spinner-button"
        onClick={() => handleClick()}
      >
        Launch Spinner
      </Button>
      <Backdrop displayOnly open={open} transitionDuration={700}>
        <div className="loading-spinner"></div>
      </Backdrop>
    </div>
  );
};

export const LoadingSpinner = LoadingSpinnerTemplate.bind({});
