import React, { PropsWithChildren, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

export type ModalProps = PropsWithChildren<{
  isOpened: boolean;
  onClose: () => void;
  title?: string;
}>;

export const Modal = ({ children, isOpened, onClose, title }: ModalProps) => {
  return (
    <Transition appear show={isOpened} as={Fragment}>
      <Dialog as="div" className="relative z-10 font-default" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-50 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-50 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-hkGray rounded-lg shadow-lg py-5 px-6 text-left align-middle shadow-xl transition-all">
                {title && <Dialog.Title>{title}</Dialog.Title>}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
