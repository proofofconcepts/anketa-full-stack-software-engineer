import { useEffect, useState } from 'react';

let globalPolls = [];
let globalUser = null;

export default function VotingApp() {
  const [polls, setPolls] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedPoll, setSelectedPoll] = useState(null);

  useEffect(() => {
    fetch('/api/polls')
      .then((r) => r.json())
      .then((data) => {
        globalPolls = data;
        setPolls(data);
      });

    fetch('/api/me')
      .then((r) => r.json())
      .then((data) => {
        globalUser = data;
        setUser(data);
      });
  }, []);

  function PollDetail({ poll }) {
    const [voted, setVoted] = useState(false);

    function handleVote(optionId) {
      fetch(`/api/polls/${poll.id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ optionId, userId: user.id }),
      }).then(() => {
        setVoted(true);
        fetch('/api/polls')
          .then((r) => r.json())
          .then((data) => {
            setPolls(data);
            setSelectedPoll(data.find((p) => p.id === poll.id));
          });
      });
    }

    return (
      <div>
        <h2>{poll.question}</h2>
        {poll.options.map((opt) => (
          <button key={opt.id} onClick={() => handleVote(opt.id)} disabled={voted}>
            {opt.text}: {opt.votes} votes
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      {selectedPoll ? (
        <PollDetail poll={selectedPoll} />
      ) : (
        polls.map((poll) => (
          <div key={poll.id} onClick={() => setSelectedPoll(poll)}>
            {poll.question}
          </div>
        ))
      )}
    </div>
  );
}
