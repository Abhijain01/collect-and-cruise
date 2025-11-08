// frontend/src/components/Rating.tsx

import { Star, StarHalf } from 'lucide-react';
import styled from 'styled-components';

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
`;

const StarWrapper = styled.div`
  display: flex;
  color: #f59e0b; /* Amber 500 */
  
  [data-theme='dark'] & {
    color: #fcd34d; /* Amber 300 */
  }
`;

// This is the empty star style
const EmptyStar = styled(Star)`
  fill: none;
  stroke: currentColor;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

interface RatingProps {
  value: number;
  text?: string;
}

const Rating = ({ value, text }: RatingProps) => {
  return (
    <RatingWrapper>
      <StarWrapper>
        {/* Star 1 */}
        <span>
          {value >= 1 ? <Star size={16} fill="currentColor" /> : value >= 0.5 ? <StarHalf size={16} fill="currentColor" /> : <EmptyStar size={16} />}
        </span>
        {/* Star 2 */}
        <span>
          {value >= 2 ? <Star size={16} fill="currentColor" /> : value >= 1.5 ? <StarHalf size={16} fill="currentColor" /> : <EmptyStar size={16} />}
        </span>
        {/* Star 3 */}
        <span>
          {value >= 3 ? <Star size={16} fill="currentColor" /> : value >= 2.5 ? <StarHalf size={16} fill="currentColor" /> : <EmptyStar size={16} />}
        </span>
        {/* Star 4 */}
        <span>
          {value >= 4 ? <Star size={16} fill="currentColor" /> : value >= 3.5 ? <StarHalf size={16} fill="currentColor" /> : <EmptyStar size={16} />}
        </span>
        {/* Star 5 */}
        <span>
          {value >= 5 ? <Star size={16} fill="currentColor" /> : value >= 4.5 ? <StarHalf size={16} fill="currentColor" /> : <EmptyStar size={16} />}
        </span>
      </StarWrapper>
      {text && <RatingText>{text}</RatingText>}
    </RatingWrapper>
  );
};

export default Rating;