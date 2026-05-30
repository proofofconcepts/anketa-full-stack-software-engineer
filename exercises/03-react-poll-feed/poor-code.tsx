import { useEffect, useState } from 'react';

export default function PollFeed() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/polls')
      .then((res) => res.json())
      .then((data) => {
        setPolls(data);
        setLoading(false);
      });
  }, []);

  function vote(pollId, optionId) {
    fetch(`/api/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionId }),
    }).then(() => {
      fetch('/api/polls')
        .then((res) => res.json())
        .then((data) => setPolls(data));
    });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {polls.map((poll) => (
        <div
          key={poll.id}
          style={{ border: '1px solid black', margin: '10px', padding: '10px' }}
        >
          <h3>{poll.question}</h3>
          {poll.options.map((option) => (
            <button
              key={option.id}
              onClick={() => vote(poll.id, option.id)}
              style={{ margin: '5px', background: 'blue', color: 'white' }}
            >
              {option.text} ({option.votes})
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
