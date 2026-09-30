"use client";
import { useId, useRef, useState } from "react";
import type { Product } from "@/types/product";
import type { InquiryContext, InquiryType } from "@/types/inquiry";
import { LeadForm } from "./LeadForm";
export function InquiryModal({
  products,
  context,
  label = "Задать вопрос",
  title = "Подберём инвентарь вместе",
  className = "button",
  mode,
}: {
  products: Product[];
  context?: InquiryContext;
  label?: string;
  title?: string;
  className?: string;
  mode?: InquiryType;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const titleId = useId();
  function close() {
    dialog.current?.close();
  }
  return (
    <>
      <button
        ref={trigger}
        className={className}
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        {label}
        <span aria-hidden="true">↗</span>
      </button>
      <dialog
        ref={dialog}
        className="inquiry-dialog"
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) {
            const box = dialog.current.getBoundingClientRect();
            if (
              event.clientX < box.left ||
              event.clientX > box.right ||
              event.clientY < box.top ||
              event.clientY > box.bottom
            )
              close();
          }
        }}
      >
        <div className="dialog-header">
          <div>
            <p className="eyebrow">DDRu / личный подбор</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={close}
            aria-label="Закрыть форму"
          >
            ×
          </button>
        </div>
        {open && (
          <LeadForm
            products={products}
            context={{
              ...context,
              inquiryType:
                mode ??
                context?.inquiryType ??
                (context?.cartItems
                  ? "cart"
                  : context?.selection
                    ? "selection"
                    : context?.product
                      ? "product"
                      : "general"),
            }}
          />
        )}
      </dialog>
    </>
  );
}
