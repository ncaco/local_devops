type ContactFormContent = {
  labels: {
    name: string;
    email: string;
    details: string;
  };
  placeholders: {
    name: string;
    email: string;
    details: string;
  };
  submitLabel: string;
  helperText: string;
};

export default function ContactForm({ content }: { content: ContactFormContent }) {
  return (
    <form className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6">
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {content.labels.name}
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
          placeholder={content.placeholders.name}
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {content.labels.email}
        </label>
        <input
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
          placeholder={content.placeholders.email}
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
          {content.labels.details}
        </label>
        <textarea
          className="mt-2 h-32 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
          placeholder={content.placeholders.details}
        />
      </div>
      <button
        type="button"
        className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
      >
        {content.submitLabel}
      </button>
      <p className="text-xs text-slate-400">
        {content.helperText}
      </p>
    </form>
  );
}
