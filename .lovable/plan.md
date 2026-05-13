In `src/components/CourseCard.tsx`, hide ratings and student/duration rows for upcoming (unpublished) courses:

- Wrap the Rating block (lines 83-98) with `{isPublished && (...)}`.
- Wrap the Students & Duration block (lines 106-112) with `{isPublished && (...)}`.

No other changes.