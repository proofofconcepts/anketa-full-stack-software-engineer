import { useAuthStore } from '../store/auth.store';
import {
  CREATE_POLL_OPTIONS_MAX,
  CREATE_POLL_OPTIONS_MIN,
  CREATE_POLL_QUESTION_MAX,
  CREATE_POLL_QUESTION_MIN,
  useCreatePollStore,
} from '../store/create-poll.store';

export function CreatePollForm() {
  const { token } = useAuthStore();
  const {
    isCreating,
    draftQuestion,
    draftOptions,
    formError,
    setDraftQuestion,
    setDraftOption,
    addDraftOption,
    removeDraftOption,
    submitCreatePoll,
  } = useCreatePollStore();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await submitCreatePoll(token);
  }

  return (
    <section className="my-5 p-4 rounded-2xl bg-white border border-slate-200">
      <h2 className="mt-0 mb-4 text-base font-semibold">Create a Poll</h2>

      <form onSubmit={(e) => void handleSubmit(e)} noValidate>
        <div className="mb-3">
          <label htmlFor="poll-question" className="block text-sm font-medium mb-1">
            Question
          </label>
          <input
            id="poll-question"
            type="text"
            value={draftQuestion}
            onChange={(e) => setDraftQuestion(e.target.value)}
            placeholder={`Ask something… (${CREATE_POLL_QUESTION_MIN}–${CREATE_POLL_QUESTION_MAX} characters)`}
            maxLength={CREATE_POLL_QUESTION_MAX}
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#0ea5a4]"
          />
        </div>

        <fieldset className="mb-3 border-0 p-0 m-0">
          <legend className="text-sm font-medium mb-1">Options</legend>
          <div className="flex flex-col gap-2">
            {draftOptions.map((opt, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => setDraftOption(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0ea5a4]"
                />
                {draftOptions.length > CREATE_POLL_OPTIONS_MIN && (
                  <button
                    type="button"
                    onClick={() => removeDraftOption(idx)}
                    aria-label={`Remove option ${idx + 1}`}
                    className="text-slate-400 hover:text-rose-500 text-lg leading-none px-1"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {draftOptions.length < CREATE_POLL_OPTIONS_MAX && (
            <button
              type="button"
              onClick={addDraftOption}
              className="mt-2 text-sm text-[#0ea5a4] font-medium hover:underline"
            >
              + Add option
            </button>
          )}
        </fieldset>

        {formError ? (
          <p className="my-2 px-3 py-2 rounded-lg bg-rose-100 text-rose-700 text-sm">{formError}</p>
        ) : null}

        <button
          type="submit"
          disabled={isCreating}
          className="border-0 rounded-full bg-[#0ea5a4] text-white px-4 py-2.5 cursor-pointer font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating…' : 'Create Poll'}
        </button>
      </form>
    </section>
  );
}
