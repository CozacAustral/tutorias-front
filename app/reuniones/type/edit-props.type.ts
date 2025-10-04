import { EditMeetingRow } from './edit-meeting-row.type';

export type Props = {
  isOpen: boolean;
  onClose: () => void;
  meeting: EditMeetingRow | null;
  onUpdated?: () => void;
};
