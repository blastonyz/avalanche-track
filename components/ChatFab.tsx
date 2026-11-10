export default function ChatFab() {
  return (
    <a
      className="chat-fab"
      href="https://build.avax.network/chat"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir el chat de Avalanche Builder Hub"
      title="Chat de Avalanche"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
        <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" fill="#fff" />
        <circle cx="8" cy="11" r="1.5" fill="#e6212f" />
        <circle cx="12" cy="11" r="1.5" fill="#e6212f" />
        <circle cx="16" cy="11" r="1.5" fill="#e6212f" />
      </svg>
      <span>Chat</span>
    </a>
  );
}
