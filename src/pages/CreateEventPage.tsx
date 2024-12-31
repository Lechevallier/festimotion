import AddEventForm from '../components/AddEventForm';

interface CreateEventPageProps {
  onSuccess: () => void;
}

export default function CreateEventPage({ onSuccess }: CreateEventPageProps) {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="max-w-2xl mx-auto">
        <AddEventForm onSuccess={onSuccess} />
      </div>
    </div>
  );
}