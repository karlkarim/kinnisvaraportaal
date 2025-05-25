import { useState } from "react";
import { Dialog } from "@headlessui/react";

const ChartModalWrapper = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Klikitav eelvaade ainult mobiilis */}
      <div className="sm:hidden cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="h-[180px] rounded-lg border p-2 bg-white shadow">
          <p className="text-sm text-center text-neutral-600">{title}</p>
          <div className="h-[120px] overflow-hidden opacity-40 pointer-events-none">
            {children}
          </div>
        </div>
      </div>

      {/* Tavaline desktop vaade */}
      <div className="hidden sm:block w-full">
        {children}
      </div>

      {/* Modal mobiilis */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 sm:hidden">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl bg-white rounded-xl p-4 shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{title}</h2>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 text-sm">Sulge</button>
            </div>
            <div className="h-[300px]">{children}</div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ChartModalWrapper; 