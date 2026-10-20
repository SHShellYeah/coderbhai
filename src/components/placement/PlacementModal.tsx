import React from 'react';
import { CourseId } from '../../types';
import { ByteOnboardingModal } from '../onboarding/ByteOnboardingModal';

interface Props {
  courseId?: CourseId;
  onClose: () => void;
}

/**
 * Replaces the old placement quiz test with Byte's interactive personalized course plan & onboarding.
 */
export const PlacementModal: React.FC<Props> = ({ courseId, onClose }) => {
  return <ByteOnboardingModal initialCourseId={courseId} onClose={onClose} />;
};

export default PlacementModal;
