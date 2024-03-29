import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { composeStories } from '@storybook/testing-react';
import * as stories from './Modal.stories';
import { Modal } from './Modal';

configure({ adapter: new Adapter() });

const { Default } = composeStories(stories);

test('The Modal component renders a dialog element within a Backdrop component.', () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  const dialog = component.getByTestId('dialog') as HTMLDivElement;
  expect(backdrop.contains(dialog)).toBeTruthy();
});

test("When the dialog closes, the user's point of regard is maintained by returning focus to the Open Modal button.", async () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const cancel = component.getByTestId('dialog-cancel') as HTMLButtonElement;
  fireEvent.click(cancel);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  await waitFor(() => {
    expect(backdrop).not.toBeInTheDocument();
  });
  expect(open).toHaveFocus();
});

test('Escape key press unmounts the Modal component.', async () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  userEvent.keyboard('{Escape}');
  await waitFor(() => {
    expect(backdrop).not.toBeInTheDocument();
  });
});

test('Initial focus is set on the first input, which is the first focusable element.', () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  const firstFocusableElement = backdrop.querySelector('[tabindex = "0"]');
  expect(firstFocusableElement).toHaveFocus();
});

test('The page Tab sequence is contained within the scope of dialog.', () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  const initialFocusedElement = document.activeElement;
  let iterating = true;
  while (iterating) {
    userEvent.keyboard('{Tab}');
    const focusedElement = document.activeElement;
    if (!backdrop.contains(focusedElement)) break;
    if (focusedElement === initialFocusedElement) iterating = false;
  }
  expect(iterating).toBeFalsy();
});

test('The default Modal component renders with no transitionDuration prop.', () => {
  const component = mount(
    <Modal
      children={undefined}
      onClose={() => {
        return;
      }}
      open={false}
    />
  );
  expect(component.props().transitionDuration).toBeUndefined();
});

test('The default Modal component opens with a transition duration of less than 500 milliseconds.', async () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  const startTime: number = new Date().getUTCMilliseconds();
  fireEvent.click(open);
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  await waitFor(() => {
    expect(backdrop).toBeInTheDocument();
  });
  const endTime: number = new Date().getUTCMilliseconds();
  expect(endTime - startTime).toBeLessThan(500);
});

test('The default Modal component closes with a transition duration of less than 500 milliseconds.', async () => {
  const component = render(<Default {...Default.args} />);
  const open = component.getByTestId('open-dialog') as HTMLButtonElement;
  fireEvent.click(open);
  const cancel = component.getByTestId('dialog-cancel') as HTMLButtonElement;
  const startTime: number = new Date().getUTCMilliseconds();
  const backdrop = component.getByTestId('backdrop') as HTMLDivElement;
  fireEvent.click(cancel);
  await waitFor(() => {
    expect(backdrop).not.toBeInTheDocument();
  });
  const endTime: number = new Date().getUTCMilliseconds();
  expect(endTime - startTime).toBeLessThan(500);
});
