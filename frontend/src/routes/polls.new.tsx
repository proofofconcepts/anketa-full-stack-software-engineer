import { useNavigate } from '@tanstack/react-router';
import { CreatePollForm } from '../components/CreatePollForm';

export function CreatePollPage() {
  const navigate = useNavigate();

  return (
    <CreatePollForm onSuccess={() => void navigate({ to: '/' })} />
  );
}
