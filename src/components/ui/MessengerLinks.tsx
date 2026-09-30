import { contacts, type Messenger } from "@/config/site";
export function MessengerLinks({
  preferred,
  destination = "contact",
}: {
  preferred?: Messenger;
  destination?: "contact" | "community";
}) {
  const source =
    destination === "community" ? contacts.communities : contacts.messengers;
  const links = [...source].sort(
    (a, b) => Number(b.id === preferred) - Number(a.id === preferred),
  );
  return (
    <div className="messenger-links">
      {links.map(({ id, label, href }) =>
        href ? (
          <a key={id} href={href} target="_blank" rel="noopener noreferrer">
            {label}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span
            key={id}
            className="contact-pending"
            aria-label={`${label}: контакт скоро появится`}
          >
            {label}
            <small>Скоро</small>
          </span>
        ),
      )}
    </div>
  );
}
